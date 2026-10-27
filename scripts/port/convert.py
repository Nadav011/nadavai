"""HTML -> TSX and JS rewriting for scripts/port/sync.py.

The rules: every visible string becomes a deck lookup when its text matches a deck string exactly; asset paths become
/site/...; page links become locale routes; the shared chrome (header, footer, dock) becomes one component each.
"""
from __future__ import annotations

import json
import re
from typing import Callable

from bs4 import BeautifulSoup
from bs4.element import Comment, NavigableString, Tag

# prototype page -> route under /[locale]
PAGE_ROUTES = {
    'index': '', 'services': 'services', 'work': 'work', 'work-sporchat': 'work/sporchat', 'work-medizen': 'work/medizen',
    'work-green-room': 'work/green-room', 'my-branch': 'work/my-branch', 'mexicani-network': 'work/mexicani-network',
    'social': 'social', 'about': 'about', 'plans': 'plans', 'check': 'check', 'play': 'play', 'contact': 'contact',
    'accessibility': 'accessibility', 'privacy': 'privacy',
}
# the deck namespace each page's strings live in first (an identical string can exist under several ids)
PAGE_NS = {
    'index': ['home.', 'global.'], 'services': ['services.'], 'work': ['work.'], 'work-sporchat': ['sporchat.', 'work.'],
    'work-medizen': ['medizen.', 'work.'], 'work-green-room': ['greenroom.', 'work.'], 'my-branch': ['branch.', 'mybranch.'],
    'mexicani-network': ['network.', 'mexicani.'], 'social': ['social.'], 'about': ['about.'], 'plans': ['plans.'],
    'check': ['check.'], 'play': ['play.'], 'contact': ['contact.'], 'accessibility': ['legal.a11y', 'a11y.', 'legal.'],
    'privacy': ['legal.privacy', 'privacy.', 'legal.'], 'chrome': ['global.'],
}
PAGE_LINK = re.compile(r'^(' + '|'.join(map(re.escape, PAGE_ROUTES)) + r')\.html(#[\w-]*)?$')
ASSET_PREFIX = re.compile(r'^(assets|hero|sections|css|js)/')
HEB = re.compile(r'[֐-׿]')

INLINE = {'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span',
          'strong', 'sub', 'sup', 'time', 'u', 'wbr', 'del', 'ins'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}
NO_WS = {'ul', 'ol', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'select', 'colgroup', 'dl', 'picture', 'video', 'audio',
         'svg', 'g', 'defs', 'filter', 'lineargradient', 'radialgradient', 'clippath', 'mask', 'pattern', 'head', 'html'}
NUMERIC = {'tabIndex', 'maxLength', 'minLength', 'colSpan', 'rowSpan', 'cols', 'rows', 'size', 'span', 'start'}
TEXT_ATTRS = {'alt', 'aria-label', 'title', 'placeholder', 'aria-description', 'aria-roledescription', 'aria-valuetext'}
BOOL = {'hidden', 'disabled', 'required', 'checked', 'selected', 'open', 'inert', 'autofocus', 'multiple', 'novalidate',
        'playsinline', 'muted', 'loop', 'autoplay', 'defer', 'async', 'reversed', 'readonly', 'controls', 'allowfullscreen',
        'formnovalidate', 'itemscope', 'nomodule', 'default'}
