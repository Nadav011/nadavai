// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { useTranslations } from 'next-intl';
import { Search, Home, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
export default function NotFound() {
  if (stryMutAct_9fa48("387")) {
    {}
  } else {
    stryCov_9fa48("387");
    const t = useTranslations(stryMutAct_9fa48("388") ? "" : (stryCov_9fa48("388"), 'notFound'));
    return <div className="min-h-screen flex items-center justify-center px-4 bg-[hsl(222,47%,4%)]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] bg-[#06d6e0]/5 rounded-full blur-[150px] animate-pulse-glow" style={stryMutAct_9fa48("389") ? {} : (stryCov_9fa48("389"), {
          top: stryMutAct_9fa48("390") ? "" : (stryCov_9fa48("390"), '20%'),
          left: stryMutAct_9fa48("391") ? "" : (stryCov_9fa48("391"), '50%'),
          transform: stryMutAct_9fa48("392") ? "" : (stryCov_9fa48("392"), 'translateX(-50%)')
        })} />
      </div>

      <div className="relative max-w-2xl w-full text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <span className="text-8xl md:text-9xl font-bold text-[hsl(210,40%,98%)] tracking-tight">4</span>
            <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
              <div className="absolute inset-0 bg-[#06d6e0]/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-[#06d6e0] to-[#4f46e5] p-[2px]">
                <div className="flex items-center justify-center w-full h-full rounded-full bg-[hsl(222,47%,4%)]">
                  <Search className="w-10 h-10 md:w-12 md:h-12 text-[#06d6e0]" aria-hidden="true" />
                </div>
              </div>
            </div>
            <span className="text-8xl md:text-9xl font-bold text-[hsl(210,40%,98%)] tracking-tight">4</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-5xl font-bold text-[hsl(210,40%,98%)] mb-4">
          {t(stryMutAct_9fa48("393") ? "" : (stryCov_9fa48("393"), 'title'))}
        </h1>
        <p className="text-base md:text-lg text-[hsl(215,20%,55%)] mb-10 leading-relaxed max-w-md mx-auto">
          {t(stryMutAct_9fa48("394") ? "" : (stryCov_9fa48("394"), 'description'))}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#06d6e0] to-[#0abfca] hover:shadow-[0_0_40px_hsl(187,92%,55%,0.4)] transition-all duration-500">
            <Home className="w-5 h-5" aria-hidden="true" />
            {t(stryMutAct_9fa48("395") ? "" : (stryCov_9fa48("395"), 'home'))}
          </Link>
          <Link href="/#contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-medium text-[hsl(210,40%,98%)] border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] hover:border-[#e84393]/40 transition-all duration-500">
            {t(stryMutAct_9fa48("396") ? "" : (stryCov_9fa48("396"), 'contact'))}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)]">
          <h2 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-3">
            {t(stryMutAct_9fa48("397") ? "" : (stryCov_9fa48("397"), 'suggestionsTitle'))}
          </h2>
          <nav aria-label={t(stryMutAct_9fa48("398") ? "" : (stryCov_9fa48("398"), 'suggestionsTitle'))}>
            <ul className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <li>
                <Link href="/#projects" className="text-[#06d6e0] hover:underline">
                  {t(stryMutAct_9fa48("399") ? "" : (stryCov_9fa48("399"), 'projects'))}
                </Link>
              </li>
              <li>
                <span className="text-[hsl(215,20%,35%)]">•</span>
              </li>
              <li>
                <Link href="/#services" className="text-[#06d6e0] hover:underline">
                  {t(stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), 'services'))}
                </Link>
              </li>
              <li>
                <span className="text-[hsl(215,20%,35%)]">•</span>
              </li>
              <li>
                <Link href="/#blog" className="text-[#06d6e0] hover:underline">
                  {t(stryMutAct_9fa48("401") ? "" : (stryCov_9fa48("401"), 'blog'))}
                </Link>
              </li>
              <li>
                <span className="text-[hsl(215,20%,35%)]">•</span>
              </li>
              <li>
                <Link href="/#guides" className="text-[#06d6e0] hover:underline">
                  {t(stryMutAct_9fa48("402") ? "" : (stryCov_9fa48("402"), 'guides'))}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>;
  }
}