# NadavAI: strings the port needs that are in neither COPY-FULL.md nor COPY-GAP.md (draft)

Draft for Nadav's approval, in the deck's table format, so the design session can fold the rows into `COPY-FULL.md`.
`scripts/port/sync.py` reads this file after COPY-FULL and COPY-GAP; an id that reaches the deck wins over the row here.

## Global

| id | עברית | English | הערה |
|---|---|---|---|
| `global.theme.label` | מראה האתר | Site look | aria-label של מתג הלילה והיום. מחליף את "מראה האתר (לבדיקה)" של אב-הטיפוס |
| `global.theme.night` | לילה | Night | כפתור במתג, המראה הכהה (A) |
| `global.theme.day` | יום | Day | כפתור במתג, המראה הבהיר (B) |
