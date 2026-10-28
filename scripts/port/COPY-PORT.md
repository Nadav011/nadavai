# NadavAI: strings the port needs that are in neither COPY-FULL.md nor COPY-GAP.md (draft)

Draft for Nadav's approval, in the deck's table format, so the design session can fold the rows into `COPY-FULL.md`.
`scripts/port/sync.py` reads this file after COPY-FULL and COPY-GAP; an id that reaches the deck wins over the row here.

## Global

| id | עברית | English | הערה |
|---|---|---|---|
| `global.theme.label` | מראה האתר | Site look | aria-label של מתג הלילה והיום. מחליף את "מראה האתר (לבדיקה)" של אב-הטיפוס |
| `global.theme.night` | לילה | Night | כפתור במתג, המראה הכהה (A) |
| `global.theme.day` | יום | Day | כפתור במתג, המראה הבהיר (B) |

## index

| id | עברית | English | הערה |
|---|---|---|---|
| `home.hero.ticker.medizen` | ניהול קליניקות | Clinic management | שורת הטיקר בהירו, ליד MediZen. הנוסח המקוצר של home.live.medizen.line |
| `home.hero.ticker.sporchat` | צ'אט חי לכל משחק | A live chat for every match | שורת הטיקר בהירו, ליד SporChat. הנוסח המקוצר של home.live.sporchat.line |
| `home.hero.ticker.greenroom` | מועדון סנוקר בלי דלפק | A snooker club with no front desk | שורת הטיקר בהירו, ליד Green Room. הנוסח המקוצר של home.live.greenroom.line |
| `home.hero.ticker.cash` | משלוחים וכסף בשטח | Deliveries and cash in the field | שורת הטיקר בהירו, ליד "מזומן" (home.branch.t1230.system) |
| `home.hero.ticker.z` | סגירת קופה | Register close | שורת הטיקר בהירו, ליד Z. זהה לחלק השני של home.hero.cloud.z.label ("Z · סגירת קופה") |
| `home.hero.ticker.network` | סניפים, ביקורות ומשימות | Branches, audits and tasks | שורת הטיקר בהירו, ליד "רשת המקסיקני". הנוסח המקוצר של home.hero.cloud.network.line |
| `home.hero.ticker.neon` | משחק תלת-ממד בדפדפן | A 3D browser game | שורת הטיקר בהירו, ליד Neon Alley |
| `home.hero.ticker.pet` | עובד בשבילי על המחשב | Works for me on the computer | שורת הטיקר בהירו, ליד "נדב 2.0". הנוסח המקוצר של home.hero.cloud.pet.line. הנוסח הקודם היה "מראה מה הסוכנים שלי עושים" |
| `home.hud.value` | מה זה נותן | What it does | שם הסעיף בתצוגת ההתקדמות של העמוד (data-name של סעיף 02). הנוסח המקוצר של home.value.eyebrow |
| `home.value.whatsapp.mockHeader.title` | הודעות | Messages | תוכן מדומה בתוך מסך. כותרת מסך הוואטסאפ בצד "לפני". חצי ראשון של home.value.whatsapp.mockHeader |
| `home.value.whatsapp.mockHeader.sub` | שיחות שלא נקראו | Unread | תוכן מדומה בתוך מסך. חצי שני של home.value.whatsapp.mockHeader |
| `home.value.leads.mock.missed` | לקוח חדש · 23:41 | New customer · 11:41 pm | תוכן מדומה בתוך מסך. שורת ההתראה על שיחה שלא נענתה, חלק מ-home.value.leads.mock. השעה בפורמט 12 שעות כמו בשאר הדק |
| `home.services.card.kind` | שירות | Service | תווית מעל מספר השירות בכרטיס השירות ("שירות 01"). גם ב-/services |
| `home.services.agents.inc2` | קביעת תורים | Booking appointments | פריט 2 ב"מה כלול", סוכני AI (inc1 ו-inc3 כבר קיימים). גם ב-/services |
| `home.services.web.inc1` | עיצוב UI/UX | UI/UX design | פריט 1 ב"מה כלול", אתרים ועיצוב: כל טקסט הפריט, עם UI/UX בתוך <bdi>. גם ב-/services |
| `home.services.web.inc3` | פניות ישר לוואטסאפ | Inquiries straight to WhatsApp | פריט 3 ב"מה כלול", אתרים ועיצוב. גם ב-/services |
| `home.services.content.inc2` | תזמון | Scheduling | פריט 2 ב"מה כלול", מערכת תוכן ותזמון. גם ב-/services, ובדף סושיאל (כותרת קטנה ברשימת "מה אני עושה") |
| `home.services.security.inc1` | הקשחה | Hardening | פריט 1 ב"מה כלול", אבטחת מידע לעסקים. גם ב-/services |
| `home.services.security.inc2` | ניטור | Monitoring | פריט 2 ב"מה כלול", אבטחת מידע לעסקים. גם ברשימת "תחזוקה וצמיחה" (home.plans.care.includes), בדף /plans וב-/services |
| `home.services.security.inc3` | בדיקות | Testing | פריט 3 ב"מה כלול", אבטחת מידע לעסקים. גם ב-/services |
| `home.process.build.sub` | עם שקיפות מלאה | With full transparency | שורה קטנה מתחת ל"בנייה בשלבים" בצומת שלב 3 במסלול. גם ב-/services |
| `home.process.progress.initial` | שלב 1 מתוך 5 | Step 1 of 5 | כל טקסט ה-HUD של המסלול, עם המספר בתוך <b class="path__cur"> שה-JS (js/path.js) מחליף בכל שלב. home.process.progress קיים כתבנית ("שלב {n} מתוך 5"). שימו לב: באנגלית ההודעה היא טקסט בלי תגיות, ו-path.js ניגש ל-.path__cur בלי בדיקה |
| `home.live.hint.proto` | רחפו או הקישו על טלפון. | Hover or tap a phone. | אותו אלמנט כמו home.live.hint, עם נקודה בסוף. מוצג במכשיר עם עכבר |
| `home.live.hint.touch.proto` | הקישו על טלפון. | Tap a phone. | אותו אלמנט כמו home.live.hint.touch, עם נקודה בסוף. מוצג במכשיר מגע |
| `home.live.sporchat.desc` | צ'אט חי לכל משחק כדורגל. CTO. ב-App Store וב-Google Play. | A live chat for every football match. CTO. On the App Store and Google Play. | תיאור נסתר (sr-only) של הטלפון, מורכב מ-line, role ו-status של home.live.sporchat. הטענה על Google Play פתוחה (COPY-GAP פריט 13) |
| `home.live.medizen.desc` | ניהול קליניקות, עם בוט לוואטסאפ שקובע תורים. Co-Founder & CTO. עובד בקליניקות. | Clinic management, with a WhatsApp bot that books appointments. Co-Founder & CTO. Running in clinics. | תיאור נסתר (sr-only) של הטלפון, מורכב מ-line, role ו-status של home.live.medizen. הנוסח עודכן ל"בוט לוואטסאפ", כמו במונחון (COPY-GAP פריט 5) |
| `home.live.greenroom.desc` | מועדון סנוקר שעובד בלי אף אחד בדלפק. בניתי את כל המערכת. ב-App Store וב-Google Play. | A snooker club that runs with nobody at the desk. I built the whole system. On the App Store and Google Play. | תיאור נסתר (sr-only) של הטלפון, מורכב מ-line, role ו-status של home.live.greenroom. הטענה על Google Play פתוחה (COPY-GAP פריט 13) |
| `home.branch.dial.valuetext.start` | 08:00, משמרות | 08:00, Shifts | aria-valuetext ההתחלתי של חוגת היום בסניף. ה-JS מחליף אותו ב-home.branch.dial.valuetext ({time}, {system}) בכל תזוזה, ובשעון של 24 שעות |
| `home.plans.partner.inc1` | שעות פיתוח קבועות כל חודש | Fixed development hours every month | פריט 1 בכרטיס שותף טכנולוגי, מתוך home.plans.partner.includes. גם ב-/plans |
| `home.plans.partner.inc2` | מערכות וסוכני AI לפי הצורך | Systems and AI agents as needed | פריט 2 בכרטיס שותף טכנולוגי: כל טקסט הפריט, עם AI בתוך <bdi>. גם ב-/plans |
| `home.plans.partner.inc3` | עדיפות בזמינות | Priority availability | פריט 3 בכרטיס שותף טכנולוגי. גם ב-/plans |
| `home.plans.partner.inc4` | פגישת אסטרטגיה חודשית | A monthly strategy meeting | פריט 4 בכרטיס שותף טכנולוגי. גם ב-/plans |
| `home.plans.aiTeam.inc1` | סוכן AI או אוטומציות | An AI agent or automations | פריט 1 בכרטיס צוות AI: כל טקסט הפריט, עם AI בתוך <bdi>. גם ב-/plans |
| `home.plans.aiTeam.inc2` | מערכת תוכן | A content system | פריט 2 בכרטיס צוות AI. גם ב-/plans |
| `home.plans.aiTeam.inc3` | שיפורים חודשיים | Monthly improvements | פריט 3 בכרטיס צוות AI. גם ב-/plans |
| `home.plans.aiTeam.inc4` | שירות ופיתוח | Service and development | פריט 4 בכרטיס צוות AI. גם ב-/plans |
| `home.plans.care.inc1` | תחזוקה | Maintenance | פריט 1 בכרטיס תחזוקה וצמיחה, מתוך home.plans.care.includes. גם ב-/plans |
| `home.plans.care.inc3` | שעות פיתוח קטנות | Small development hours | פריט 3 בכרטיס תחזוקה וצמיחה. גם ב-/plans. פריט 4 ("ניטור") הוא home.services.security.inc2 |
| `home.play.neon.chip` | Neon Alley · בקרוב לשחק | Neon Alley · Coming soon to play | כל טקסט הצ'יפ של סעיף Neon Alley, עם שם המשחק בתוך <bdi>. home.play.neon.badge הוא "בקרוב לשחק" בלי השם |
| `home.hud.faq` | שאלות | Questions | שם הסעיף בתצוגת ההתקדמות של העמוד (data-name של סעיף 11). home.faq.eyebrow הוא "שאלות ווואטסאפ" |
| `home.faq.header.initial` | נ | N | אות בודדת. אווטאר הצ'אט של נדב בסעיף השאלות. אותה אות היא גם תו אפקט ב-hero/zoom.js, שם יופיע N |