HTML_ATTR = {
    'class': 'className', 'for': 'htmlFor', 'tabindex': 'tabIndex', 'readonly': 'readOnly', 'maxlength': 'maxLength',
    'minlength': 'minLength', 'autocomplete': 'autoComplete', 'autofocus': 'autoFocus', 'autocapitalize': 'autoCapitalize',
    'autocorrect': 'autoCorrect', 'spellcheck': 'spellCheck', 'enterkeyhint': 'enterKeyHint', 'inputmode': 'inputMode',
    'crossorigin': 'crossOrigin', 'fetchpriority': 'fetchPriority', 'srcset': 'srcSet', 'colspan': 'colSpan',
    'rowspan': 'rowSpan', 'contenteditable': 'contentEditable', 'datetime': 'dateTime', 'novalidate': 'noValidate',
    'playsinline': 'playsInline', 'autoplay': 'autoPlay', 'allowfullscreen': 'allowFullScreen',
    'referrerpolicy': 'referrerPolicy', 'frameborder': 'frameBorder', 'accesskey': 'accessKey',
    'formnovalidate': 'formNoValidate', 'hreflang': 'hrefLang', 'popovertarget': 'popoverTarget',
    'popovertargetaction': 'popoverTargetAction', 'itemprop': 'itemProp', 'itemscope': 'itemScope', 'itemtype': 'itemType',
    'xlink:href': 'xlinkHref', 'xmlns:xlink': 'xmlnsXlink', 'xml:space': 'xmlSpace', 'xml:lang': 'xmlLang',
    'charset': 'charSet', 'http-equiv': 'httpEquiv', 'cellpadding': 'cellPadding', 'cellspacing': 'cellSpacing',
    'usemap': 'useMap', 'nomodule': 'noModule', 'formaction': 'formAction', 'formmethod': 'formMethod',
    'accept-charset': 'acceptCharset', 'enctype': 'encType',
}
SVG_ATTR = {a.lower(): a for a in (
    'viewBox preserveAspectRatio gradientUnits gradientTransform patternUnits patternContentUnits patternTransform '
    'stdDeviation filterUnits primitiveUnits clipPathUnits maskUnits maskContentUnits markerWidth markerHeight '
    'markerUnits refX refY textLength lengthAdjust spreadMethod pathLength attributeName keyTimes keySplines repeatCount '
    'calcMode tableValues baseFrequency numOctaves kernelMatrix startOffset diffuseConstant specularExponent '
    'surfaceScale edgeMode targetX targetY xChannelSelector yChannelSelector').split()}
SVG_TAG = {t.lower(): t for t in (
    'linearGradient radialGradient clipPath textPath foreignObject animateTransform animateMotion feGaussianBlur '
    'feTurbulence feDisplacementMap feColorMatrix feOffset feMerge feMergeNode feBlend feComposite feFlood '
    'feMorphology feComponentTransfer feFuncA feFuncR feFuncG feFuncB feDropShadow feImage feTile '
    'feSpecularLighting feDiffuseLighting fePointLight feDistantLight feSpotLight feConvolveMatrix').split()}


def camel(s: str) -> str:
    return re.sub(r'[-:]([a-z])', lambda m: m.group(1).upper(), s)


