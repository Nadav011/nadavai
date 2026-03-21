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
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  if (stryMutAct_9fa48("627")) {
    {}
  } else {
    stryCov_9fa48("627");
    const baseUrl = stryMutAct_9fa48("628") ? "" : (stryCov_9fa48("628"), "https://nadavc.ai");
    return stryMutAct_9fa48("629") ? [] : (stryCov_9fa48("629"), [stryMutAct_9fa48("630") ? {} : (stryCov_9fa48("630"), {
      url: stryMutAct_9fa48("631") ? `` : (stryCov_9fa48("631"), `${baseUrl}/he`),
      lastModified: new Date(),
      changeFrequency: stryMutAct_9fa48("632") ? "" : (stryCov_9fa48("632"), "weekly"),
      priority: 1,
      alternates: stryMutAct_9fa48("633") ? {} : (stryCov_9fa48("633"), {
        languages: stryMutAct_9fa48("634") ? {} : (stryCov_9fa48("634"), {
          he: stryMutAct_9fa48("635") ? `` : (stryCov_9fa48("635"), `${baseUrl}/he`),
          en: stryMutAct_9fa48("636") ? `` : (stryCov_9fa48("636"), `${baseUrl}/en`)
        })
      })
    }), stryMutAct_9fa48("637") ? {} : (stryCov_9fa48("637"), {
      url: stryMutAct_9fa48("638") ? `` : (stryCov_9fa48("638"), `${baseUrl}/en`),
      lastModified: new Date(),
      changeFrequency: stryMutAct_9fa48("639") ? "" : (stryCov_9fa48("639"), "weekly"),
      priority: 0.9,
      alternates: stryMutAct_9fa48("640") ? {} : (stryCov_9fa48("640"), {
        languages: stryMutAct_9fa48("641") ? {} : (stryCov_9fa48("641"), {
          he: stryMutAct_9fa48("642") ? `` : (stryCov_9fa48("642"), `${baseUrl}/he`),
          en: stryMutAct_9fa48("643") ? `` : (stryCov_9fa48("643"), `${baseUrl}/en`)
        })
      })
    })]);
  }
}