## services

The first nine strings of the service cards and the build step are the same Hebrew on `/` and `/services`, so their rows are under `index` (the `home.services.*` and `home.process.*` ids).

| id | עברית | English | הערה |
|---|---|---|---|
| `services.tree.hint` | לחצו על צומת כדי לפתוח אותו. | Tap a node to open it. | רמז מעל עץ השירותים. המשפט האחרון של home.services.sub, שב-/services עומד לבד |
| `services.vow.also1` | דמו לפני בנייה | A demo before the build | פריט ברשימת ההתחייבות בסוף המסלול, מתוך home.process.guarantee |
| `services.vow.also2` | שקיפות מלאה לאורך הדרך | Full transparency throughout | פריט ברשימת ההתחייבות בסוף המסלול, מתוך home.process.guarantee |

## work

| id | עברית | English | הערה |
|---|---|---|---|
| `work.filter.systems.proto` | מערכות | Systems | כפתור סינון. אותו אלמנט כמו work.filter.systems ("מערכות לעסק") |
| `work.filter.creative.proto` | קריאייטיב | Creative | כפתור סינון. בדק זה work.filter.design ("אתרים ועיצוב"); ההכרעה בין שני הנוסחים של נדב |
| `work.filter.tools.proto` | כלים | Tools | כפתור סינון. בדק זה work.filter.play ("כלים ומשחקים"); ההכרעה בין שני הנוסחים של נדב |
| `work.tag.invoices` | חשבוניות | Invoicing | תג בכרטיס MediZen |
| `work.tag.payments` | סליקה | Payments | תג בכרטיס Green Room |
| `work.card.myBranch.name.proto` | המערכות של הסניף שלי | My branch's systems | שם הכרטיס. אותו אלמנט כמו work.card.myBranch.name ("הסניף שלי") |
| `work.tag.app` | אפליקציה | App | תג בכרטיס רשת המקסיקני, ותווית סוג ברשימת "ועוד, בקצרה" |
| `work.tag.game` | משחק | Game | תג בכרטיס Neon Alley |
| `work.more.hashmalka.kicker` | קמפיין · לקוח | Campaign · Client | data-k של כרטיס חשמלכה: הכותרת הקטנה בחלון ההגדלה. שם הלקוח מחכה להסכמה (COPY-GAP פריט 14) |
| `work.more.hashmalka.long` | קמפיין פייסבוק לחשמלאי שמתקין עמדות טעינה לרכב חשמלי. מחקר, בריף, זהות לדף, מודעות בשני פורמטים, ותבנית שיחה שמסננת פניות. כל פנייה נוחתת ישר בוואטסאפ שלו. | A Facebook campaign for an electrician who installs EV chargers: research, brief, a page identity, ads in two formats, and a chat template that screens inquiries. Every inquiry lands straight in his WhatsApp. | data-long של כרטיס חשמלכה: הטקסט בחלון ההגדלה. שם הלקוח מחכה להסכמה (COPY-GAP פריט 14) |
| `work.tag.ads` | מודעות | Ads | תג בכרטיס חשמלכה |
| `work.more.flyers.kicker` | קריאייטיב · עסקים | Creative · Businesses | data-k של כרטיס פלאיירים ומיתוג: הכותרת הקטנה בחלון ההגדלה |
| `work.more.flyers.long` | פלאיירים, לוגואים, ערכות פוסטרים ותוכן לרשתות לעסקים מקומיים: Asian Bar, ברסלב פרויקטים, חשמלכה ועוד. חלק מהם נוצרו במערכת התוכן שבניתי, כדי שהעסק יקבל עיצוב חדש בכל שבוע בלי מעצב. | Flyers, logos, poster kits and social content for local businesses: Asian Bar, Breslev Projects, Hashmalka and more. Some of it came out of the content system I built, so a business gets fresh designs every week without a designer. | data-long של כרטיס פלאיירים ומיתוג. שמות לקוחות מחכים להסכמה (COPY-GAP פריט 14) |
| `work.tag.branding` | מיתוג | Branding | תג בכרטיס פלאיירים ומיתוג. גם כותרת קטנה ברשימת "מה אני עושה" בדף סושיאל (social.what.brand הוא המחרוזת השלמה) |
| `work.more.autocad.kicker` | כלי · אדריכלות | Tool · Architecture | data-k של כרטיס מחולל תוכניות AutoCAD: הכותרת הקטנה בחלון ההגדלה |
| `work.more.autocad.long` | כלי שממלא תוכנית DXF לפי מפרט: חדרים, מידות ותוויות, ישר לתוך AutoCAD. | A tool that fills in a DXF plan from a spec: rooms, dimensions and labels, straight into AutoCAD. | data-long של כרטיס מחולל תוכניות AutoCAD |
| `work.more.pet.kicker` | כלי · קוד פתוח | Tool · Open source | data-k של כרטיס חיית המחמד: הכותרת הקטנה בחלון ההגדלה |
| `work.more.pet.note` | מבוסס על פרויקט קוד פתוח (MIT), עם הדמות שלי ושינויים משלי. | Based on an open-source project (MIT), with my own character and my own changes. | data-note של כרטיס חיית המחמד. הקרדיט ל-claude_pet של bookoff נמצא ב-play.pet.credit |
| `work.more.pet.long` | עובד בשבילי על המחשב ועוקב אחרי כל סשן של הסוכנים: מה רץ, מה מחכה לאישור, מה נתקע ומה הסתיים. כשמשהו צריך אותי, הוא מתריע. יש לו צ'אט מהיר והכתבה בעברית. אחד הדברים שהכי כיף לי לבנות. | Works for me on the computer and follows every agent session: what's running, what's waiting for approval, what's stuck and what's done. When something needs me, it alerts me. It has a quick chat and dictation in Hebrew. One of my favourite things to build. | data-long של כרטיס נדב 2.0: הטקסט בחלון ההגדלה. בלשון זכר בעברית (החלטה 10). הנוסח הקודם דיבר על "חיית מחמד לשולחן העבודה" |
| `work.list.hatum.name` | חתום בנשיקה דיגיטל | Hatum BeNeshika Digital | שם הלקוח ברשימת "ועוד, בקצרה", בתעתיק כמו ב-work.more.hatum |
| `work.zoom.close` | סגירה | Close | aria-label של כפתור הסגירה בחלון ההגדלה. אותה מילה בדף הסניף שלי היא תווית שעה: branch.story.2300.part |

