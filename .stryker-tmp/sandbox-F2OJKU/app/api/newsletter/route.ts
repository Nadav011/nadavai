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
import { NextResponse } from "next/server";

// In-memory store — replace with Buttondown/Resend/database before production.
// NOTE: In-memory rate limiter resets on cold starts; replace with Upstash Redis
// (@upstash/ratelimit) when a real email provider is wired up.
const subscribers = new Set<string>();

// Simple in-memory rate limiter: max 5 requests per IP per minute.
const rateLimitMap = new Map<string, {
  count: number;
  resetAt: number;
}>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
function isRateLimited(ip: string): boolean {
  if (stryMutAct_9fa48("440")) {
    {}
  } else {
    stryCov_9fa48("440");
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (stryMutAct_9fa48("443") ? !entry && now > entry.resetAt : stryMutAct_9fa48("442") ? false : stryMutAct_9fa48("441") ? true : (stryCov_9fa48("441", "442", "443"), (stryMutAct_9fa48("444") ? entry : (stryCov_9fa48("444"), !entry)) || (stryMutAct_9fa48("447") ? now <= entry.resetAt : stryMutAct_9fa48("446") ? now >= entry.resetAt : stryMutAct_9fa48("445") ? false : (stryCov_9fa48("445", "446", "447"), now > entry.resetAt)))) {
      if (stryMutAct_9fa48("448")) {
        {}
      } else {
        stryCov_9fa48("448");
        rateLimitMap.set(ip, stryMutAct_9fa48("449") ? {} : (stryCov_9fa48("449"), {
          count: 1,
          resetAt: stryMutAct_9fa48("450") ? now - RATE_LIMIT_WINDOW_MS : (stryCov_9fa48("450"), now + RATE_LIMIT_WINDOW_MS)
        }));
        return stryMutAct_9fa48("451") ? true : (stryCov_9fa48("451"), false);
      }
    }
    if (stryMutAct_9fa48("455") ? entry.count < RATE_LIMIT_MAX : stryMutAct_9fa48("454") ? entry.count > RATE_LIMIT_MAX : stryMutAct_9fa48("453") ? false : stryMutAct_9fa48("452") ? true : (stryCov_9fa48("452", "453", "454", "455"), entry.count >= RATE_LIMIT_MAX)) return stryMutAct_9fa48("456") ? false : (stryCov_9fa48("456"), true);
    stryMutAct_9fa48("457") ? entry.count-- : (stryCov_9fa48("457"), entry.count++);
    return stryMutAct_9fa48("458") ? true : (stryCov_9fa48("458"), false);
  }
}
const EMAIL_RE = stryMutAct_9fa48("469") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("468") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("467") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("466") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("465") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("464") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("463") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("462") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("461") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("460") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("459") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("459", "460", "461", "462", "463", "464", "465", "466", "467", "468", "469"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
export async function POST(request: Request) {
  if (stryMutAct_9fa48("470")) {
    {}
  } else {
    stryCov_9fa48("470");
    // Rate limiting
    const forwarded = request.headers.get(stryMutAct_9fa48("471") ? "" : (stryCov_9fa48("471"), "x-forwarded-for"));
    const ip = forwarded ? stryMutAct_9fa48("472") ? forwarded.split(",")[0] : (stryCov_9fa48("472"), forwarded.split(stryMutAct_9fa48("473") ? "" : (stryCov_9fa48("473"), ","))[0].trim()) : stryMutAct_9fa48("474") ? "" : (stryCov_9fa48("474"), "unknown");
    if (stryMutAct_9fa48("476") ? false : stryMutAct_9fa48("475") ? true : (stryCov_9fa48("475", "476"), isRateLimited(ip))) {
      if (stryMutAct_9fa48("477")) {
        {}
      } else {
        stryCov_9fa48("477");
        return NextResponse.json(stryMutAct_9fa48("478") ? {} : (stryCov_9fa48("478"), {
          error: stryMutAct_9fa48("479") ? "" : (stryCov_9fa48("479"), "יותר מדי בקשות. נסה שוב עוד דקה.")
        }), stryMutAct_9fa48("480") ? {} : (stryCov_9fa48("480"), {
          status: 429,
          headers: stryMutAct_9fa48("481") ? {} : (stryCov_9fa48("481"), {
            "Retry-After": stryMutAct_9fa48("482") ? "" : (stryCov_9fa48("482"), "60")
          })
        }));
      }
    }
    try {
      if (stryMutAct_9fa48("483")) {
        {}
      } else {
        stryCov_9fa48("483");
        const body: unknown = await request.json();

        // Input validation — reject non-objects and non-string emails
        if (stryMutAct_9fa48("486") ? typeof body !== "object" && body === null : stryMutAct_9fa48("485") ? false : stryMutAct_9fa48("484") ? true : (stryCov_9fa48("484", "485", "486"), (stryMutAct_9fa48("488") ? typeof body === "object" : stryMutAct_9fa48("487") ? false : (stryCov_9fa48("487", "488"), typeof body !== (stryMutAct_9fa48("489") ? "" : (stryCov_9fa48("489"), "object")))) || (stryMutAct_9fa48("491") ? body !== null : stryMutAct_9fa48("490") ? false : (stryCov_9fa48("490", "491"), body === null)))) {
          if (stryMutAct_9fa48("492")) {
            {}
          } else {
            stryCov_9fa48("492");
            return NextResponse.json(stryMutAct_9fa48("493") ? {} : (stryCov_9fa48("493"), {
              error: stryMutAct_9fa48("494") ? "" : (stryCov_9fa48("494"), "בקשה לא תקינה")
            }), stryMutAct_9fa48("495") ? {} : (stryCov_9fa48("495"), {
              status: 400
            }));
          }
        }
        const raw = (body as Record<string, unknown>).email;
        const email = (stryMutAct_9fa48("498") ? typeof raw !== "string" : stryMutAct_9fa48("497") ? false : stryMutAct_9fa48("496") ? true : (stryCov_9fa48("496", "497", "498"), typeof raw === (stryMutAct_9fa48("499") ? "" : (stryCov_9fa48("499"), "string")))) ? stryMutAct_9fa48("501") ? raw.toLowerCase() : stryMutAct_9fa48("500") ? raw.trim().toUpperCase() : (stryCov_9fa48("500", "501"), raw.trim().toLowerCase()) : stryMutAct_9fa48("502") ? "Stryker was here!" : (stryCov_9fa48("502"), "");
        if (stryMutAct_9fa48("505") ? (!email || email.length > 254) && !EMAIL_RE.test(email) : stryMutAct_9fa48("504") ? false : stryMutAct_9fa48("503") ? true : (stryCov_9fa48("503", "504", "505"), (stryMutAct_9fa48("507") ? !email && email.length > 254 : stryMutAct_9fa48("506") ? false : (stryCov_9fa48("506", "507"), (stryMutAct_9fa48("508") ? email : (stryCov_9fa48("508"), !email)) || (stryMutAct_9fa48("511") ? email.length <= 254 : stryMutAct_9fa48("510") ? email.length >= 254 : stryMutAct_9fa48("509") ? false : (stryCov_9fa48("509", "510", "511"), email.length > 254)))) || (stryMutAct_9fa48("512") ? EMAIL_RE.test(email) : (stryCov_9fa48("512"), !EMAIL_RE.test(email))))) {
          if (stryMutAct_9fa48("513")) {
            {}
          } else {
            stryCov_9fa48("513");
            return NextResponse.json(stryMutAct_9fa48("514") ? {} : (stryCov_9fa48("514"), {
              error: stryMutAct_9fa48("515") ? "" : (stryCov_9fa48("515"), "כתובת מייל לא תקינה")
            }), stryMutAct_9fa48("516") ? {} : (stryCov_9fa48("516"), {
              status: 400
            }));
          }
        }
        subscribers.add(email);
        return NextResponse.json(stryMutAct_9fa48("517") ? {} : (stryCov_9fa48("517"), {
          success: stryMutAct_9fa48("518") ? false : (stryCov_9fa48("518"), true)
        }));
      }
    } catch {
      if (stryMutAct_9fa48("519")) {
        {}
      } else {
        stryCov_9fa48("519");
        return NextResponse.json(stryMutAct_9fa48("520") ? {} : (stryCov_9fa48("520"), {
          error: stryMutAct_9fa48("521") ? "" : (stryCov_9fa48("521"), "שגיאה בשרת")
        }), stryMutAct_9fa48("522") ? {} : (stryCov_9fa48("522"), {
          status: 500
        }));
      }
    }
  }
}