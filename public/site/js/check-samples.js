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
      { t: 'רישום משלוחים וכסף בשטח.', why: 'כל משלוח נרשם כשהוא יוצא, ורואים בכל רגע כמה כסף אצל כל שליח.', times: 60, min: 2 },
      { t: 'סיכום יומי בוואטסאפ.', why: 'בסוף כל יום מגיעה הודעה עם המשלוחים, הכסף והפערים.', times: 7, min: 20 },
      { t: 'סגירת קופה בטלפון.', why: 'ספירה לפי שטרות ומטבעות, ודוח מוכן.', times: 7, min: 25 },
    ],
    similar: __t('check.sample.similar'), similarHref: __href('my-branch'),
    first: __t('check.sample.first'),
  },
  beauty: {
    input: __t('check.sample.beauty.input'),
    saw: __t('check.sample.beauty.saw'),
    automate: [
      { t: 'קביעת תורים מתוך הוואטסאפ.', why: 'הלקוח בוחר שעה פנויה בעצמו, והתור נכנס ליומן של הכסא הנכון.', times: 40, min: 3 },
      { t: 'תזכורת יום לפני.', why: 'הודעה עם אישור הגעה, ותור שמתבטל חוזר מיד ליומן.', times: 40, min: 1 },
      { t: 'רשימת המתנה לשעות העומס.', why: 'כשמתפנה תור ביום חמישי, ההודעה יוצאת לבא בתור ברשימה.', times: 5, min: 10 },
    ],
    similar: __t('check.sample.beauty.similar'), similarHref: __href('work-medizen'),
    first: __t('check.sample.beauty.first'),
  },
  clinic: {
    input: __t('check.sample.clinic.input'),
    saw: __t('check.sample.clinic.saw'),
    automate: [
      { t: 'סוכן שעונה בוואטסאפ.', why: 'עונה על שעות, כתובת והכנה לטיפול, רק מתוך המידע של הקליניקה, ושאלה רפואית עוברת למטפל.', times: 80, min: 3 },
      { t: 'קביעת תורים ביומן המשותף.', why: 'המטופל בוחר שעה, והתור נכנס ליומן של המטפל הנכון.', times: 50, min: 3 },
      { t: 'תזכורות ואישור הגעה.', why: 'הודעה יום לפני, ותור שמתבטל מתפנה למטופל הבא.', times: 50, min: 1 },
    ],
    similar: __t('check.sample.clinic.similar'), similarHref: __href('work-medizen'),
    first: __t('check.sample.clinic.first'),
  },
  services: {
    input: __t('check.sample.services.input'),
    saw: __t('check.sample.services.saw'),
    automate: [
      { t: 'לוח עבודות אחד לכל הצוות.', why: 'כל עבודה נרשמת פעם אחת, וכל עובד רואה בטלפון לאן הוא נוסע היום.', times: 30, min: 5 },
      { t: 'אישור ותזכורת ללקוח בוואטסאפ.', why: 'הלקוח מקבל אישור כשהעבודה נקבעת, ותזכורת יום לפני.', times: 30, min: 2 },
      { t: 'סיכום יומי בוואטסאפ.', why: 'בסוף כל יום מגיעה הודעה עם מה שבוצע ומה מחכה למחר.', times: 6, min: 20 },
    ],
    similar: __t('services.systems.proof'), similarHref: __href('my-branch'),
    first: __t('check.sample.services.first'),
  },
};