## work-sporchat

| id | עברית | English | הערה |
|---|---|---|---|
| `sporchat.hero.eyebrow` | אפליקציה לאוהדי ספורט | An app for sports fans | כותרת-על בהירו, לצד "01 / 03" |
| `work.hero.scroll` | גללו | Scroll | רמז הגלילה בפינת ההירו, בשלושת דפי הפרויקט (SporChat, MediZen, Green Room). home.hero.scroll הוא "גללו לפתיחה" |
| `sporchat.screens.room.cap.proto` | חדר משחק חי, עם צ'אט ומדדי לחץ | A live match room, with chat and pressure meters | כיתוב המסך בצופה (data-cap). אותו אלמנט כמו sporchat.screens.room (תווית · כיתוב) בנוסח אחר |
| `sporchat.screens.room.label` | חדר משחק | Match room | תווית קצרה מתחת לצילום המסך |
| `sporchat.screens.match.cap.proto` | דף המשחק: לפני שריקת הפתיחה, עם ניחוש | The match page before kickoff, with a prediction | כיתוב המסך בצופה (data-cap). אותו אלמנט כמו sporchat.screens.match בנוסח אחר |
| `sporchat.screens.arena.cap.proto` | ארנה: ניחושים פתוחים, רצף ונקודות | The Arena, with open predictions, streaks and points | כיתוב המסך בצופה (data-cap). אותו אלמנט כמו sporchat.screens.arena (תווית · כיתוב) בנוסח אחר. "ארנה" כמו בחפיסה (החלטה 18) |
| `sporchat.screens.chats.cap` | צ'אטים: המשחק הגדול, חי עכשיו | The chat list, with the big match live right now | כיתוב המסך בצופה (data-cap) |
| `sporchat.screens.feed.cap.proto` | פיד: תוצאות חיות ופרשן ה-AI | The feed, with live scores and the AI commentator | כיתוב המסך בצופה (data-cap). אותו אלמנט כמו sporchat.screens.feed בנוסח אחר |
| `sporchat.screens.feed.label` | פיד | Feed | תווית קצרה מתחת לצילום המסך |
| `sporchat.screens.leagues.cap.proto` | ליגות: הטבלה והמשחק שרץ עכשיו | Leagues, with the table and the match running now | כיתוב המסך בצופה (data-cap). אותו אלמנט כמו sporchat.screens.leagues בנוסח אחר |
| `sporchat.screens.leagues.label` | ליגות | Leagues | תווית קצרה מתחת לצילום המסך |
| `sporchat.try.team.blue.initial` | כ | B | אות בודדת. תג הקבוצה הכחולה (הכחולים, The Blues) בטלפון המדומה. תוכן מדומה בתוך מסך |
| `sporchat.try.team.red.initial` | א | R | אות בודדת. תג הקבוצה האדומה (האדומים, The Reds) בטלפון המדומה. תוכן מדומה בתוך מסך. אותה אות היא גם תו אפקט ב-js/play.js, js/story/playground.js ו-hero/zoom.js, ושם יופיע R |
| `sporchat.try.hud.goals` | שערים 0 | Goals 0 | כל טקסט הכדור בטלפון הבועט, עם המונה בתוך <b id="kickGoals"> שה-JS (sporchat-kick.js) מעדכן. sporchat.try.score הוא "שערים: {n}". שימו לב: באנגלית ההודעה היא טקסט בלי תגיות, והמונה לא יימצא |
| `work.tech.label` | התפקיד | Role | תווית מעל כרטיס התפקיד בדפי SporChat ו-MediZen. case.role הוא "התפקיד שלי" (כותרת אחרת) |
| `work.nav.all` | כל העבודות | All work | קישור בסוף כל דף פרויקט (SporChat, MediZen, Green Room). case.back הוא "לכל העבודות" |
| `sporchat.pk.keys.proto` | מקלדת (Tab לכדור): ←→ כיוון · ↑↓ כוח · C סיבוב · P פננקה · רווח בעיטה | Keyboard (Tab to the ball): ←→ aim · ↑↓ power · C curl · P panenka · Space shoot | כל טקסט הרמז מתחת למשחק: "מקלדת" ב-<b> והמקשים ב-<kbd>. אותו אלמנט כמו sporchat.pk.keys, אבל כאן החצים צמודים (בלי רווח בין שני ה-<kbd>), ולכן השורה בדק לא מתאימה. באנגלית נשארים אותם סימנים (←→ ↑↓ C P), כדי שהממיר ישים את ה-<kbd> במקומם |
| `global.key.space` | רווח | Space | שם מקש בתוך <kbd> ברמזי המקלדת של SporChat ו-Green Room. שורה נפרדת כדי שהממיר ישים את ה-<kbd> גם באנגלית (הוא מחפש את שם המקש בדק) |
| `sporchat.dims.led.room` | חדר לכל משחק | A room for every match | תוכן מדומה בתוך מסך. כיתוב בשלט הלד בחדר התלת-ממדי, לצד SporChat ו-LIVE |
| `sporchat.dims.led.commentator` | פרשן AI | AI commentator | תוכן מדומה בתוך מסך. כיתוב בשלט הלד בחדר התלת-ממדי |

