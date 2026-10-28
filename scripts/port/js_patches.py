"""Exact (old, new) replacements applied to a prototype module before the automatic string pass.

Use them only where the prototype assumes static .html pages or builds markup with Hebrew inside a longer string.
A patch that no longer applies stops the sync, so a prototype change cannot silently skip one.
"""
JS_PATCHES: dict[str, list[tuple[str, str]]] = {
    'js/chrome-site.js': [
        # the current page comes from the route, not from an .html file name
        ("const here = (location.pathname.split('/').pop() || 'index.html').replace(/\\.html?$/, '') || 'index';",
         "const here = window.__page;"),
        ("const t = (a.getAttribute('href') || '').replace(/\\.html?$/, '');",
         "const t = window.__pageOf(a.getAttribute('href') || '') || '';"),
        ("'<span class=\"sr\"> (העמוד הנוכחי)</span>'", "'<span class=\"sr\"> ' + __t('global.nav.current') + '</span>'"),
        # the review switcher (shown only with ?look= or ?review, ANSWERS #68) reads its labels from the deck
        ("const LOOK_NAMES = { a: 'לילה', b: 'יום' };", "const LOOK_NAMES = { a: __t('global.theme.night'), b: __t('global.theme.day') };"),
        ("bar.setAttribute('aria-label', 'מראה האתר (לבדיקה)');", "bar.setAttribute('aria-label', __t('global.theme.label'));"),
        ("b.title = `${k.toUpperCase()} · ${LOOK_NAMES[k]}`;", "b.title = LOOK_NAMES[k];"),
        ("b.setAttribute('aria-label', `מראה ${k.toUpperCase()}: ${LOOK_NAMES[k]}`);", "b.setAttribute('aria-label', LOOK_NAMES[k]);"),
    ],
    # the "text turns into particles" effect draws the typed text where the field shows it, in either direction
    'js/check.js': [
        ("g.direction = 'rtl'; g.textAlign = 'right';", "const ltr = getComputedStyle(input).direction === 'ltr'; g.direction = ltr ? 'ltr' : 'rtl'; g.textAlign = ltr ? 'left' : 'right';"),
        ("g.fillText(text, ir.right - fr.left - parseFloat(cs.paddingInlineStart || 0),",
         "g.fillText(text, ltr ? ir.left - fr.left + parseFloat(cs.paddingInlineStart || 0) : ir.right - fr.left - parseFloat(cs.paddingInlineStart || 0),"),
    ],
    'js/sales-pages.js': [
        ('aria-live="polite">זה בערך ${hoursOf(a.times, a.min)} שעות בחודש.</p>',
         "aria-live=\"polite\">${__t('check.result.automate.saved', { hours: hoursOf(a.times, a.min) })}</p>"),
        ("g.direction = 'rtl'; g.textAlign = 'right';", "const ltr = getComputedStyle(input).direction === 'ltr'; g.direction = ltr ? 'ltr' : 'rtl'; g.textAlign = ltr ? 'left' : 'right';"),
        ("const NEW = '<span class=\"sr\"> (נפתח בחלון חדש)</span>';", "const NEW = '<span class=\"sr\"> ' + __t('global.newWindow') + '</span>';"),
        ("'<p class=\"saved__ok\" id=\"ckrReportDone\">תודה. הדיווח הגיע אליי.</p>'",
         "'<p class=\"saved__ok\" id=\"ckrReportDone\">' + __t('check.report.done') + '</p>'"),
        ("g.fillText(l, ir.right - fr.left - parseFloat(cs.paddingInlineStart || 0), top + i * lh)",
         "g.fillText(l, ltr ? ir.left - fr.left + parseFloat(cs.paddingInlineStart || 0) : ir.right - fr.left - parseFloat(cs.paddingInlineStart || 0), top + i * lh)"),
    ],
    # Hebrew inside a longer piece of markup: the text becomes a deck lookup, the markup stays
    'js/story/social.js': [
        ('aria-label="פוסט של ${w.name}"', "aria-label=\"${__t('social.feed.post.aria', { name: w.name })}\""),
    ],
    'js/story-pages.js': [
        ("'<span class=\"st-ill\">המחשה</span>'", "'<span class=\"st-ill\">' + __t('global.illustration') + '</span>'"),
    ],
    'js/story/branch.js': [
        ('>היום · <bdi dir="ltr">16:02</bdi></span>', ">${__t('branch.mock.repairs.time', { time: '<bdi dir=\"ltr\">16:02</bdi>' })}</span>"),
        ('<span class="mk__chip">עד <bdi dir="ltr">03/2027</bdi></span>', "<span class=\"mk__chip\">${__t('branch.mock.repairs.chip2', { date: '<bdi dir=\"ltr\">03/2027</bdi>' })}</span>"),
    ],
    # end-of-game lines with a conditional tail: one deck string per branch
    'js/games/greenroom-play.js': [
        ("cleared ? `${score - bonus} מהכדורים ועוד ${bonus} שניות שנשארו.${isBest ? ' שיא חדש.' : ''}` : `הגעתם עד ה${cols[Math.min(target, 5)].c.name}.${isBest ? ' שיא חדש.' : ` השיא שלכם: ${best}.`}`",
         "(cleared ? __t('greenroom.clear.end.p.clear.proto', { points: score - bonus, bonus: bonus, best: '' }).trim()"
         " : __t('greenroom.clear.end.p.time', { color: cols[Math.min(target, 5)].c.name }))"
         " + ' ' + (isBest ? __t('greenroom.clear.end.best.new') : cleared ? '' : __t('greenroom.clear.end.best.yours', { n: best }))"),
    ],
    'js/games/medizen-desk.js': [
        ("say(`הבוט היה מהיר יותר: ${r.name}${s ? ` · ${DAYS[s.d]} ${TIMES[s.h]}` : ' ברשימת המתנה'}`, false);",
         "say(s ? __t('medizen.desk.msg.bot.book', { name: r.name, day: DAYS[s.d], time: TIMES[s.h] }) : __t('medizen.desk.msg.bot.wait', { name: r.name }), false);"),
    ],
    'hero/zoom.js': [
        ('aria-label="לסגור את המסך המוגדל">', "aria-label=\"' + __t('home.hero.dialog.close') + '\">"),
        ('<a class="zd__go" href="work.html">לעמוד הפרויקט<svg', "<a class=\"zd__go\" href=\"' + __href('work') + '\">' + __t('home.hero.peek.go') + '<svg"),
        ('<span class="zc__go-l">לעמוד הפרויקט</span><span class="zc__go-s">לפרויקט</span>',
         "<span class=\"zc__go-l\">' + __t('home.hero.peek.go') + '</span><span class=\"zc__go-s\">' + __t('home.hero.peek.goShort') + '</span>"),
    ],
}

# ids the patches above read; the sync adds them to messages/js-ids.json
PATCH_IDS = ['greenroom.clear.end.p.clear.proto', 'greenroom.clear.end.p.time', 'greenroom.clear.end.best.new', 'greenroom.clear.end.best.yours',
             'medizen.desk.msg.bot.book', 'medizen.desk.msg.bot.wait', 'branch.mock.repairs.time', 'branch.mock.repairs.chip2', 'check.result.automate.saved', 'social.feed.post.aria', 'global.illustration', 'global.newWindow', 'check.report.done',
             'global.nav.current', 'global.theme.night', 'global.theme.day', 'global.theme.label',
             'home.hero.dialog.close', 'home.hero.peek.go', 'home.hero.peek.goShort']
