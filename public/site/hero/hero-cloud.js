// hero-cloud.js — v4 wiring: the curated cards (apps, social, client work), the cloud engine and the
// zoom layer. window.__cloud = { formShape(key), focusCard(id, {mode}), cards } for later sections.
//
// Curation rules: demo or fixture data only, no real club crests (SporChat's are pixelated), no faces
// of real people, no real customer names. `cycle` = the order of the hero's zoom-in moments.
import { createCloud } from './cloud.js';
import { createZoom } from './zoom.js';
import { create as createCode } from './hero-a.js';

// where a screen leads when it is clicked: the project's own page
function pageOf(id) {
  if (id.startsWith('social-')) return __href('social');
  if (id.startsWith('medizen')) return __href('work-medizen');
  if (id.startsWith('greenroom')) return __href('work-green-room');
  if (id.startsWith('sporchat')) return __href('work-sporchat');
  if (id.startsWith('cash')) return __href('my-branch');
  return __href('work');
}

export const CARDS = [
  // apps
  { id: 'medizen-3', cycle: 1, caption: 'קבע תור ל-16:30, ואת השאלה הרפואית העביר למטפלת. · MediZen · בוט בוואטסאפ' },
  { id: 'medizen-2', caption: 'כל היום של הקליניקה, במסך אחד. · MediZen · יומן' },
  { id: 'medizen-4', caption: 'קבע תור ל-16:30, ואת השאלה הרפואית העביר למטפלת. · MediZen · בוט בוואטסאפ' },
  { id: 'cash-collect', cycle: 3, caption: 'כמה כסף עוד אצל השליחים, עכשיו. · מזומן · הסניף שלי' },
  { id: 'cash-day', caption: 'ספירה, דוח והפקדה בסוף כל יום. · Z · סגירת קופה' },
  { id: 'cash-auto', caption: 'כמה כסף עוד אצל השליחים, עכשיו. · מזומן · הסניף שלי' },
  { id: 'cash-history', caption: 'כמה כסף עוד אצל השליחים, עכשיו. · מזומן · הסניף שלי' },
  { id: 'cash-collect-light', caption: 'כמה כסף עוד אצל השליחים, עכשיו. · מזומן · הסניף שלי' },
  { id: 'cash-deliveries-light', caption: 'כמה כסף עוד אצל השליחים, עכשיו. · מזומן · הסניף שלי' },
  { id: 'sporchat-room', cycle: 4, caption: "חדר צ'אט שנפתח עם שריקת הפתיחה. · SporChat · חדר משחק" },
  { id: 'greenroom-book', caption: 'שולחן, תשלום וקוד לדלת, בלי אף אחד בדלפק. · Green Room · הזמנה' },
  { id: 'greenroom-food', caption: 'שולחן, תשלום וקוד לדלת, בלי אף אחד בדלפק. · Green Room · הזמנה' },
  { id: 'greenroom-help', caption: 'שולחן, תשלום וקוד לדלת, בלי אף אחד בדלפק. · Green Room · הזמנה' },
  { id: 'greenroom-home', caption: 'שולחן, תשלום וקוד לדלת, בלי אף אחד בדלפק. · Green Room · הזמנה' },
  { id: 'greenroom-intro', caption: 'שולחן, תשלום וקוד לדלת, בלי אף אחד בדלפק. · Green Room · הזמנה' },
  // social: the Green Room social system + client work
  { id: 'social-gr-food', cycle: 2, caption: 'פוסט מוכן, מתוזמן ל-20:00. · Green Room · תוכן ותזמון' },
  { id: 'social-gr-offer', caption: 'פוסט מוכן, מתוזמן ל-20:00. · Green Room · תוכן ותזמון' },
  { id: 'social-gr-birthday', caption: 'פוסט מוכן, מתוזמן ל-20:00. · Green Room · תוכן ותזמון' },
  { id: 'social-gr-coach', caption: 'פוסט מוכן, מתוזמן ל-20:00. · Green Room · תוכן ותזמון' },
  { id: 'social-gr-room', fly: true, caption: 'פוסט מוכן, מתוזמן ל-20:00. · Green Room · תוכן ותזמון' },
  { id: 'social-hashmalka', caption: 'מודעה שמביאה פניות ישר לוואטסאפ. · חשמלכה · קמפיין' },
  { id: 'social-matan', caption: 'מודעה שמביאה פניות ישר לוואטסאפ. · חשמלכה · קמפיין' },
  { id: 'social-asian-bar', caption: 'פלאייר בשפה של הלקוחות של החנות. · Asian Bar · פלאייר' },
  { id: 'social-breslev-home', caption: 'שפה חזותית אחת, מהלוגו ועד הפוסט. · ברסלב · מיתוג' },
  { id: 'social-breslev-floor', caption: 'שפה חזותית אחת, מהלוגו ועד הפוסט. · ברסלב · מיתוג' },
].map((c) => ({ ...c, src: `/site/hero/assets/cards/${c.id}.webp`, page: pageOf(c.id) }));

export async function create(ctx) {
  // the name is written in code (hero v3 A); ?letters=cards brings back the screen-tile wordmark for comparison
  const codeLetters = new URLSearchParams(location.search).get('letters') !== 'cards';
  const wire = (eng) => {
    const zoom = createZoom({ stage: ctx.stage, eng, cards: CARDS, U: ctx.U, fine: ctx.fine, mobile: ctx.mobile });
    window.__cloud = { formShape: eng.formShape, focusCard: zoom.focusCard, peek: (id) => zoom.focusCard(id, { mode: 'peek' }), close: zoom.close, cards: CARDS.map((c) => c.id) };
    // the chapters below may hand their screens to the cards only once the cards exist (js/transit.js)
    window.__cloudScreens = true; document.dispatchEvent(new CustomEvent('cloud:screens'));
    return zoom;
  };
  if (!codeLetters) {
    const eng = await createCloud(ctx, { cards: CARDS, codeLetters });
    const zoom = wire(eng);
    return { ...eng, update(dt, U, ptr) { eng.update(dt, U, ptr); zoom.update(dt); }, dispose() { zoom.dispose(); eng.dispose(); } };
  }
  // the name first (Nadav, 2026-10-27: it has to come in fast): the code layer needs no images, so it goes up at
  // once; the cards load their 25 screenshots meanwhile and join the scene (cloud.js adds its own group) when ready
  const code = await createCode(ctx);
  let eng = null, zoom = null, gone = false;
  const ready = createCloud(ctx, { cards: CARDS, codeLetters }).then((e) => {
    if (gone) { e.dispose(); return null; }
    eng = e; zoom = wire(e); return e;
  });
  ready.catch((err) => console.info('[hero-cloud] screens unavailable, the name stays', err));
  return {
    objects: code.objects,
    get camera() { return eng?.camera; },
    get count() { return (code.count || 0) + (eng?.count || 0); },
    update(dt, U, ptr) { eng?.update(dt, U, ptr); zoom?.update(dt); },
    restore() { eng?.restore?.(); code.restore(); },
    dispose() { gone = true; zoom?.dispose(); code.dispose(); eng?.dispose(); },
  };
}