## work-medizen

| id | עברית | English | הערה |
|---|---|---|---|
| `medizen.hero.chip.servers` | שרתים בישראל | Servers in Israel | צ'יפ בהירו |
| `medizen.screens.day.cap` | היום שלך בהודעה אחת: תורים, הכנסות ותזכורות | Your day in one message, with appointments, income and reminders | כיתוב המסך בצופה (data-cap) |
| `medizen.screens.day.label` | סיכום יומי | Daily summary | תווית קצרה מתחת לצילום המסך |
| `medizen.screens.calendar.cap` | היומן: תורים, חדרים ואישור בלחיצה | The calendar, with appointments, rooms and one-tap confirmation | כיתוב המסך בצופה (data-cap) |
| `medizen.screens.calendar.label` | יומן | Calendar | תווית קצרה מתחת לצילום המסך. גם בתפריט המודולים של מסך ההנהלה בדף רשת המקסיקני (תוכן מדומה בתוך מסך) |
| `medizen.screens.homeMobile.cap` | דף הבית: כל הקליניקה במערכת אחת | The home page, with the whole clinic in one system | כיתוב המסך בצופה (data-cap) |
| `medizen.screens.homeMobile.label` | דף הבית | Home page | תווית קצרה מתחת לצילום המסך |
| `medizen.screens.bot.cap` | הבוט עונה למטופלים מתוך המידע של הקליניקה | The bot answers patients from the clinic's own information | כיתוב המסך בצופה (data-cap) |
| `medizen.screens.bot.label` | בוט לוואטסאפ | WhatsApp bot | תווית קצרה מתחת לצילום המסך. בעברית "בוט לוואטסאפ", כמו במונחון |
| `medizen.screens.homeDesktop.cap` | הדמו במחשב | The demo on a computer | כיתוב המסך בצופה (data-cap) |
| `medizen.screens.homeDesktop.label` | במחשב | On a computer | תווית קצרה מתחת לצילום המסך |
| `medizen.next.label` | הפרויקט הבא · 03 / 03 | Next project · 03 / 03 | תווית הניווט לפרויקט הבא. המספר הוא מקום הפרויקט בסדרת שלושת דפי הפרויקט |
| `medizen.dims.invoice.title` | חשבונית מס 1043 | Tax invoice 1043 | תוכן מדומה בתוך מסך. חשבונית על השולחן בחדר התלת-ממדי (נייר, ממולא חלקית) |
| `medizen.dims.invoice.patient` | קליניקה · מטופל: ______ | Clinic · Patient: ______ | תוכן מדומה בתוך מסך. שורת הפרטים בחשבונית. הקווים התחתונים הם שדה ריק |
| `medizen.dims.invoice.total` | סה"כ ₪ ____ | Total ₪ ____ | תוכן מדומה בתוך מסך. שורת הסכום בחשבונית. הקווים התחתונים הם שדה ריק |
| `medizen.dims.invoice.paid` | שולם? | Paid? | תוכן מדומה בתוך מסך. חותמת בחשבונית |
| `medizen.dims.form.title` | טופס קליטה | Intake form | תוכן מדומה בתוך מסך. כותרת טופס הקליטה בחדר התלת-ממדי |
| `medizen.dims.form.name` | שם מלא | Full name | תוכן מדומה בתוך מסך. שדה בטופס הקליטה |
| `medizen.dims.form.id` | תעודת זהות | ID number | תוכן מדומה בתוך מסך. שדה בטופס הקליטה |
| `medizen.dims.form.phone` | טלפון | Phone | תוכן מדומה בתוך מסך. שדה בטופס הקליטה |
| `medizen.dims.form.allergies` | רגישויות | Allergies | תוכן מדומה בתוך מסך. שדה בטופס הקליטה |
| `medizen.dims.form.meds` | תרופות | Medications | תוכן מדומה בתוך מסך. שדה בטופס הקליטה |
| `medizen.dims.form.signature` | חתימה | Signature | תוכן מדומה בתוך מסך. שדה בטופס הקליטה |
| `medizen.dims.calendar.title` | יומן · שבוע 43 | Calendar · Week 43 | תוכן מדומה בתוך מסך. כותרת יומן הקיר בחדר התלת-ממדי |
| `medizen.desk.name.itay` | איתי | Itay | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.shira` | שירה | Shira | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.daniel` | דניאל | Daniel | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.michal` | מיכל | Michal | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.tamar` | תמר | Tamar | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.yonatan` | יונתן | Yonatan | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.roni` | רוני | Roni | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.lior` | ליאור | Lior | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.hadar` | הדר | Hadar | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |
| `medizen.desk.name.ori` | אורי | Ori | תוכן מדומה בתוך מסך. שם מומצא של מטופל במשחק המזכירה, מתוך medizen.desk.names. באנגלית אותו שם בתעתיק, כמו ב-medizen.desk.names |

