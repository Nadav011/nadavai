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
        # the review switcher becomes the visitor's night/day choice
        ("const LOOK_NAMES = { a: 'לילה', b: 'יום' };", "const LOOK_NAMES = { a: __t('global.theme.night'), b: __t('global.theme.day') };"),
        ("bar.setAttribute('aria-label', 'מראה האתר (לבדיקה)');", "bar.setAttribute('aria-label', __t('global.theme.label'));"),
        ("b.title = `${k.toUpperCase()} · ${LOOK_NAMES[k]}`;", "b.title = LOOK_NAMES[k];"),
        ("b.setAttribute('aria-label', `מראה ${k.toUpperCase()}: ${LOOK_NAMES[k]}`);", "b.setAttribute('aria-label', LOOK_NAMES[k]);"),
    ],
    'hero/zoom.js': [
        ('aria-label="לסגור את המסך המוגדל">', "aria-label=\"' + __t('home.hero.dialog.close') + '\">"),
        ('<a class="zd__go" href="work.html">לעמוד הפרויקט<svg', "<a class=\"zd__go\" href=\"' + __href('work') + '\">' + __t('home.hero.peek.go') + '<svg"),
        ('<span class="zc__go-l">לעמוד הפרויקט</span><span class="zc__go-s">לפרויקט</span>',
         "<span class=\"zc__go-l\">' + __t('home.hero.peek.go') + '</span><span class=\"zc__go-s\">' + __t('home.hero.peek.goShort') + '</span>"),
    ],
}

# ids the patches above read; the sync adds them to messages/js-ids.json
PATCH_IDS = ['global.nav.current', 'global.theme.night', 'global.theme.day', 'global.theme.label',
             'home.hero.dialog.close', 'home.hero.peek.go', 'home.hero.peek.goShort']