def js(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


class Converter:
    def __init__(self, copy: dict[str, tuple[str, str]], pending: set[str], norm: Callable[[str], str]):
        self.copy, self.pending, self.norm = copy, pending, norm
        self.index: dict[str, list[str]] = {}
        for k, (he, _en) in copy.items():
            n = norm(he)
            if n and HEB.search(n):
                self.index.setdefault(n, []).append(k)
        self.rich_he: dict[str, str] = {}      # deck id (or id~n variant) -> Hebrew message with tags
        self.variants: dict[str, str] = {}     # variant key -> base deck id (for the English)
        self.misses: list[tuple[str, str]] = []
        self.js_misses: list[tuple[str, str]] = []
        self.used_pending: set[str] = set()
        self.js_ids: set[str] = set()
        self.page_meta: dict[str, dict] = {}
        self.stats = {'hit': 0, 'js': 0}
        self.ns: list[str] = []
        self.where = ''

    # ── strings ──────────────────────────────────────────────────────────────
    @staticmethod
    def icu(text: str) -> str:
        """Escape plain text for an ICU message: apostrophes before syntax characters, and tag openers."""
        text = re.sub(r"'(?=[{}<>#|])", "''", text)
        return text.replace('<', "'<'")

    def lookup(self, text: str) -> str | None:
        ids = self.index.get(self.norm(text))
        if not ids:
            return None
        def rank(k: str) -> tuple[int, int]:
            ns = next((i for i, p in enumerate(self.ns) if k.startswith(p)), len(self.ns))
            return (ns, 1 if k in self.pending else 0)
        best = min(ids, key=rank)
        if best in self.pending:
            self.used_pending.add(best)
        self.stats['hit'] += 1
        return best

    def key_for(self, deck_id: str, message: str) -> str:
        """One message key per distinct markup of a deck id: id, then id~2, id~3 ..."""
        n = 1
        key = deck_id
        while key in self.rich_he and self.rich_he[key] != message:
            n += 1
            key = f'{deck_id}~{n}'
        self.rich_he[key] = message
        if key != deck_id:
            self.variants[key] = deck_id
        return key

    def miss(self, text: str) -> None:
        t = self.norm(text)
        if HEB.search(t):
            self.misses.append((self.where, t[:140]))

    # ── attributes ───────────────────────────────────────────────────────────
    def url(self, v: str) -> str:
        if ASSET_PREFIX.match(v):
            return '/site/' + v
        return v

    def href(self, v: str) -> str | None:
        m = PAGE_LINK.match(v)
        if not m:
            return None
        return f'href({js(m.group(1))}{", " + js(m.group(2)) if m.group(2) else ""})'

    def style(self, v: str) -> str:
        parts = []
        for decl in re.split(r';(?![^(]*\))', v):
            if ':' not in decl:
                continue
            k, val = decl.split(':', 1)
            k, val = k.strip(), val.strip()
            val = re.sub(r'url\((["\']?)((?:assets|hero|sections)/[^)"\']+)\1\)', r'url(\1/site/\2\1)', val)
            parts.append(f'{js(k if k.startswith("--") else camel(k))}: {js(val)}')
        return '{{' + ', '.join(parts) + '} as import("react").CSSProperties}'

    def attrs(self, el: Tag, svg: bool) -> str:
        out = []
        for k, v in el.attrs.items():
            if isinstance(v, list):
                v = ' '.join(v)
            name = k
            if k in TEXT_ATTRS or (k.startswith('data-') and HEB.search(v or '')):
                if HEB.search(v or ''):
                    i = self.lookup(v)
                    if i:
                        out.append(f'{k}={{c({js(self.key_for(i, self.icu(self.norm(v))))})}}')
                        continue
                    self.miss(v)
            if k == 'style':
                out.append(f'style={self.style(v)}')
                continue
            if k == 'href' and v.startswith('https://wa.me/') and 'text=' in v:
                from urllib.parse import unquote
                text = unquote(v.split('text=', 1)[1])
                i = self.lookup(text)
                if i:
                    out.append(f'href={{wa({js(self.key_for(i, self.icu(self.norm(text))))})}}')
                    continue
                self.miss(text)
            if k in ('href',):
                h = self.href(v)
                if h:
                    out.append(f'href={{{h}}}')
                    continue
                v = self.url(v)
            elif k in ('data-home-href',):
                pass
            elif k in ('src', 'poster', 'data-src') or (k.startswith('data-') and ASSET_PREFIX.match(v or '')):
                v = self.url(v)
            elif k in ('srcset', 'data-srcset'):
                v = ', '.join(self.url(p.strip()) for p in v.split(','))
            if el.name in ('input', 'textarea') and k == 'value':
                name = 'defaultValue'
            elif el.name == 'input' and k == 'checked':
                out.append('defaultChecked')
                continue
            elif k.startswith(('data-', 'aria-')):
                name = k
            elif svg:
                name = SVG_ATTR.get(k) or HTML_ATTR.get(k) or (camel(k) if '-' in k or ':' in k else k)
            else:
                name = HTML_ATTR.get(k, k)
            if name in NUMERIC and re.fullmatch(r'-?\d+', v or ''):
                out.append(f'{name}={{{v}}}')
                continue
            if k in BOOL and (v == '' or v == k):
                out.append(name)
            else:
                out.append(f'{name}={js(v)}')
        return (' ' + ' '.join(out)) if out else ''

    # ── elements ─────────────────────────────────────────────────────────────
    def tag(self, el: Tag, svg: bool) -> str:
        return SVG_TAG.get(el.name, el.name) if svg else el.name

    def is_inline_run(self, el: Tag) -> bool:
        for d in el.descendants:
            if isinstance(d, Tag) and d.name not in INLINE and d.name not in ('svg', 'path', 'img', 'rect', 'circle', 'g', 'line', 'polyline', 'polygon'):
                return False
        return True

    def rich(self, nodes: list, svg: bool) -> tuple[str, list[str]]:
        """The ICU message for a run of inline nodes, and its tag factories."""
        facs: list[str] = []
        def walk(kids) -> str:
            msg = ''
            for ch in kids:
                if isinstance(ch, Comment):
                    continue
                if isinstance(ch, NavigableString):
                    msg += self.icu(re.sub(r'[ \t\r\n]+', ' ', str(ch)))
                    continue
                name = f't{len(facs)}'
                facs.append('')
                idx = len(facs) - 1
                in_svg = svg or ch.name == 'svg'
                if ch.name in VOID or not ch.get_text().strip() or ch.name == 'svg':
                    facs[idx] = f'{name}: () => {self.element(ch, in_svg)}'
                    msg += f'<{name}></{name}>'
                else:
                    inner = walk(list(ch.children))
                    t = self.tag(ch, in_svg)
                    facs[idx] = f'{name}: (x) => <{t}{self.attrs(ch, in_svg)}>{{x}}</{t}>'
                    msg += f'<{name}>{inner}</{name}>'
            return msg
        m = walk(nodes).strip()
        return re.sub(r' {2,}', ' ', m), facs

    @staticmethod
    def text_of(nodes: list) -> str:
        return ''.join(n.get_text() if isinstance(n, Tag) else str(n) for n in nodes if not isinstance(n, Comment))

    def inline_ok(self, nodes: list) -> bool:
        for n in nodes:
            if isinstance(n, Tag) and (n.name not in INLINE and n.name not in ('svg', 'img') or not self.is_inline_run(n)):
                return False
        return True

    def run(self, nodes: list, svg: bool) -> str | None:
        """A deck lookup for a run of sibling nodes, or None."""
        text = self.text_of(nodes)
        if not HEB.search(text) or not self.inline_ok(nodes):
            return None
        i = self.lookup(text)
        if not i:
            return None
        msg, facs = self.rich(nodes, svg)
        key = self.key_for(i, msg)
        lead = '{" "}' if re.match(r'\s', text) else ''
        trail = '{" "}' if re.search(r'\s$', text) else ''
        if facs:
            return f'{lead}{{r({js(key)}, {{ {", ".join(facs)} }})}}{trail}'
        return f'{lead}{{c({js(key)})}}{trail}'

    def children(self, el: Tag, svg: bool) -> str:
        """JSX for el's children. The longest run of siblings whose text is a deck string becomes one lookup."""
        if el.name in ('script', 'style', 'textarea'):
            return ''
        kids = [k for k in el.children if not isinstance(k, Comment)]
        return self.cover(el, kids, 0, len(kids), svg)

    def cover(self, el: Tag, kids: list, lo: int, hi: int, svg: bool) -> str:
        if lo >= hi:
            return ''
        if HEB.search(self.text_of(kids[lo:hi])):
            for size in range(hi - lo, 0, -1):
                for i in range(lo, hi - size + 1):
                    seg = kids[i:i + size]
                    # a run starts and ends on text-bearing nodes, and a lone element converts itself
                    if not self.text_of(seg[:1]).strip() or not self.text_of(seg[-1:]).strip():
                        continue
                    if sum(1 for x in seg if isinstance(x, Tag) or str(x).strip()) == 1 and isinstance(seg[0], Tag):
                        continue
                    hit = self.run(seg, svg)
                    if hit:
                        return self.cover(el, kids, lo, i, svg) + hit + self.cover(el, kids, i + size, hi, svg)
        out = []
        for n in range(lo, hi):
            ch = kids[n]
            if isinstance(ch, NavigableString):
                s = str(ch)
                if not s.strip():
                    if el.name in NO_WS or n == 0 or n == len(kids) - 1:
                        continue
                    out.append('{" "}')
                    continue
                txt = re.sub(r'[ \t\r\n]+', ' ', s)
                if n == 0:
                    txt = txt.lstrip()
                if n == len(kids) - 1:
                    txt = txt.rstrip()
                self.miss(txt)
                out.append('{' + js(txt) + '}')
            else:
                out.append(self.element(ch, svg))
        return ''.join(out)

    def element(self, el: Tag, svg: bool = False) -> str:
        svg = svg or el.name == 'svg'
        name = self.tag(el, svg)
        a = self.attrs(el, svg)
        if el.name in ('script', 'style'):
            body = el.string or ''
            if el.name == 'script' and el.get('type') not in ('application/json', 'application/ld+json'):
                return ''
            return f'<{name}{a} dangerouslySetInnerHTML={{{{ __html: {js(body)} }}}} />'
        if el.name == 'textarea' and el.get_text().strip():
            a += f' defaultValue={js(el.get_text())}'
            return f'<{name}{a} />'
        if el.name in VOID:
            return f'<{name}{a} />'
        inner = self.children(el, svg)
        if not inner:
            return f'<{name}{a} />' if svg or el.name not in ('div', 'span', 'p', 'i', 'b', 'a', 'button', 'canvas', 'ol', 'ul') else f'<{name}{a}></{name}>'
        return f'<{name}{a}>{inner}</{name}>'

    # ── pages ────────────────────────────────────────────────────────────────
    CHROME = {'chrome-header': 'header.html', 'chrome-footer': 'footer.html', 'chrome-dock': 'dock.html'}
    COMPONENT = {'chrome-header': 'SiteHeader', 'chrome-footer': 'SiteFooter', 'chrome-dock': 'SiteDock'}

    def signature(self, el: Tag) -> str:
        return f'{el.name}#{el.get("id", "")}.{" ".join(el.get("class", []))}'

    def module(self, comp: str, body: str, sha_note: str, props: str = '') -> str:
        imports = ''.join(f'import {{ {self.COMPONENT[k]} }} from "./{k}"\n' for k in self.COMPONENT if f'<{self.COMPONENT[k]}' in body)
        return (f'// Generated by scripts/port/sync.py from {sha_note}. Do not edit by hand: change the converter and re-run it.\n'
                f'import {{ getSiteCopy }} from "@/lib/site/copy"\n{imports}\n'
                f'export {"async function" if True else ""} {comp}({{ locale{props} }}: {{ locale: string{", home?: boolean" if props else ""} }}) {{\n'
                f'  const {{ {", ".join(h for h in ("c", "r", "href", "wa") if re.search(rf"\b{h}\(", body)) or "c"} }} = await getSiteCopy(locale)\n'
                f'  return (\n    <>{body}</>\n  )\n}}\n')

    def page(self, page: str, html: str) -> dict[str, str]:
        out: dict[str, str] = {}
        soup = BeautifulSoup(html, 'html.parser')
        self.where = page
        self.ns = PAGE_NS.get(page, []) + ['global.']

        head = soup.head
        meta: dict = {'route': PAGE_ROUTES[page], 'css': [], 'preload': [], 'importmap': False}
        for l in head.find_all('link'):
            rel = ' '.join(l.get('rel', []))
            href = l.get('href', '')
            if rel == 'stylesheet' and not href.startswith('http'):
                meta['css'].append('/site/' + href)
            elif rel == 'preload':
                meta['preload'].append({k: (('/site/' + v) if k == 'href' else v) for k, v in l.attrs.items() if k != 'rel'})
        meta['importmap'] = bool(soup.find('script', attrs={'type': 'importmap'}))
        for key, sel in (('title', ('title', {})), ('description', ('meta', {'name': 'description'})),
                         ('ogTitle', ('meta', {'property': 'og:title'})), ('ogDescription', ('meta', {'property': 'og:description'}))):
            t = head.find(*sel)
            val = (t.get_text() if key == 'title' else t.get('content', '')) if t else ''
            look = re.sub(r'\s*·\s*NadavAI$', '', val) if key == 'title' else val
            meta[key] = {'id': self.lookup(look) if HEB.search(look) else None, 'text': val}
        og = head.find('meta', attrs={'property': 'og:image'})
        meta['ogImage'] = og.get('content', '').replace('https://nadavc.ai/assets/', '/site/assets/') if og else None
        body = soup.body
        meta['bodyClass'] = ' '.join(body.get('class', []))
        meta['bodyData'] = {k[5:]: v for k, v in body.attrs.items() if k.startswith('data-')}
        mods = [s.get('src') for s in body.find_all('script') if s.get('type') == 'module' and s.get('src')]
        meta['module'] = '/site/' + mods[0] if mods else None
        self.page_meta[page] = meta

        # swap the chrome for its components
        chrome_sigs: dict[str, set[str]] = {}
        for comp, frag in self.CHROME.items():
            fsoup = BeautifulSoup(self.fragments[frag], 'html.parser')
            chrome_sigs[comp] = {self.signature(e) for e in fsoup.find_all(recursive=False) if isinstance(e, Tag)}
        for comp, sigs in chrome_sigs.items():
            first = True
            for el in list(body.find_all(True)):
                if el.parent is None:
                    continue
                if self.signature(el) in sigs and el.find_parent(lambda p: self.signature(p) in sigs) is None:
                    if first:
                        el.replace_with(BeautifulSoup(f'<x-{comp}></x-{comp}>', 'html.parser').find(f'x-{comp}'))
                        first = False
                    else:
                        el.decompose()
        for s in body.find_all('script'):
            if s.get('type') not in ('application/json', 'application/ld+json'):
                s.decompose()

        jsx = self.children(body, False)
        for comp, name in self.COMPONENT.items():
            jsx = re.sub(rf'<x-{comp}\s*/?>(</x-{comp}>)?', f'<{name} locale={{locale}}{" home" if page == "index" and comp == "chrome-dock" else ""} />', jsx)
        out[f'page-{page}'] = self.module(f'Page_{page.replace("-", "_")}', jsx, f'{page}.html at {self.sha}')

        if page == 'index':
            for comp, frag in self.CHROME.items():
                self.where = frag
                self.ns = ['global.']
                fsoup = BeautifulSoup(f'<body>{self.fragments[frag]}</body>', 'html.parser')
                fj = self.children(fsoup.body, False)
                if comp == 'chrome-dock':
                    fj = fj.replace(' data-home-href="#check"', '').replace('href={href("check")}', 'href={home ? "#check" : href("check")}')
                out[comp] = self.module(self.COMPONENT[comp], fj, f'fragments/{frag} at {self.sha}', ', home' if comp == 'chrome-dock' else '')
        return out

    def composite(self, text: str) -> list[str] | None:
        """A string joined from deck strings with ' · ' (a caption = line · label): the ids of its parts, or None."""
        parts = text.split(' · ')
        n = len(parts)
        def solve(i: int) -> list[str] | None:
            if i == n:
                return []
            for j in range(n, i, -1):
                piece = ' · '.join(parts[i:j])
                hit = self.index.get(self.norm(piece)) if HEB.search(piece) else None
                if hit:
                    rest = solve(j)
                    if rest is not None:
                        return [self.lookup(piece) or hit[0]] + rest
            return None
        return solve(0) if n > 1 else None

    # ── JS modules ───────────────────────────────────────────────────────────
    JS_STR = re.compile(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\$]|\\.|\$(?!\{))*)`")

    def js(self, rel: str, src: str) -> str:
        self.where = rel
        self.ns = ['global.']
        for p, ns in (('js/story/branch', 'branch.'), ('js/story/network', 'network.'), ('js/story/social', 'social.'),
                      ('js/story/playground', 'play.'), ('js/games/sporchat', 'sporchat.'), ('js/games/medizen', 'medizen.'),
                      ('js/games/greenroom', 'greenroom.'), ('js/check', 'check.'), ('hero/', 'home.'), ('js/work', 'work.'),
                      ('sections/avatar', 'avatar.'), ('js/main', 'home.'), ('js/sales', 'services.')):
            if rel.startswith(p):
                self.ns = [ns, 'global.']
        # template literals with an interpolation are not matched below; their asset prefix is fixed here
        src = re.sub(r'`(assets|hero/assets|sections/[a-z]+/assets)/', r'`/site/\1/', src)
        for old, new in self.patches.get(rel, []):
            if old not in src:
                raise SystemExit(f'patch for {rel} no longer applies: {old[:60]!r}')
            src = src.replace(old, new)
        lines = src.split('\n')
        out = []
        in_block = False
        for line in lines:
            stripped = line.lstrip()
            if in_block or stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
                in_block = (in_block or stripped.startswith('/*')) and '*/' not in line
                out.append(line)
                continue
            def sub(m: re.Match) -> str:
                q = m.group(0)[0]
                s = next(g for g in m.groups() if g is not None)
                pm = PAGE_LINK.match(s)
                if pm:
                    return f'__href({q}{pm.group(1)}{pm.group(2) or ""}{q})'
                if ASSET_PREFIX.match(s) and not s.startswith(('js/', 'css/')):
                    return f'{q}/site/{s}{q}'
                if HEB.search(s):
                    text = s.replace("\\'", "'").replace('\\"', '"')
                    i = self.lookup(text)
                    if i:
                        self.js_ids.add(i)
                        self.stats['js'] += 1
                        return f"__t('{i}')"
                    ids = self.composite(text)
                    if ids:
                        self.js_ids.update(ids)
                        self.stats['js'] += 1
                        return " + ' · ' + ".join(f"__t('{x}')" for x in ids)
                    self.js_misses.append((rel, self.norm(s)[:140]))
                return m.group(0)
            out.append(self.JS_STR.sub(sub, line))
        return '\n'.join(out)