## work-green-room

| id | עברית | English | הערה |
|---|---|---|---|
| `greenroom.hero.chip.payments` | עם תשלומים אמיתיים | With real payments | צ'יפ בהירו, עם נקודת "חי" |
| `greenroom.screens.home.cap` | דף הבית: חדר פרטי, הזמנה בלחיצה | The home page, with a private room and one-tap booking | כיתוב המסך בצופה (data-cap). greenroom.screens.home.label ("בית") כבר קיים |
| `greenroom.screens.booking.cap` | בוחרים יום, שעה וכמה שחקנים | You pick a day, a time and how many players | כיתוב המסך בצופה (data-cap) |
| `greenroom.screens.booking.label` | הזמנה | Booking | תווית קצרה מתחת לצילום המסך |
| `greenroom.screens.food.cap` | אוכל ושתייה עד השולחן | Food and drinks, brought to your table | כיתוב המסך בצופה (data-cap) |
| `greenroom.screens.food.label` | אוכל | Food | תווית קצרה מתחת לצילום המסך |
| `greenroom.screens.help.cap` | עזרה: קוד כניסה, הזמנות, תשלום | Help, with the door code, bookings and payment | כיתוב המסך בצופה (data-cap) |
| `greenroom.screens.content.cap` | פוסט שמערכת התוכן הכינה ותזמנה | A post the content system prepared and scheduled | כיתוב המסך בצופה (data-cap) |
| `greenroom.screens.post.cap` | עוד פוסט מאותה מערכת | Another post from the same system | כיתוב המסך בצופה (data-cap) |
| `greenroom.screens.post.label` | פוסט | Post | תווית קצרה מתחת לצילום המסך |
| `greenroom.clear.keys.proto` | מקלדת (Tab לכדור הלבן): ←→ כיוון (Shift לדיוק) · ↑↓ כוח · רווח מכה | Keyboard (Tab to the white ball): ←→ aim (Shift for fine) · ↑↓ power · Space strike | כל טקסט הרמז מתחת למשחק: "מקלדת" ב-<b> והמקשים ב-<kbd>. אותו אלמנט כמו greenroom.clear.keys, אבל כאן החצים צמודים (בלי רווח בין שני ה-<kbd>). באנגלית נשארים אותם סימנים (←→ ↑↓ Shift), כדי שהממיר ישים את ה-<kbd> במקומם |
| `greenroom.dims.sign.closed` | הדלפק סגור | Desk closed | תוכן מדומה בתוך מסך. כרטיס שולחני על הדלפק בחדר התלת-ממדי, שורה גדולה |
| `greenroom.dims.sign.book` | הזמנה באפליקציה | Book in the app | תוכן מדומה בתוך מסך. כרטיס שולחני על הדלפק בחדר התלת-ממדי, השורה הקטנה |

## my-branch

| id | עברית | English | הערה |
|---|---|---|---|
| `branch.eyebrow.sub` | מערכות הסניף | Branch systems | כותרת-על, לצד "בניתי לעסק שלי" (home.branch.eyebrow) |
| `branch.hub.title` | הסניף | Branch | במרכז חוגת היום, מעל "08:00–23:00" |
| `branch.story.0800.part` | בוקר | Morning | תווית התקופה ליד 08:00, כמו branch.story.1600.part ("אחר הצהריים") |
| `branch.story.0800.open.aria` | משמרות: לפתוח את המסכים | Shifts: open the screens | aria-label של כפתור המסכים בשעה 08:00, כמו branch.story.1230.open.aria |
| `branch.story.1030.part` | לפני הספקים | Before suppliers | תווית התקופה ליד 10:30 |
| `branch.story.1030.open.aria` | מלאי: לפתוח את המסכים | Stock: open the screens | aria-label של כפתור המסכים בשעה 10:30 |
| `branch.story.1230.part` | שיא הצהריים | Lunch rush | תווית התקופה ליד 12:30 |
| `branch.story.1930.part` | שיא הערב | Dinner rush | תווית התקופה ליד 19:30 |
| `branch.story.2300.open.aria` | Z: לפתוח את המסכים | Z: open the screens | aria-label של כפתור המסכים בשעה 23:00 |
| `branch.story.2300.part` | סגירה | Closing | תווית התקופה ליד 23:00. אותה מילה ב-/work היא aria-label של כפתור סגירה (work.zoom.close, "Close"); המשמעות שונה ולכן שורה נפרדת, והממיר בוחר לפי הדף |

## mexicani-network

| id | עברית | English | הערה |
|---|---|---|---|
| `network.hq.nav.branches` | סניפים | Branches | תוכן מדומה בתוך מסך. פריט בתפריט המודולים של מסך ההנהלה |
| `network.hq.nav.audits` | ביקורות | Audits | תוכן מדומה בתוך מסך. פריט בתפריט המודולים של מסך ההנהלה |
| `network.hq.nav.tasks` | משימות | Tasks | תוכן מדומה בתוך מסך. פריט בתפריט המודולים של מסך ההנהלה |
| `network.hq.nav.documents` | מסמכים | Documents | תוכן מדומה בתוך מסך. פריט בתפריט המודולים של מסך ההנהלה |
| `network.hq.nav.assistant` | עוזר AI | AI assistant | תוכן מדומה בתוך מסך. פריט בתפריט המודולים של מסך ההנהלה: כל הטקסט, עם AI בתוך <bdi>. הכותרת המלאה "עוזר AI שעונה על שאלות מתוך המידע של הרשת" היא network.built6 |
| `network.hq.title` | כל הסניפים | All branches | תוכן מדומה בתוך מסך. כותרת מסך ההנהלה |
| `network.problem.h2` | אף אחד לא רואה את התמונה המלאה. | Nobody sees the whole picture. | h2 של סעיף הבעיה. המשפט המלא נמצא ב-network.problem |
| `network.mess.one.title` | מסך אחד | One screen | כותרת הצד "אחרי" בהשוואת הכאוס, מעל network.mess.one1 עד one3 |
| `network.ui.ring.audit` | ביקורת | Audit | תוכן מדומה בתוך מסך. תווית בתוך טבעת ההתקדמות במסך ההנהלה |
| `network.result.eyebrow` | התוצאה | The result | כותרת-על של סעיף התוצאה, ואותה מילה כ-h2 נסתר (sr-only) באותו סעיף |
| `network.outro.branch` | לסניף שלי | See my branch | כפתור משני בסוף הדף, מוביל ל-/work/my-branch |

