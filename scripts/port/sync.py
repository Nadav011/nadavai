#!/usr/bin/env python3
"""Port the NadavAI prototype (~/design-redesign/nadavc-ai/demos/site-v1) into this Next.js app.

Re-runnable: every output below is generated, so a prototype change is ported by running this again.
  python3 -I scripts/port/sync.py [--rev <git rev of the design repo>]   (default: its HEAD)

Outputs
  public/site/**                     the prototype's CSS, JS modules and assets, with document-relative paths
                                     made absolute and Hebrew string literals replaced by __t('<deck id>')
  messages/{he,en}.json              every string of COPY-FULL.md and COPY-GAP.md, keyed by deck id
                                     (dots become "/", because next-intl reads dots as nesting)
  messages/js-ids.json               the deck ids the JS modules read through window.__t
  components/site/generated/*.tsx    one server component per page, plus the shared chrome
  scripts/port/REPORT.md             what was ported, and every string that has no deck id yet
Needs Python 3.11+ and BeautifulSoup 4 (bs4).
"""
from __future__ import annotations

import argparse
import io
import json
import re
import shutil
import subprocess
import tarfile
from pathlib import Path

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))  # run with -I: the sibling modules are not on the path
from convert import Converter, PAGE_ROUTES  # noqa: E402  (same folder)
from js_patches import JS_PATCHES, PATCH_IDS  # noqa: E402

REPO = Path(__file__).resolve().parents[2]
DESIGN = Path.home() / 'design-redesign/nadavc-ai'
SITE = 'demos/site-v1'
PUBLIC = REPO / 'public/site'
GEN = REPO / 'components/site/generated'
MESSAGES = REPO / 'messages'

# prototype folders served as static files; html pages, proofs and tools stay behind
STATIC_DIRS = ['css', 'js', 'hero', 'sections', 'assets']
SKIP = re.compile(r'(^|/)(proof|tools|fragments|__pycache__)(/|$)|\.(html|md|py|DS_Store)$')

ID_RX = re.compile(r'^[A-Za-z0-9.\-]+$')


def norm(s: str) -> str:
    """The comparison form of a string: no markdown, entities decoded, whitespace collapsed."""
    import html
    s = re.sub(r'\*\*|`', '', s)
    s = html.unescape(s).replace('\u00a0', ' ')
    s = re.sub(r'\\u(?:200[ef]|206[6-9])|[\u200e\u200f\u2066-\u2069]', '', s)  # direction marks and isolates, also as JS escapes
    return re.sub(r'\s+', ' ', s).strip()


def read_deck(text: str) -> dict[str, tuple[str, str]]:
    out: dict[str, tuple[str, str]] = {}
    for line in text.splitlines():
        cells = [c.strip() for c in re.split(r'(?<!\\)\|', line)]
        if len(cells) > 4 and cells[1].startswith('`') and cells[1].endswith('`'):
            key = cells[1].strip('`')
            if ID_RX.match(key) and key not in out:
                out[key] = (cells[2].replace('\\|', '|'), cells[3].replace('\\|', '|'))
    return out


def write(path: Path, text: str, stale: set[str]) -> None:
    """Write only when the content changed, so an unchanged page does not trigger a dev-server rebuild."""
    stale.discard(path.name)
    if not path.exists() or path.read_text(encoding='utf-8') != text:
        path.write_text(text, encoding='utf-8')


