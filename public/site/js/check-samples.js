// check-samples.js: the business check's canned reports, one per field, until the AI backend is approved.
// Shared data only (no DOM): /check (sales-pages.js) imports it, and the home's check.js can import the
// same SAMPLES and detectField so both answer the business that was typed.
// The food sample is COPY-FULL's check.sample.* verbatim. The beauty, clinic and general samples are
// NON-DECK, written to the deck's voice rules (no price, no usage numbers) and await Nadav's approval.
// Field names are the deck's closed list (check.fields.*): only the field ever goes into the WhatsApp message.

export const FIELDS = {
  beauty: __t('check.fields.beauty'),
  food: __t('check.fields.food'),
  clinic: __t('check.fields.clinic'),
  services: __t('check.fields.services'),
};

// the first match wins; a text with no match gets the general sample
const RULES = [
  ['clinic', /קליניק|מרפא|רופא|מטפל|פיזיו|שיניים|פסיכולוג|דיאטנ|וטרינר|רפוא|אופטיק|קלינאי/],
  ['beauty', /מספר[הת]|ספרית|ספרים|ברבר|תספור|ציפורנ|קוסמטיק|טיפוח|יופי|גבות|שיער|איפור|מאפר|ציפורן|לק ג'ל|ספא/],
  ['food', /מסעד|אוכל|משלוח|פיצ|המבורג|בית קפה|קפה|מאפי|שווארמ|סושי|קייטרינג|פלאפל|בורגר|גלידה|ביסטרו|(?<![א-ת])בר(?![א-ת])/],
];
export function detectField(text = '') {
  for (const [k, rx] of RULES) if (rx.test(text)) return k;
  return 'services';
}

export const SAMPLES = {
  food: {
    input: __t('check.sample.input'),
    saw: __t('check.sample.saw'),
    automate: [
      { t: __t('check.sample.automate1.title'), why: __t('check.sample.automate1.body'), times: 60, min: 2 },
      { t: __t('check.sample.automate2.title'), why: __t('check.sample.automate2.body'), times: 7, min: 20 },
      { t: __t('check.sample.automate3.title'), why: __t('check.sample.automate3.body'), times: 7, min: 25 },
    ],
    similar: __t('check.sample.similar'), similarHref: __href('my-branch'),
    first: __t('check.sample.first'),
  },
  beauty: {
    input: __t('check.sample.beauty.input'),
    saw: __t('check.sample.beauty.saw'),
    automate: [
      { t: __t('check.sample.beauty.automate1.title'), why: __t('check.sample.beauty.automate1.body'), times: 40, min: 3 },
      { t: __t('check.sample.beauty.automate2.title'), why: __t('check.sample.beauty.automate2.body'), times: 40, min: 1 },
      { t: __t('check.sample.beauty.automate3.title'), why: __t('check.sample.beauty.automate3.body'), times: 5, min: 10 },
    ],
    similar: __t('check.sample.beauty.similar'), similarHref: __href('work-medizen'),
    first: __t('check.sample.beauty.first'),
  },
  clinic: {
    input: __t('check.sample.clinic.input'),
    saw: __t('check.sample.clinic.saw'),
    automate: [
      { t: __t('check.sample.clinic.automate1.title'), why: __t('check.sample.clinic.automate1.body'), times: 80, min: 3 },
      { t: __t('check.sample.clinic.automate2.title'), why: __t('check.sample.clinic.automate2.body'), times: 50, min: 3 },
      { t: __t('check.sample.clinic.automate3.title'), why: __t('check.sample.clinic.automate3.body'), times: 50, min: 1 },
    ],
    similar: __t('check.sample.clinic.similar'), similarHref: __href('work-medizen'),
    first: __t('check.sample.clinic.first'),
  },
  services: {
    input: __t('check.sample.services.input'),
    saw: __t('check.sample.services.saw'),
    automate: [
      { t: __t('check.sample.services.automate1.title'), why: __t('check.sample.services.automate1.body'), times: 30, min: 5 },
      { t: __t('check.sample.services.automate2.title'), why: __t('check.sample.services.automate2.body'), times: 30, min: 2 },
      { t: __t('check.sample.automate2.title'), why: __t('check.sample.services.automate3.body'), times: 6, min: 20 },
    ],
    similar: __t('services.systems.proof'), similarHref: __href('my-branch'),
    first: __t('check.sample.services.first'),
  },
};