## social

| id | עברית | English | הערה |
|---|---|---|---|
| `social.hero.eyebrow` | תוכן, מיתוג ותזמון | Content, branding and scheduling | כותרת-על לצד "סושיאל". אותה פתיחה כמו social.sub |
| `social.what.eyebrow` | השירות | The service | כותרת-על של סעיף "מה אני עושה", לצד "מה כלול" |
| `social.what.content.title` | תוכן | Content | כותרת קטנה ברשימת "מה אני עושה". social.what.content הוא המחרוזת השלמה "תוכן · פוסטים..." |
| `social.what.content.line` | פוסטים, סטוריז וסרטונים קצרים, בשפה של העסק | Posts, stories and short videos, in your business's voice | שורת הסבר ברשימת "מה אני עושה", חצי שני של social.what.content |
| `social.what.brand.line` | לוגו, צבעים ותבניות שכל פוסט נבנה עליהן | Logo, colours and templates every post is built on | שורת הסבר ברשימת "מה אני עושה", חצי שני של social.what.brand. הכותרת "מיתוג" היא work.tag.branding |
| `social.what.schedule.line` | לוח תוכן חודשי שמתפרסם לבד | A monthly content calendar that publishes itself | שורת הסבר ברשימת "מה אני עושה", חצי שני של social.what.schedule. הכותרת "תזמון" היא home.services.content.inc2 |
| `social.what.campaigns.title` | קמפיינים | Campaigns | כותרת קטנה ברשימת "מה אני עושה". social.what.campaigns הוא המחרוזת השלמה |
| `social.what.campaigns.line` | מודעות שמביאות פניות ישר לוואטסאפ | Ads that send inquiries straight to WhatsApp | שורת הסבר ברשימת "מה אני עושה", חצי שני של social.what.campaigns |
| `social.system.eyebrow.sub` | מכינה, מתזמנת ומפרסמת | Prepares, schedules and publishes | כותרת-על של "המערכת שמאחורי זה", לצד התג AI |
| `social.pipe.prepare.title` | מכינה | Prepares | כותרת שלב 1 במסלול. תחתיה social.pipe.prepare.line |
| `social.pipe.schedule.title` | מתזמנת | Schedules | כותרת שלב 2 במסלול |
| `social.pipe.schedule.month` | החודש | This month | כותרת לוח השנה המומחש בשלב 2, לצד social.feed.status.scheduled ("מתוזמן"). תוכן מדומה בתוך מסך |
| `social.pipe.publish.title` | מפרסמת | Publishes | כותרת שלב 3 במסלול. השורה שמתחתיה היא social.how.step4 |
| `social.gallery.item01.open.aria` | להגדיל: פוסט של Green Room: המנה המומלצת, על רקע שולחן הסנוקר | Enlarge: A Green Room post: the recommended dish, set against the snooker table | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item01.alt |
| `social.gallery.item02.open.aria` | להגדיל: מודעה של חשמלכה: עמדת טעינה חכמה לרכב חשמלי, כולל התקנה | Enlarge: A Hashmalka ad: a smart EV charger, installation included | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item02.alt |
| `social.gallery.item03.open.aria` | להגדיל: מודעה של ברסלב פרויקטים: מחדשים את הבית, מדייקים בכל פרט | Enlarge: A Breslev Projects ad: renewing the home, precise in every detail | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item03.alt |
| `social.gallery.item04.open.aria` | להגדיל: פלאייר של Asian Bar בסגנון ניאון | Enlarge: An Asian Bar flyer in a neon style | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item04.alt |
| `social.gallery.item05.open.aria` | להגדיל: הלוגו של ברסלב פרויקטים: להבה זהובה ושם החברה | Enlarge: The Breslev Projects logo: a golden flame and the company name | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item05.alt |
| `social.gallery.item06.open.aria` | להגדיל: פוסט של Green Room: שולחן פנוי הערב | Enlarge: A Green Room post: a free table tonight | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item06.alt |
| `social.gallery.item07.open.aria` | להגדיל: סטורי של חשמלכה: עמדת טעינה, התקנה מקצועית | Enlarge: A Hashmalka story: a charging station, professional installation | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item07.alt |
| `social.gallery.item08.open.aria` | להגדיל: פוסט של Green Room: טיפ למשחק | Enlarge: A Green Room post: a tip for the game | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item08.alt |
| `social.gallery.item09.open.aria` | להגדיל: פלאייר של Asian Bar: מוצרים ומטעמים מאסיה, שעות פתיחה | Enlarge: An Asian Bar flyer: products and treats from Asia, opening hours | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item09.alt |
| `social.gallery.item10.open.aria` | להגדיל: פוסט של Green Room: המועדון בבאר שבע | Enlarge: A Green Room post: the club in Be'er Sheva | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item10.alt |
| `social.gallery.item11.open.aria` | להגדיל: מודעה של ברסלב פרויקטים: ריצוף ועבודות גמר | Enlarge: A Breslev Projects ad: tiling and finishing work | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item11.alt |
| `social.gallery.item12.open.aria` | להגדיל: קרוסלה של חשמלכה: שלושה צעדים, משיחה ועד הטעינה הראשונה | Enlarge: A Hashmalka carousel: three steps, from the first call to the first charge | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item12.alt |
| `social.gallery.item13.open.aria` | להגדיל: מודעה של חשמלכה: טוענים בבית, יוצאים מוכנים | Enlarge: A Hashmalka ad: charge at home, leave ready | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item13.alt |
| `social.gallery.item14.open.aria` | להגדיל: פוסט של Green Room: חוגגים כאן יום הולדת | Enlarge: A Green Room post: celebrate birthdays here | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item14.alt |
| `social.gallery.item15.open.aria` | להגדיל: מודעה של ברסלב פרויקטים: עבודות גמר, תוצאה שלמה | Enlarge: A Breslev Projects ad: finishing work, a complete result | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item15.alt |
| `social.gallery.item16.open.aria` | להגדיל: פוסט של Green Room: ערב חברה | Enlarge: A Green Room post: a company night out | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item16.alt |
| `social.gallery.item17.open.aria` | להגדיל: פוסט של Green Room: שיעור עם מאמן | Enlarge: A Green Room post: a lesson with a coach | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item17.alt |
| `social.gallery.item18.open.aria` | להגדיל: מודעה של ברסלב פרויקטים: מתמחים בעבודות גמר | Enlarge: A Breslev Projects ad: specialists in finishing work | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item18.alt |
| `social.gallery.item19.open.aria` | להגדיל: מודעה של חשמלכה: עמדת טעינה חכמה בבית הלקוח | Enlarge: A Hashmalka ad: a smart charging station at the customer's home | aria-label של אריח בגלריית הסושיאל: social.gallery.open ("להגדיל") ואחריו social.gallery.item19.alt |
| `social.feed.stories.aria` | סטוריז | Stories | aria-label של רצועת הסטוריז בפיד המומחש |
| `social.feed.story.hashmalka` | חשמלכה | Hashmalka | תוכן מדומה בתוך מסך. שם מתחת לטבעת הסטורי בפיד, וגם שם הכותב ב-js/story/social.js. שם הלקוח מחכה להסכמה (COPY-GAP פריט 14) |
| `social.feed.story.breslev` | ברסלב | Breslev | תוכן מדומה בתוך מסך. שם מתחת לטבעת הסטורי בפיד, וגם שם הכותב ב-js/story/social.js. שם הלקוח מחכה להסכמה (COPY-GAP פריט 14) |
| `social.feed.storyViewer.aria` | סטורי | Story | aria-label של חלון הסטורי הפתוח (role=dialog) |

