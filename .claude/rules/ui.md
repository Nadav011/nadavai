---
paths:
  - "components/**"
  - "app/**/*.tsx"
  - "app/**/*.css"
  - "public/site/**"
  - "scripts/port/**"
---

# UI rules for nadavc.ai

- The look lives in the prototype's CSS (`public/site/css`, `public/site/sections/*/*.css`), ported as is. Change it in `~/design-redesign/nadavc-ai/demos/site-v1` and re-run `scripts/port/sync.py`. Why: Nadav approved porting the CSS unchanged (ANSWERS #63), and a hand edit here is overwritten by the next sync.
- What the port itself adds (language switch, LTR arrows) goes in `app/[locale]/site-port.css`, with logical properties only. Why: it is the one stylesheet the sync does not own.
- Never edit `components/site/generated/*` or `public/site/**` by hand: change the converter (`scripts/port/convert.py`) or add an exact replacement to `scripts/port/js_patches.py`. Why: both are rewritten on every sync.
- Every visible string is a deck lookup. A new string gets a row in a deck file first (`scripts/port/COPY-PORT.md` until Nadav approves it). Why: the deck is the single source of the Hebrew and the English, and the copy gate checks against it.
- `html.reduce` (calm mode, or the device's reduced-motion setting) means no motion and no WebGL, and every page stays readable. Why: it is the site's only motion switch.
- Hebrew is RTL-first: logical properties (inline-start/end), never left/right. A direction-bound value gets a `[dir="ltr"]` variant. Why: the English pages render the same CSS left to right.
- Targets are at least 44px and text at least 12px, with no sideways scroll at 390px. Why: the WCAG 2.2 AA and phone checks the prototype was approved with.
