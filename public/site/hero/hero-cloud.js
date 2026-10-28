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
  { id: 'medizen-3', cycle: 1, caption: __t('home.hero.cloud.medizenBot.line') + ' · ' + __t('home.hero.cloud.medizenBot.label') },
  { id: 'medizen-2', caption: __t('home.hero.cloud.medizenCalendar.line') + ' · ' + __t('home.hero.cloud.medizenCalendar.label') },
  { id: 'medizen-4', caption: __t('home.hero.cloud.medizenBot.line') + ' · ' + __t('home.hero.cloud.medizenBot.label') },
  { id: 'cash-collect', cycle: 3, caption: __t('home.hero.cloud.cash.line') + ' · ' + __t('home.hero.cloud.cash.label') },
  { id: 'cash-day', caption: __t('home.hero.cloud.z.line') + ' · ' + __t('home.hero.cloud.z.label') },
  { id: 'cash-auto', caption: __t('home.hero.cloud.cash.line') + ' · ' + __t('home.hero.cloud.cash.label') },
  { id: 'cash-history', caption: __t('home.hero.cloud.cash.line') + ' · ' + __t('home.hero.cloud.cash.label') },
  { id: 'cash-collect-light', caption: __t('home.hero.cloud.cash.line') + ' · ' + __t('home.hero.cloud.cash.label') },
  { id: 'cash-deliveries-light', caption: __t('home.hero.cloud.cash.line') + ' · ' + __t('home.hero.cloud.cash.label') },
  { id: 'sporchat-room', cycle: 4, caption: __t('home.hero.cloud.sporchatRoom.line') + ' · ' + __t('home.hero.cloud.sporchatRoom.label') },
  { id: 'greenroom-book', caption: __t('home.hero.cloud.greenroomBooking.line') + ' · ' + __t('home.hero.cloud.greenroomBooking.label') },
  { id: 'greenroom-food', caption: __t('home.hero.cloud.greenroomBooking.line') + ' · ' + __t('home.hero.cloud.greenroomBooking.label') },
  { id: 'greenroom-help', caption: __t('home.hero.cloud.greenroomBooking.line') + ' · ' + __t('home.hero.cloud.greenroomBooking.label') },
  { id: 'greenroom-home', caption: __t('home.hero.cloud.greenroomBooking.line') + ' · ' + __t('home.hero.cloud.greenroomBooking.label') },
  { id: 'greenroom-intro', caption: __t('home.hero.cloud.greenroomBooking.line') + ' · ' + __t('home.hero.cloud.greenroomBooking.label') },
  // social: the Green Room social system + client work
  { id: 'social-gr-food', cycle: 2, caption: __t('home.hero.cloud.socialGreenroom.line') + ' · ' + __t('home.hero.cloud.socialGreenroom.label') },
  { id: 'social-gr-offer', caption: __t('home.hero.cloud.socialGreenroom.line') + ' · ' + __t('home.hero.cloud.socialGreenroom.label') },
  { id: 'social-gr-birthday', caption: __t('home.hero.cloud.socialGreenroom.line') + ' · ' + __t('home.hero.cloud.socialGreenroom.label') },
  { id: 'social-gr-coach', caption: __t('home.hero.cloud.socialGreenroom.line') + ' · ' + __t('home.hero.cloud.socialGreenroom.label') },
  { id: 'social-gr-room', fly: true, caption: __t('home.hero.cloud.socialGreenroom.line') + ' · ' + __t('home.hero.cloud.socialGreenroom.label') },
  { id: 'social-hashmalka', caption: __t('home.hero.cloud.hashmalka.line') + ' · ' + __t('home.hero.cloud.hashmalka.label') },
  { id: 'social-matan', caption: __t('home.hero.cloud.hashmalka.line') + ' · ' + __t('home.hero.cloud.hashmalka.label') },
  { id: 'social-asian-bar', caption: __t('home.hero.cloud.asianBar.line') + ' · ' + __t('home.hero.cloud.asianBar.label') },
  { id: 'social-breslev-home', caption: __t('home.hero.cloud.breslev.line') + ' · ' + __t('home.hero.cloud.breslev.label') },
  { id: 'social-breslev-floor', caption: __t('home.hero.cloud.breslev.line') + ' · ' + __t('home.hero.cloud.breslev.label') },
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