## about

| id | עברית | English | הערה |
|---|---|---|---|
| `about.bio.tag` | הסיפור | The story | כותרת-על של הביוגרפיה, לצד about.bio.tag.sub ("שמונה שלבים") |
| `about.level01.cap` | באר שבע | Be'er Sheva | כיתוב התמונה בשלב 1, לצד "המחשה" (global.illustration) |
| `about.level06.badge.k` | מהנדס | Engineer | על התג של שלב 6, מתחת לתג AI (שני אלמנטים נפרדים), ולכן "Engineer" מתחת ל-AI. הכותרת והתפריט של השלב משתמשים ב-about.level06.title |
| `about.level06.badge.hours` | 250 שעות אקדמיות | 250 academic hours | הכיתוב מתחת לתג שנפתח. about.level06.badge.aria כולל אותו במשפט שלם |
| `about.level07.cap` | נתיבות | Netivot | כיתוב התמונה בשלב 7 (היום) |
| `about.outro.eyebrow` | תורכם | Your turn | כותרת-על מעל ה-h2 "זה הסיפור. עכשיו תורכם." (about.outro.h2) |

## plans

Every Hebrew string listed for `/plans` is a plan-card item that is also on the home page, so its row is under `index` (the `home.plans.*` ids).

## check

| id | עברית | English | הערה |
|---|---|---|---|
| `check.hero.demoTag` | דוגמה | Sample | תג בכותרת-על. אותה מילה היא גם התווית הקטנה בתצוגה המקדימה של ה-JS (ליד "לפי התחום שבחרתם" ו"לפי מה שכתבתם"). check.sample.label הוא "דוגמה · כך נראה דוח" |
| `check.badges.noSignup` | בלי הרשמה | No sign-up | תג ברשימת התגים של ההירו, מתוך check.badges |
| `check.badges.noContact` | בלי טלפון ומייל | No phone or email | תג ברשימת התגים של ההירו, מתוך check.badges |

## play

| id | עברית | English | הערה |
|---|---|---|---|
| `play.neon.facts.aria` | על המשחק | About the game | aria-label של רשימת העובדות על Neon Alley |
| `play.neon.fact.browser` | רץ בדפדפן | Runs in the browser | פריט ברשימת העובדות על Neon Alley, לצד play.neon.fact.waves |
| `play.avatar.kick` | לבעוט | Kick | כפתור תנועה של נדב הקטן. home.play.kick הוא "בעיטה" בכדורים |
| `play.avatar.work` | לעבוד | Work | כפתור תנועה של נדב הקטן (נדב עם מחשב). play.avatar.laptop הוא "לבדוק קוד", והוא כפתור נפרד בפרוטוטייפ |

## accessibility

| id | עברית | English | הערה |
|---|---|---|---|
| `global.legal.toc` | בעמוד הזה | On this page | כותרת תוכן העניינים בעמודי הנגישות והפרטיות |
| `a11y.tested.body.full` | האתר נבדק בכרום, ספארי, פיירפוקס ואדג', במחשב ובטלפון, עם קוראי המסך NVDA ו-VoiceOver. תאריך הבדיקה האחרונה: [ימולא לפני ההשקה]. | The site was tested in Chrome, Safari, Firefox and Edge, on desktop and mobile, with the NVDA and VoiceOver screen readers. Last tested: [To be filled in before launch]. | כל הפסקה: NVDA ו-VoiceOver הם <bdi>, ושער ההשקה הוא <span class="tbd"> עם הנקודה אחריו. שער השקה. a11y.tested.body הוא הנוסח עם TBD |
| `global.legal.launchGate` | [ימולא לפני ההשקה] | [To be filled in before launch] | שער השקה. בדפי הנגישות והפרטיות הוא נכלל עכשיו בשורות המלאות (a11y.tested.body.full, a11y.updated.line, privacy.controller.body.full, privacy.changes.body.full), והממיר מתאים קודם את הריצה השלמה; השורה נשארת למקרה שהמציין מופיע לבדו |
| `a11y.contact.phone.label` | טלפון ווואטסאפ | Phone and WhatsApp | תווית (dt) ברשימת רכז הנגישות. a11y.contact.phone הוא המחרוזת השלמה עם המספר |
| `a11y.updated.line` | ההצהרה עודכנה לאחרונה: [ימולא לפני ההשקה] | Statement last updated: [To be filled in before launch] | כל השורה, עם שער ההשקה בתוך <span class="tbd">. שער השקה. a11y.updated הוא הנוסח עם TBD |

## privacy

| id | עברית | English | הערה |
|---|---|---|---|
| `privacy.changes.body.full` | אם משהו כאן ישתנה, אעדכן את העמוד ואת התאריך. עדכון אחרון: [ימולא לפני ההשקה]. | If anything here changes, I'll update this page and its date. Last updated: [To be filled in before launch]. | כל הפסקה, עם שער ההשקה בתוך <span class="tbd"> והנקודה אחריו. שער השקה. privacy.changes.body הוא הנוסח עם TBD |

## JS modules

