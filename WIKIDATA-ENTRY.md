# Wikidata Entry — Nadav Cohen (נדב כהן)

> Ready-to-paste Wikidata properties. Go to https://www.wikidata.org/wiki/Special:NewItem

## Step 1: Create Item

- **Label (en):** Nadav Cohen
- **Label (he):** נדב כהן
- **Description (en):** Israeli full-stack AI developer, creator of Mexicani and APEX Engine
- **Description (he):** מפתח Full-Stack ישראלי, יוצר מערכת Mexicani ומנוע APEX
- **Also known as (en):** NADAV.AI
- **Also known as (he):** נדב כהן מפתח

## Step 2: Add Statements

| Property | Code | Value |
|----------|------|-------|
| instance of | P31 | Q5 (human) |
| sex or gender | P21 | Q6581097 (male) |
| country of citizenship | P27 | Q801 (Israel) |
| occupation | P106 | Q5482740 (software developer) |
| occupation (2nd) | P106 | Q3068305 (entrepreneur) |
| languages spoken | P1412 | Q9288 (Hebrew) |
| languages spoken (2nd) | P1412 | Q1860 (English) |
| official website | P856 | https://nadavc.ai |
| GitHub username | P2037 | Nadav011 |
| Facebook ID | P2013 | nadav.cohen.167 |
| LinkedIn personal profile ID | P6634 | nadav-cohen-dev |
| email address | P968 | nadav@nadavc.ai |
| field of work | P101 | Q11660 (artificial intelligence) |
| field of work (2nd) | P101 | Q80006 (software engineering) |
| notable work | P800 | Mexicani (franchise management system) |
| notable work (2nd) | P800 | APEX Engine (code audit system) |

## Step 3: After Creation

1. Copy your new Q-ID (e.g., Q123456789)
2. Add it to nadavc.ai Person schema `sameAs`:
   ```
   "https://www.wikidata.org/wiki/Q123456789"
   ```
3. Rebuild and deploy

## Step 4: Verify Entity Recognition

After 4-8 weeks, check:
- Google NLP API: https://cloud.google.com/natural-language
- Kalicube KG Explorer: https://kalicube.pro/tools/knowledge-graph-explorer
- Search "Nadav Cohen" in incognito → look for Knowledge Panel