def snapshot(rev: str, dest: Path) -> str:
    sha = subprocess.check_output(['git', '-C', str(DESIGN), 'rev-parse', '--short', rev], text=True).strip()
    tar = subprocess.check_output(['git', '-C', str(DESIGN), 'archive', rev, SITE, 'COPY-FULL.md', 'COPY-GAP.md'])
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    with tarfile.open(fileobj=io.BytesIO(tar)) as t:
        t.extractall(dest, filter='data')
    return sha


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--rev', default='HEAD')
    ap.add_argument('--tmp', default=str(REPO / '.port-snapshot'))
    a = ap.parse_args()

    tmp = Path(a.tmp)
    sha = snapshot(a.rev, tmp)
    src = tmp / SITE

    deck = read_deck((tmp / 'COPY-FULL.md').read_text(encoding='utf-8'))
    gap = read_deck((tmp / 'COPY-GAP.md').read_text(encoding='utf-8'))
    extra = read_deck((Path(__file__).parent / 'COPY-PORT.md').read_text(encoding='utf-8'))
    copy = {**extra, **gap, **deck}  # the approved deck wins over the drafts
    pending = (set(gap) | set(extra)) - set(deck)
    # a deck row that lists the items of a mock screen ("a · b · c") also gives each item its own id: <id>.1, <id>.2 ...
    for key, (h, e) in list(copy.items()):
        hs, es = norm(h).split(' · '), norm(e).split(' · ')
        if key.endswith(('.mock', '.items', '.list')) and len(hs) > 1:
            for n, part in enumerate(hs, 1):
                copy.setdefault(f'{key}.{n}', (part, es[n - 1] if len(es) == len(hs) else ''))
                if key in pending:
                    pending.add(f'{key}.{n}')

    conv = Converter(copy, pending, norm)
    conv.sha = sha
    conv.patches = JS_PATCHES
    conv.fragments = {f.name: f.read_text(encoding='utf-8') for f in (src / 'fragments').glob('*.html')}

    # 1. static files
    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)
    for d in STATIC_DIRS:
        for f in sorted((src / d).rglob('*')):
            rel = f.relative_to(src).as_posix()
            if f.is_dir() or SKIP.search(rel):
                continue
            out = PUBLIC / rel
            out.parent.mkdir(parents=True, exist_ok=True)
            if f.suffix == '.js':
                out.write_text(conv.js(rel, f.read_text(encoding='utf-8')), encoding='utf-8')
            else:
                shutil.copy2(f, out)

    # 2. pages and chrome
    # files are rewritten in place (a dev server watching the folder loses it when the folder is recreated)
    GEN.mkdir(parents=True, exist_ok=True)
    stale = {f.name for f in GEN.iterdir()}
    for page in PAGE_ROUTES:
        html = (src / f'{page}.html').read_text(encoding='utf-8')
        for name, tsx in conv.page(page, html).items():
            write(GEN / f'{name}.tsx', tsx, stale)
    exports = [f'import {{ Page_{p.replace("-", "_")} }} from "./page-{p}"' for p in PAGE_ROUTES]
    table = ',\n'.join(f'  {json.dumps(p)}: Page_{p.replace("-", "_")}' for p in PAGE_ROUTES)
    write(GEN / 'index.ts', '// Generated by scripts/port/sync.py. Do not edit by hand.\n' + '\n'.join(exports)
          + f'\n\nexport const PAGES = {{\n{table},\n}} as const\n', stale)
    write(GEN / 'pages.json', json.dumps(conv.page_meta, ensure_ascii=False, indent=2) + '\n', stale)
    for name in stale:
        (GEN / name).unlink()

    # 3. messages: every deck string, with the markup the prototype gives it (Hebrew), plus the deck English
    he, en = {}, {}
    for key, (h, e) in sorted(copy.items()):
        k = key.replace('.', '/')
        he[k] = conv.rich_he.get(key, conv.icu(norm(h)))
        en[k] = conv.rich_en.get(key) or (conv.icu(norm(e)) if norm(e) else he[k])
    # an English row with a placeholder whose Hebrew row is literal ("הפרויקט הבא · 02 / 03" / "Next project · {n} / 03"):
    # the number the Hebrew shows fills the English placeholder, since the page passes no value for it
    for k, v in en.items():
        names = re.findall(r'\{(\w+)\}', v)
        if names and not re.search(r'\{\w+\}', he[k]):
            nums = re.findall(r'\d+', re.sub(r'<[^>]+>', '', he[k]))
            for lit in re.findall(r'\d+', re.sub(r'\{\w+\}', '', v)):
                if lit in nums:
                    nums.remove(lit)
            if len(nums) == len(names):
                for name, num in zip(names, nums):
                    v = v.replace('{' + name + '}', num, 1)
                en[k] = v
    for key, base in conv.variants.items():
        he[key.replace('.', '/')] = conv.rich_he[key]
        en[key.replace('.', '/')] = conv.rich_en.get(key) or en[base.replace('.', '/')]
    MESSAGES.mkdir(exist_ok=True)
    (MESSAGES / 'he.json').write_text(json.dumps(he, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    (MESSAGES / 'en.json').write_text(json.dumps(en, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    # the root error boundary renders outside the intl provider, so it gets its few strings as a file of its own
    errs = {loc: {k: v for k, v in msgs.items() if k.startswith('error/')} for loc, msgs in (('he', he), ('en', en))}
    (MESSAGES / 'error.json').write_text(json.dumps(errs, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    (MESSAGES / 'js-ids.json').write_text(json.dumps(sorted(conv.js_ids | set(PATCH_IDS)), indent=1) + '\n', encoding='utf-8')

    # a plain lookup of a message with tags fails at render time (next-intl wants the tag functions): stop here instead
    plain = {m for f in GEN.glob('*.tsx') for m in re.findall(r'\bc\("([^"]+)"', f.read_text(encoding='utf-8'))}
    broken = sorted(k for k in plain if re.search(r'<t\d+>', he.get(k.replace('.', '/'), '')))
    if broken:
        raise SystemExit(f'plain lookups of messages with tags: {broken}')

    # 4. report
    lines = [f'# Port report\n', f'Prototype: `{DESIGN.name}` at `{sha}`. Deck ids: {len(deck)}, draft ids (COPY-GAP, pending approval): {len(pending)}.\n',
             f'Markup strings mapped to an id: {conv.stats["hit"]}; still literal (no id in either file): {len(conv.misses)}.',
             f'Ids used that are still draft-only: {len(conv.used_pending)}. JS literals replaced: {conv.stats["js"]}; JS literals left: {len(conv.js_misses)}.\n',
             '## Literal strings without a deck id\n']
    lines += [f'- `{w}`: {s}' for w, s in conv.misses]
    lines += ['\n## JS literals without a deck id\n'] + [f'- `{w}`: {s}' for w, s in conv.js_misses]
    (REPO / 'scripts/port/REPORT.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    shutil.rmtree(tmp)
    print(f'ported {sha}: {conv.stats["hit"]} strings mapped, {len(conv.misses)} literal, '
          f'{len(conv.used_pending)} draft ids, js {conv.stats["js"]} replaced / {len(conv.js_misses)} left')


if __name__ == '__main__':
    main()
