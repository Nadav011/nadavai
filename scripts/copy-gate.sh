#!/usr/bin/env bash
# copy-gate.sh: the prototype's copy gate (demos/site-v1/tools/copy-gate.sh), run on the ported site.
# Fails when a page shows a string the copy deck (COPY-FULL.md) rules out. It scans the visible text
# (text nodes, alt, aria-label, title, placeholder) of the 16 pages as the server renders them in Hebrew,
# and the string literals of the ported modules in public/site. A match inside a verbatim COPY-FULL string
# is approved copy, and so are the strings in scripts/copy-gate.allow.
#   usage: scripts/copy-gate.sh [base-url]     (default http://localhost:3000; the server must be running)
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
BASE="${1:-http://localhost:3000}"
DECK="${COPY_DECK:-$HOME/design-redesign/nadavc-ai/COPY-FULL.md}"
exec python3 -I - "$HERE" "$BASE" "$DECK" <<'PY'
import pathlib, re, sys, urllib.request
from html.parser import HTMLParser
root, base, deck_md = pathlib.Path(sys.argv[1]), sys.argv[2].rstrip('/'), pathlib.Path(sys.argv[3])
allow = [l.split('\t', 1)[1].strip() for l in (root / 'scripts/copy-gate.allow').read_text(encoding='utf-8').splitlines()
         if '\t' in l and not l.startswith('#')]
RULES = [
    ('"X, לא Y" / לא…', re.compile(r'(?<![א-ת])לא [^.]*\.')),
    ('"חינמית" as a name (deck: בדיקה לעסק + חינם)', re.compile(r'חינמית')),
    ('"לידים" (deck: פניות)', re.compile(r'לידים')),
    ('"פרודקשן" (deck: באוויר / עובד עכשיו)', re.compile(r'פרודקשן')),
    ('"במקביל" (internal jargon)', re.compile(r'במקביל')),
    ('"עוגן" (internal jargon)', re.compile(r'עוגן')),
    ('"בעלים ו" (deck: Co-Founder & CTO)', re.compile(r'בעלים ו')),
    ('English game tag', re.compile(r'\b(QUEST|REC|STEP|PLAYER(?: SELECT| 1)?|SELECT(?:ED)?|LEVEL(?: UP)?|GOALS?|AI CHECK|FREE|BOSS(?: LEVEL)?|PRESS START|SKILL(?: TREE)?|PLAYGROUND|BEFORE|AFTER|SOON|BADGE(?: UNLOCKED)?|ENGINEER|BIO|P1)\b')),
]
ROUTES = ['', 'services', 'work', 'work/sporchat', 'work/medizen', 'work/green-room', 'work/my-branch', 'work/mexicani-network',
          'social', 'about', 'plans', 'check', 'play', 'contact', 'accessibility', 'privacy']
class Text(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True); self.skip = 0; self.out = []
    BLOCK = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'div', 'section', 'article', 'header', 'footer', 'nav',
             'button', 'a', 'figcaption', 'label', 'td', 'th', 'dt', 'dd', 'summary', 'small', 'br', 'option'}
    def handle_starttag(self, tag, attrs):
        if tag in self.BLOCK: self.out.append(' ')
        if tag in ('script', 'style'): self.skip += 1
        for k, v in attrs:
            if k in ('alt', 'aria-label', 'title', 'placeholder', 'data-line', 'data-name', 'data-lvup') and v: self.out.append(v)
    def handle_endtag(self, tag):
        if tag in self.BLOCK: self.out.append(' ')
        if tag in ('script', 'style'): self.skip -= 1
    def handle_data(self, d):
        if not self.skip and d.strip(): self.out.append(d)
segments = []
for r in ROUTES:
    url = f'{base}/he' + (f'/{r}' if r else '')
    p = Text(); p.feed(urllib.request.urlopen(url).read().decode('utf-8'))
    page = re.sub(r'[ \t\r\n]+', ' ', ''.join(p.out))
    segments += [('/he/' + r, s.strip()) for blk in page.split(' ') for s in re.split(r'(?<=[.?!…])\s+', blk) if s.strip()]
for f in sorted((root / 'public/site').rglob('*.js')):
    src = f.read_text(encoding='utf-8')
    src = re.sub(r'^\s*//[^\n]*$', '', src, flags=re.M)
    src = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    for m in re.finditer(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`", src):
        s = next(g for g in m.groups() if g is not None)
        if re.search(r'[א-ת]', s) or re.fullmatch(r'[A-Z][A-Z ]{1,}', s or ''):
            segments.append((str(f.relative_to(root)), s))
deck = []
if deck_md.exists():
    for line in deck_md.read_text(encoding='utf-8').splitlines():
        cells = [c.strip() for c in line.split('|')]
        if len(cells) > 3 and cells[1].startswith('`'):
            deck += [c for c in cells[2:4] if c]
else:
    print(f'copy-gate: {deck_md} not found, so deck strings are not exempt', file=sys.stderr)
fails = []
for where, s in segments:
    for name, rx in RULES:
        for m in rx.finditer(s):
            hit = m.group(0)
            if any(a in s or s in a for a in allow) or any(hit.lower() in d.lower() for d in deck):
                continue
            fails.append(f'{where}: {name}: {hit[:90]}  «{s[:70]}»')
            break
for f in fails: print('FAIL', f)
print(f'copy-gate: {len(segments)} strings checked, {len(fails)} failures')
sys.exit(1 if fails else 0)
PY