| id | עברית | English | הערה |
|---|---|---|---|
| `check.sample.automate1.title` | רישום משלוחים וכסף בשטח. | Delivery and cash tracking. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.automate1. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.automate1.body` | כל משלוח נרשם כשהוא יוצא, ורואים בכל רגע כמה כסף אצל כל שליח. | Every delivery is logged as it leaves, and you see at any moment what cash each courier holds. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.automate1. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.automate2.title` | סיכום יומי בוואטסאפ. | A daily WhatsApp summary. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.automate2. ה-JS מציג כותרת וגוף בנפרד. אותה כותרת מופיעה גם ב-check.sample.services.automate3 |
| `check.sample.automate2.body` | בסוף כל יום מגיעה הודעה עם המשלוחים, הכסף והפערים. | Every evening, one message with deliveries, cash and gaps. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.automate2. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.automate3.title` | סגירת קופה בטלפון. | Register close on your phone. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.automate3. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.automate3.body` | ספירה לפי שטרות ומטבעות, ודוח מוכן. | Count by notes and coins, report ready. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.automate3. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.beauty.automate1.title` | קביעת תורים מתוך הוואטסאפ. | Booking appointments from WhatsApp. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.beauty.automate1. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.beauty.automate1.body` | הלקוח בוחר שעה פנויה בעצמו, והתור נכנס ליומן של הכסא הנכון. | The customer picks a free time on their own, and the appointment goes into the right chair's calendar. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.beauty.automate1. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.beauty.automate2.title` | תזכורת יום לפני. | A reminder the day before. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.beauty.automate2. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.beauty.automate2.body` | הודעה עם אישור הגעה, ותור שמתבטל חוזר מיד ליומן. | A message asking to confirm arrival, and a canceled appointment goes straight back into the calendar. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.beauty.automate2. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.beauty.automate3.title` | רשימת המתנה לשעות העומס. | A waiting list for busy hours. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.beauty.automate3. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.beauty.automate3.body` | כשמתפנה תור ביום חמישי, ההודעה יוצאת לבא בתור ברשימה. | When a Thursday slot opens up, the message goes to the next person on the list. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.beauty.automate3. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.clinic.automate1.title` | סוכן שעונה בוואטסאפ. | An agent that answers on WhatsApp. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.clinic.automate1. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.clinic.automate1.body` | עונה על שעות, כתובת והכנה לטיפול, רק מתוך המידע של הקליניקה, ושאלה רפואית עוברת למטפל. | It answers about hours, address and treatment prep, only from the clinic's information, and a medical question goes to the therapist. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.clinic.automate1. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.clinic.automate2.title` | קביעת תורים ביומן המשותף. | Booking into the shared calendar. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.clinic.automate2. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.clinic.automate2.body` | המטופל בוחר שעה, והתור נכנס ליומן של המטפל הנכון. | The patient picks a time, and the appointment goes into the right therapist's calendar. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.clinic.automate2. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.clinic.automate3.title` | תזכורות ואישור הגעה. | Reminders and arrival confirmation. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.clinic.automate3. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.clinic.automate3.body` | הודעה יום לפני, ותור שמתבטל מתפנה למטופל הבא. | A message the day before, and a canceled appointment goes to the next patient. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.clinic.automate3. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.services.automate1.title` | לוח עבודות אחד לכל הצוות. | One jobs board for the whole team. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.services.automate1. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.services.automate1.body` | כל עבודה נרשמת פעם אחת, וכל עובד רואה בטלפון לאן הוא נוסע היום. | Each job is entered once, and every worker sees on their phone where they're driving today. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.services.automate1. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.services.automate2.title` | אישור ותזכורת ללקוח בוואטסאפ. | A confirmation and a reminder to the customer on WhatsApp. | כותרת של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי ראשון של check.sample.services.automate2. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.services.automate2.body` | הלקוח מקבל אישור כשהעבודה נקבעת, ותזכורת יום לפני. | The customer gets a confirmation when the job is set, and a reminder the day before. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.services.automate2. ה-JS מציג כותרת וגוף בנפרד. |
| `check.sample.services.automate3.body` | בסוף כל יום מגיעה הודעה עם מה שבוצע ומה מחכה למחר. | At the end of every day a message arrives with what was done and what's waiting for tomorrow. | גוף של פריט ב"מה הייתי הופך לאוטומטי קודם" (check.result.automate.h) בדוח הדוגמה, חצי שני של check.sample.services.automate3. ה-JS מציג כותרת וגוף בנפרד. |
| `work.filter.count` | {n} עבודות | {n} projects | {n} הוא מספר העבודות שמוצגות אחרי הסינון (ב-JS: ${shown}). בעברית אותה צורה לכל מספר, כולל 1; באנגלית 1 דורש "project" |
| `work.zoom.open` | לפתוח | Open | תווית ברירת המחדל של כפתור הקישור בחלון ההגדלה, כשלכרטיס אין data-href-label |
| `medizen.desk.end.p.proto` | טיפלתם ב-{mine} בקשות, הבוט ב-{bots}.{best} | You handled {mine} requests, the bot {bots}. {best} | שורת הסיכום של משחק המזכירה. אותו אלמנט כמו medizen.desk.end.p, עם מציין שלישי: ב-JS אחרי הנקודה בא ${isBest ? " שיא חדש." : ""}, והממיר מתאים תבנית רק כשהיא מכסה את כל הטקסט. {best} = medizen.desk.end.best.new או ריק. באנגלית יש רווח לפני {best}, כי ה-JS לא מוסיף אחד |
| `greenroom.clear.end.p.clear.proto` | {points} מהכדורים ועוד {bonus} שניות שנשארו.{best} | {points} from the balls and {bonus} for the seconds left. {best} | שורת הסיכום של "לנקות את הצבעוניים" כשהשולחן נקי. אותו אלמנט כמו greenroom.clear.end.p.clear, עם מציין שלישי {best} לסוף המותנה (greenroom.clear.end.best.new או ריק). {points} = נקודות הכדורים, {bonus} = שניות שנשארו. באנגלית יש רווח לפני {best} |
| `sporchat.pk.live.shot.proto` | בעיטה {shot}: {result}. {goals} מתוך {total}. | Shot {shot}: {result}. {goals} out of {total}. | הודעת aria-live אחרי בעיטה. אותו אלמנט כמו sporchat.pk.live.shot, אבל שם {n} מופיע פעמיים והממיר לא מצליח לבנות ממנו תבנית (שם קבוצה כפול). כאן {shot} ו-{total} הם שניהם מספר הבעיטה, ו-{result} אחת משורות sporchat.pk.say.* |
