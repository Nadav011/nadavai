// @ts-nocheck
'use client';

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
import { Toaster as Sonner } from 'sonner';
type ToasterProps = React.ComponentProps<typeof Sonner>;
const Toaster = ({
  ...props
}: ToasterProps) => {
  if (stryMutAct_9fa48("3675")) {
    {}
  } else {
    stryCov_9fa48("3675");
    return <Sonner theme="dark" className="toaster group" toastOptions={stryMutAct_9fa48("3676") ? {} : (stryCov_9fa48("3676"), {
      classNames: stryMutAct_9fa48("3677") ? {} : (stryCov_9fa48("3677"), {
        toast: stryMutAct_9fa48("3678") ? "" : (stryCov_9fa48("3678"), 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg'),
        description: stryMutAct_9fa48("3679") ? "" : (stryCov_9fa48("3679"), 'group-[.toast]:text-muted-foreground'),
        actionButton: stryMutAct_9fa48("3680") ? "" : (stryCov_9fa48("3680"), 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground'),
        cancelButton: stryMutAct_9fa48("3681") ? "" : (stryCov_9fa48("3681"), 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground')
      })
    })} {...props} />;
  }
};
export { Toaster };