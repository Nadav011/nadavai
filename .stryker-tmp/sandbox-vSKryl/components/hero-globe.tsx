// @ts-nocheck
"use client";

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
import { useEffect, useRef, useCallback } from "react";
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  size: number;
  z: number; // depth 0=far 1=near
  hue: number; // slight color variation
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}
interface DataStream {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}
export function HeroGlobe() {
  if (stryMutAct_9fa48("1710")) {
    {}
  } else {
    stryCov_9fa48("1710");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef(stryMutAct_9fa48("1711") ? {} : (stryCov_9fa48("1711"), {
      x: stryMutAct_9fa48("1712") ? +9999 : (stryCov_9fa48("1712"), -9999),
      y: stryMutAct_9fa48("1713") ? +9999 : (stryCov_9fa48("1713"), -9999),
      active: stryMutAct_9fa48("1714") ? true : (stryCov_9fa48("1714"), false)
    }));
    const frameRef = useRef(0);
    const onMove = useCallback((e: MouseEvent) => {
      if (stryMutAct_9fa48("1715")) {
        {}
      } else {
        stryCov_9fa48("1715");
        const canvas = canvasRef.current;
        if (stryMutAct_9fa48("1718") ? false : stryMutAct_9fa48("1717") ? true : stryMutAct_9fa48("1716") ? canvas : (stryCov_9fa48("1716", "1717", "1718"), !canvas)) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = stryMutAct_9fa48("1719") ? {} : (stryCov_9fa48("1719"), {
          x: stryMutAct_9fa48("1720") ? e.clientX + rect.left : (stryCov_9fa48("1720"), e.clientX - rect.left),
          y: stryMutAct_9fa48("1721") ? e.clientY + rect.top : (stryCov_9fa48("1721"), e.clientY - rect.top),
          active: stryMutAct_9fa48("1722") ? false : (stryCov_9fa48("1722"), true)
        });
      }
    }, stryMutAct_9fa48("1723") ? ["Stryker was here"] : (stryCov_9fa48("1723"), []));
    const onLeave = useCallback(() => {
      if (stryMutAct_9fa48("1724")) {
        {}
      } else {
        stryCov_9fa48("1724");
        mouseRef.current.active = stryMutAct_9fa48("1725") ? true : (stryCov_9fa48("1725"), false);
      }
    }, stryMutAct_9fa48("1726") ? ["Stryker was here"] : (stryCov_9fa48("1726"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("1727")) {
        {}
      } else {
        stryCov_9fa48("1727");
        const canvas = canvasRef.current;
        if (stryMutAct_9fa48("1730") ? false : stryMutAct_9fa48("1729") ? true : stryMutAct_9fa48("1728") ? canvas : (stryCov_9fa48("1728", "1729", "1730"), !canvas)) return;
        const ctx = canvas.getContext(stryMutAct_9fa48("1731") ? "" : (stryCov_9fa48("1731"), "2d"), stryMutAct_9fa48("1732") ? {} : (stryCov_9fa48("1732"), {
          alpha: stryMutAct_9fa48("1733") ? false : (stryCov_9fa48("1733"), true)
        }));
        if (stryMutAct_9fa48("1736") ? false : stryMutAct_9fa48("1735") ? true : stryMutAct_9fa48("1734") ? ctx : (stryCov_9fa48("1734", "1735", "1736"), !ctx)) return;
        const mobile = stryMutAct_9fa48("1740") ? window.innerWidth >= 768 : stryMutAct_9fa48("1739") ? window.innerWidth <= 768 : stryMutAct_9fa48("1738") ? false : stryMutAct_9fa48("1737") ? true : (stryCov_9fa48("1737", "1738", "1739", "1740"), window.innerWidth < 768);
        const COUNT = mobile ? 55 : 110;
        const LINK_DIST = mobile ? 100 : 140;
        const MOUSE_R = mobile ? 90 : 180;
        const SPEED = 0.2;
        const MAX_STREAMS = mobile ? 5 : 12;
        let cw = 0,
          ch = 0;
        const resize = () => {
          if (stryMutAct_9fa48("1741")) {
            {}
          } else {
            stryCov_9fa48("1741");
            const dpr = stryMutAct_9fa48("1742") ? Math.max(window.devicePixelRatio, mobile ? 1.5 : 2) : (stryCov_9fa48("1742"), Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
            cw = window.innerWidth;
            ch = window.innerHeight;
            canvas.width = stryMutAct_9fa48("1743") ? cw / dpr : (stryCov_9fa48("1743"), cw * dpr);
            canvas.height = stryMutAct_9fa48("1744") ? ch / dpr : (stryCov_9fa48("1744"), ch * dpr);
            canvas.style.width = stryMutAct_9fa48("1745") ? `` : (stryCov_9fa48("1745"), `${cw}px`);
            canvas.style.height = stryMutAct_9fa48("1746") ? `` : (stryCov_9fa48("1746"), `${ch}px`);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
        };
        resize();

        // Particles with depth (z)
        const particles: Particle[] = Array.from(stryMutAct_9fa48("1747") ? {} : (stryCov_9fa48("1747"), {
          length: COUNT
        }), () => {
          if (stryMutAct_9fa48("1748")) {
            {}
          } else {
            stryCov_9fa48("1748");
            const z = Math.random(); // 0=far, 1=near
            return stryMutAct_9fa48("1749") ? {} : (stryCov_9fa48("1749"), {
              x: stryMutAct_9fa48("1750") ? Math.random() / cw : (stryCov_9fa48("1750"), Math.random() * cw),
              y: stryMutAct_9fa48("1751") ? Math.random() / ch : (stryCov_9fa48("1751"), Math.random() * ch),
              vx: stryMutAct_9fa48("1752") ? (Math.random() - 0.5) * SPEED / (0.5 + z * 0.5) : (stryCov_9fa48("1752"), (stryMutAct_9fa48("1753") ? (Math.random() - 0.5) / SPEED : (stryCov_9fa48("1753"), (stryMutAct_9fa48("1754") ? Math.random() + 0.5 : (stryCov_9fa48("1754"), Math.random() - 0.5)) * SPEED)) * (stryMutAct_9fa48("1755") ? 0.5 - z * 0.5 : (stryCov_9fa48("1755"), 0.5 + (stryMutAct_9fa48("1756") ? z / 0.5 : (stryCov_9fa48("1756"), z * 0.5))))),
              vy: stryMutAct_9fa48("1757") ? (Math.random() - 0.5) * SPEED / (0.5 + z * 0.5) : (stryCov_9fa48("1757"), (stryMutAct_9fa48("1758") ? (Math.random() - 0.5) / SPEED : (stryCov_9fa48("1758"), (stryMutAct_9fa48("1759") ? Math.random() + 0.5 : (stryCov_9fa48("1759"), Math.random() - 0.5)) * SPEED)) * (stryMutAct_9fa48("1760") ? 0.5 - z * 0.5 : (stryCov_9fa48("1760"), 0.5 + (stryMutAct_9fa48("1761") ? z / 0.5 : (stryCov_9fa48("1761"), z * 0.5))))),
              baseSize: stryMutAct_9fa48("1762") ? 0.6 - z * 2.2 : (stryCov_9fa48("1762"), 0.6 + (stryMutAct_9fa48("1763") ? z / 2.2 : (stryCov_9fa48("1763"), z * 2.2))),
              size: 1.5,
              z,
              hue: stryMutAct_9fa48("1764") ? 180 - Math.random() * 12 : (stryCov_9fa48("1764"), 180 + (stryMutAct_9fa48("1765") ? Math.random() / 12 : (stryCov_9fa48("1765"), Math.random() * 12))),
              // 180-192 range (cyan to teal)
              opacity: stryMutAct_9fa48("1766") ? 0.12 - z * 0.55 : (stryCov_9fa48("1766"), 0.12 + (stryMutAct_9fa48("1767") ? z / 0.55 : (stryCov_9fa48("1767"), z * 0.55))),
              pulse: stryMutAct_9fa48("1768") ? Math.random() * Math.PI / 2 : (stryCov_9fa48("1768"), (stryMutAct_9fa48("1769") ? Math.random() / Math.PI : (stryCov_9fa48("1769"), Math.random() * Math.PI)) * 2),
              pulseSpeed: stryMutAct_9fa48("1770") ? 0.006 - Math.random() * 0.018 : (stryCov_9fa48("1770"), 0.006 + (stryMutAct_9fa48("1771") ? Math.random() / 0.018 : (stryCov_9fa48("1771"), Math.random() * 0.018)))
            });
          }
        });
        const streams: DataStream[] = stryMutAct_9fa48("1772") ? ["Stryker was here"] : (stryCov_9fa48("1772"), []);
        const activeLinks: [number, number, number][] = stryMutAct_9fa48("1773") ? ["Stryker was here"] : (stryCov_9fa48("1773"), []);

        // Pulse wave
        let pulseR = 0,
          pulseA = 0,
          pulseT = 0;
        const PULSE_INT = 5;
        window.addEventListener(stryMutAct_9fa48("1774") ? "" : (stryCov_9fa48("1774"), "resize"), resize);
        window.addEventListener(stryMutAct_9fa48("1775") ? "" : (stryCov_9fa48("1775"), "mousemove"), onMove);
        window.addEventListener(stryMutAct_9fa48("1776") ? "" : (stryCov_9fa48("1776"), "mouseleave"), onLeave);
        const onTouch = (e: TouchEvent) => {
          if (stryMutAct_9fa48("1777")) {
            {}
          } else {
            stryCov_9fa48("1777");
            if (stryMutAct_9fa48("1780") ? false : stryMutAct_9fa48("1779") ? true : stryMutAct_9fa48("1778") ? e.touches.length : (stryCov_9fa48("1778", "1779", "1780"), !e.touches.length)) return;
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = stryMutAct_9fa48("1781") ? {} : (stryCov_9fa48("1781"), {
              x: stryMutAct_9fa48("1782") ? e.touches[0].clientX + rect.left : (stryCov_9fa48("1782"), e.touches[0].clientX - rect.left),
              y: stryMutAct_9fa48("1783") ? e.touches[0].clientY + rect.top : (stryCov_9fa48("1783"), e.touches[0].clientY - rect.top),
              active: stryMutAct_9fa48("1784") ? false : (stryCov_9fa48("1784"), true)
            });
          }
        };
        const onTouchEnd = () => {
          if (stryMutAct_9fa48("1785")) {
            {}
          } else {
            stryCov_9fa48("1785");
            mouseRef.current.active = stryMutAct_9fa48("1786") ? true : (stryCov_9fa48("1786"), false);
          }
        };
        if (stryMutAct_9fa48("1788") ? false : stryMutAct_9fa48("1787") ? true : (stryCov_9fa48("1787", "1788"), mobile)) {
          if (stryMutAct_9fa48("1789")) {
            {}
          } else {
            stryCov_9fa48("1789");
            window.addEventListener(stryMutAct_9fa48("1790") ? "" : (stryCov_9fa48("1790"), "touchmove"), onTouch, stryMutAct_9fa48("1791") ? {} : (stryCov_9fa48("1791"), {
              passive: stryMutAct_9fa48("1792") ? false : (stryCov_9fa48("1792"), true)
            }));
            window.addEventListener(stryMutAct_9fa48("1793") ? "" : (stryCov_9fa48("1793"), "touchend"), onTouchEnd);
          }
        }
        let lastTime = performance.now();
        const animate = (now: number) => {
          if (stryMutAct_9fa48("1794")) {
            {}
          } else {
            stryCov_9fa48("1794");
            frameRef.current = requestAnimationFrame(animate);
            if (stryMutAct_9fa48("1796") ? false : stryMutAct_9fa48("1795") ? true : (stryCov_9fa48("1795", "1796"), document.hidden)) return;
            const dt = stryMutAct_9fa48("1797") ? Math.max((now - lastTime) / 1000, 0.05) : (stryCov_9fa48("1797"), Math.min(stryMutAct_9fa48("1798") ? (now - lastTime) * 1000 : (stryCov_9fa48("1798"), (stryMutAct_9fa48("1799") ? now + lastTime : (stryCov_9fa48("1799"), now - lastTime)) / 1000), 0.05));
            lastTime = now;
            ctx.clearRect(0, 0, cw, ch);
            const mouse = mouseRef.current;

            // Pulse wave
            stryMutAct_9fa48("1800") ? pulseT -= dt : (stryCov_9fa48("1800"), pulseT += dt);
            if (stryMutAct_9fa48("1804") ? pulseT < PULSE_INT : stryMutAct_9fa48("1803") ? pulseT > PULSE_INT : stryMutAct_9fa48("1802") ? false : stryMutAct_9fa48("1801") ? true : (stryCov_9fa48("1801", "1802", "1803", "1804"), pulseT >= PULSE_INT)) {
              if (stryMutAct_9fa48("1805")) {
                {}
              } else {
                stryCov_9fa48("1805");
                pulseT = 0;
                pulseR = 0;
                pulseA = 0.4;
              }
            }
            if (stryMutAct_9fa48("1809") ? pulseA <= 0 : stryMutAct_9fa48("1808") ? pulseA >= 0 : stryMutAct_9fa48("1807") ? false : stryMutAct_9fa48("1806") ? true : (stryCov_9fa48("1806", "1807", "1808", "1809"), pulseA > 0)) {
              if (stryMutAct_9fa48("1810")) {
                {}
              } else {
                stryCov_9fa48("1810");
                stryMutAct_9fa48("1811") ? pulseR -= dt * (mobile ? 220 : 350) : (stryCov_9fa48("1811"), pulseR += stryMutAct_9fa48("1812") ? dt / (mobile ? 220 : 350) : (stryCov_9fa48("1812"), dt * (mobile ? 220 : 350)));
                stryMutAct_9fa48("1813") ? pulseA += dt * 0.07 : (stryCov_9fa48("1813"), pulseA -= stryMutAct_9fa48("1814") ? dt / 0.07 : (stryCov_9fa48("1814"), dt * 0.07));
              }
            }

            // Sort by z for depth rendering (far first)
            stryMutAct_9fa48("1815") ? particles : (stryCov_9fa48("1815"), particles.sort(stryMutAct_9fa48("1816") ? () => undefined : (stryCov_9fa48("1816"), (a, b) => stryMutAct_9fa48("1817") ? a.z + b.z : (stryCov_9fa48("1817"), a.z - b.z))));

            // Update particles
            for (const p of particles) {
              if (stryMutAct_9fa48("1818")) {
                {}
              } else {
                stryCov_9fa48("1818");
                stryMutAct_9fa48("1819") ? p.pulse -= p.pulseSpeed : (stryCov_9fa48("1819"), p.pulse += p.pulseSpeed);
                p.size = stryMutAct_9fa48("1820") ? p.baseSize - Math.sin(p.pulse) * 0.4 * p.z : (stryCov_9fa48("1820"), p.baseSize + (stryMutAct_9fa48("1821") ? Math.sin(p.pulse) * 0.4 / p.z : (stryCov_9fa48("1821"), (stryMutAct_9fa48("1822") ? Math.sin(p.pulse) / 0.4 : (stryCov_9fa48("1822"), Math.sin(p.pulse) * 0.4)) * p.z)));

                // Pulse wave interaction
                if (stryMutAct_9fa48("1826") ? pulseA <= 0 : stryMutAct_9fa48("1825") ? pulseA >= 0 : stryMutAct_9fa48("1824") ? false : stryMutAct_9fa48("1823") ? true : (stryCov_9fa48("1823", "1824", "1825", "1826"), pulseA > 0)) {
                  if (stryMutAct_9fa48("1827")) {
                    {}
                  } else {
                    stryCov_9fa48("1827");
                    const dc = Math.sqrt(stryMutAct_9fa48("1828") ? (p.x - cw * 0.5) ** 2 - (p.y - ch * 0.5) ** 2 : (stryCov_9fa48("1828"), (stryMutAct_9fa48("1829") ? p.x + cw * 0.5 : (stryCov_9fa48("1829"), p.x - (stryMutAct_9fa48("1830") ? cw / 0.5 : (stryCov_9fa48("1830"), cw * 0.5)))) ** 2 + (stryMutAct_9fa48("1831") ? p.y + ch * 0.5 : (stryCov_9fa48("1831"), p.y - (stryMutAct_9fa48("1832") ? ch / 0.5 : (stryCov_9fa48("1832"), ch * 0.5)))) ** 2));
                    const rd = Math.abs(stryMutAct_9fa48("1833") ? dc + pulseR : (stryCov_9fa48("1833"), dc - pulseR));
                    if (stryMutAct_9fa48("1837") ? rd >= 50 : stryMutAct_9fa48("1836") ? rd <= 50 : stryMutAct_9fa48("1835") ? false : stryMutAct_9fa48("1834") ? true : (stryCov_9fa48("1834", "1835", "1836", "1837"), rd < 50)) {
                      if (stryMutAct_9fa48("1838")) {
                        {}
                      } else {
                        stryCov_9fa48("1838");
                        const boost = stryMutAct_9fa48("1839") ? (1 - rd / 50) / pulseA : (stryCov_9fa48("1839"), (stryMutAct_9fa48("1840") ? 1 + rd / 50 : (stryCov_9fa48("1840"), 1 - (stryMutAct_9fa48("1841") ? rd * 50 : (stryCov_9fa48("1841"), rd / 50)))) * pulseA);
                        stryMutAct_9fa48("1842") ? p.size -= boost * 2 : (stryCov_9fa48("1842"), p.size += stryMutAct_9fa48("1843") ? boost / 2 : (stryCov_9fa48("1843"), boost * 2));
                        p.opacity = stryMutAct_9fa48("1844") ? Math.max(1, p.opacity + boost * 0.3) : (stryCov_9fa48("1844"), Math.min(1, stryMutAct_9fa48("1845") ? p.opacity - boost * 0.3 : (stryCov_9fa48("1845"), p.opacity + (stryMutAct_9fa48("1846") ? boost / 0.3 : (stryCov_9fa48("1846"), boost * 0.3)))));
                      }
                    }
                  }
                }

                // Mouse interaction (strength based on z depth)
                if (stryMutAct_9fa48("1848") ? false : stryMutAct_9fa48("1847") ? true : (stryCov_9fa48("1847", "1848"), mouse.active)) {
                  if (stryMutAct_9fa48("1849")) {
                    {}
                  } else {
                    stryCov_9fa48("1849");
                    const dx = stryMutAct_9fa48("1850") ? p.x + mouse.x : (stryCov_9fa48("1850"), p.x - mouse.x),
                      dy = stryMutAct_9fa48("1851") ? p.y + mouse.y : (stryCov_9fa48("1851"), p.y - mouse.y);
                    const dist = Math.sqrt(stryMutAct_9fa48("1852") ? dx * dx - dy * dy : (stryCov_9fa48("1852"), (stryMutAct_9fa48("1853") ? dx / dx : (stryCov_9fa48("1853"), dx * dx)) + (stryMutAct_9fa48("1854") ? dy / dy : (stryCov_9fa48("1854"), dy * dy))));
                    if (stryMutAct_9fa48("1857") ? dist < MOUSE_R || dist > 0 : stryMutAct_9fa48("1856") ? false : stryMutAct_9fa48("1855") ? true : (stryCov_9fa48("1855", "1856", "1857"), (stryMutAct_9fa48("1860") ? dist >= MOUSE_R : stryMutAct_9fa48("1859") ? dist <= MOUSE_R : stryMutAct_9fa48("1858") ? true : (stryCov_9fa48("1858", "1859", "1860"), dist < MOUSE_R)) && (stryMutAct_9fa48("1863") ? dist <= 0 : stryMutAct_9fa48("1862") ? dist >= 0 : stryMutAct_9fa48("1861") ? true : (stryCov_9fa48("1861", "1862", "1863"), dist > 0)))) {
                      if (stryMutAct_9fa48("1864")) {
                        {}
                      } else {
                        stryCov_9fa48("1864");
                        const force = stryMutAct_9fa48("1865") ? (MOUSE_R - dist) / MOUSE_R / (0.5 + p.z * 0.5) : (stryCov_9fa48("1865"), (stryMutAct_9fa48("1866") ? (MOUSE_R - dist) * MOUSE_R : (stryCov_9fa48("1866"), (stryMutAct_9fa48("1867") ? MOUSE_R + dist : (stryCov_9fa48("1867"), MOUSE_R - dist)) / MOUSE_R)) * (stryMutAct_9fa48("1868") ? 0.5 - p.z * 0.5 : (stryCov_9fa48("1868"), 0.5 + (stryMutAct_9fa48("1869") ? p.z / 0.5 : (stryCov_9fa48("1869"), p.z * 0.5)))));
                        stryMutAct_9fa48("1870") ? p.vx -= dx / dist * force * 0.1 : (stryCov_9fa48("1870"), p.vx += stryMutAct_9fa48("1871") ? dx / dist * force / 0.1 : (stryCov_9fa48("1871"), (stryMutAct_9fa48("1872") ? dx / dist / force : (stryCov_9fa48("1872"), (stryMutAct_9fa48("1873") ? dx * dist : (stryCov_9fa48("1873"), dx / dist)) * force)) * 0.1));
                        stryMutAct_9fa48("1874") ? p.vy -= dy / dist * force * 0.1 : (stryCov_9fa48("1874"), p.vy += stryMutAct_9fa48("1875") ? dy / dist * force / 0.1 : (stryCov_9fa48("1875"), (stryMutAct_9fa48("1876") ? dy / dist / force : (stryCov_9fa48("1876"), (stryMutAct_9fa48("1877") ? dy * dist : (stryCov_9fa48("1877"), dy / dist)) * force)) * 0.1));
                      }
                    }
                  }
                }
                stryMutAct_9fa48("1878") ? p.vx /= 0.99 : (stryCov_9fa48("1878"), p.vx *= 0.99);
                stryMutAct_9fa48("1879") ? p.vy /= 0.99 : (stryCov_9fa48("1879"), p.vy *= 0.99);
                const spd = Math.sqrt(stryMutAct_9fa48("1880") ? p.vx * p.vx - p.vy * p.vy : (stryCov_9fa48("1880"), (stryMutAct_9fa48("1881") ? p.vx / p.vx : (stryCov_9fa48("1881"), p.vx * p.vx)) + (stryMutAct_9fa48("1882") ? p.vy / p.vy : (stryCov_9fa48("1882"), p.vy * p.vy))));
                if (stryMutAct_9fa48("1886") ? spd >= SPEED * 0.2 : stryMutAct_9fa48("1885") ? spd <= SPEED * 0.2 : stryMutAct_9fa48("1884") ? false : stryMutAct_9fa48("1883") ? true : (stryCov_9fa48("1883", "1884", "1885", "1886"), spd < (stryMutAct_9fa48("1887") ? SPEED / 0.2 : (stryCov_9fa48("1887"), SPEED * 0.2)))) {
                  if (stryMutAct_9fa48("1888")) {
                    {}
                  } else {
                    stryCov_9fa48("1888");
                    stryMutAct_9fa48("1889") ? p.vx -= (Math.random() - 0.5) * 0.03 : (stryCov_9fa48("1889"), p.vx += stryMutAct_9fa48("1890") ? (Math.random() - 0.5) / 0.03 : (stryCov_9fa48("1890"), (stryMutAct_9fa48("1891") ? Math.random() + 0.5 : (stryCov_9fa48("1891"), Math.random() - 0.5)) * 0.03));
                    stryMutAct_9fa48("1892") ? p.vy -= (Math.random() - 0.5) * 0.03 : (stryCov_9fa48("1892"), p.vy += stryMutAct_9fa48("1893") ? (Math.random() - 0.5) / 0.03 : (stryCov_9fa48("1893"), (stryMutAct_9fa48("1894") ? Math.random() + 0.5 : (stryCov_9fa48("1894"), Math.random() - 0.5)) * 0.03));
                  }
                }
                if (stryMutAct_9fa48("1898") ? spd <= SPEED * 3 : stryMutAct_9fa48("1897") ? spd >= SPEED * 3 : stryMutAct_9fa48("1896") ? false : stryMutAct_9fa48("1895") ? true : (stryCov_9fa48("1895", "1896", "1897", "1898"), spd > (stryMutAct_9fa48("1899") ? SPEED / 3 : (stryCov_9fa48("1899"), SPEED * 3)))) {
                  if (stryMutAct_9fa48("1900")) {
                    {}
                  } else {
                    stryCov_9fa48("1900");
                    stryMutAct_9fa48("1901") ? p.vx /= 0.94 : (stryCov_9fa48("1901"), p.vx *= 0.94);
                    stryMutAct_9fa48("1902") ? p.vy /= 0.94 : (stryCov_9fa48("1902"), p.vy *= 0.94);
                  }
                }
                stryMutAct_9fa48("1903") ? p.x -= p.vx : (stryCov_9fa48("1903"), p.x += p.vx);
                stryMutAct_9fa48("1904") ? p.y -= p.vy : (stryCov_9fa48("1904"), p.y += p.vy);
                if (stryMutAct_9fa48("1908") ? p.x >= -40 : stryMutAct_9fa48("1907") ? p.x <= -40 : stryMutAct_9fa48("1906") ? false : stryMutAct_9fa48("1905") ? true : (stryCov_9fa48("1905", "1906", "1907", "1908"), p.x < (stryMutAct_9fa48("1909") ? +40 : (stryCov_9fa48("1909"), -40)))) p.x = stryMutAct_9fa48("1910") ? cw - 40 : (stryCov_9fa48("1910"), cw + 40);
                if (stryMutAct_9fa48("1914") ? p.x <= cw + 40 : stryMutAct_9fa48("1913") ? p.x >= cw + 40 : stryMutAct_9fa48("1912") ? false : stryMutAct_9fa48("1911") ? true : (stryCov_9fa48("1911", "1912", "1913", "1914"), p.x > (stryMutAct_9fa48("1915") ? cw - 40 : (stryCov_9fa48("1915"), cw + 40)))) p.x = stryMutAct_9fa48("1916") ? +40 : (stryCov_9fa48("1916"), -40);
                if (stryMutAct_9fa48("1920") ? p.y >= -40 : stryMutAct_9fa48("1919") ? p.y <= -40 : stryMutAct_9fa48("1918") ? false : stryMutAct_9fa48("1917") ? true : (stryCov_9fa48("1917", "1918", "1919", "1920"), p.y < (stryMutAct_9fa48("1921") ? +40 : (stryCov_9fa48("1921"), -40)))) p.y = stryMutAct_9fa48("1922") ? ch - 40 : (stryCov_9fa48("1922"), ch + 40);
                if (stryMutAct_9fa48("1926") ? p.y <= ch + 40 : stryMutAct_9fa48("1925") ? p.y >= ch + 40 : stryMutAct_9fa48("1924") ? false : stryMutAct_9fa48("1923") ? true : (stryCov_9fa48("1923", "1924", "1925", "1926"), p.y > (stryMutAct_9fa48("1927") ? ch - 40 : (stryCov_9fa48("1927"), ch + 40)))) p.y = stryMutAct_9fa48("1928") ? +40 : (stryCov_9fa48("1928"), -40);

                // Restore opacity
                stryMutAct_9fa48("1929") ? p.opacity -= (0.12 + p.z * 0.55 - p.opacity) * 0.02 : (stryCov_9fa48("1929"), p.opacity += stryMutAct_9fa48("1930") ? (0.12 + p.z * 0.55 - p.opacity) / 0.02 : (stryCov_9fa48("1930"), (stryMutAct_9fa48("1931") ? 0.12 + p.z * 0.55 + p.opacity : (stryCov_9fa48("1931"), (stryMutAct_9fa48("1932") ? 0.12 - p.z * 0.55 : (stryCov_9fa48("1932"), 0.12 + (stryMutAct_9fa48("1933") ? p.z / 0.55 : (stryCov_9fa48("1933"), p.z * 0.55)))) - p.opacity)) * 0.02));
              }
            }

            // Find active connections (only between particles of similar depth)
            activeLinks.length = 0;
            for (let i = 0; stryMutAct_9fa48("1936") ? i >= particles.length : stryMutAct_9fa48("1935") ? i <= particles.length : stryMutAct_9fa48("1934") ? false : (stryCov_9fa48("1934", "1935", "1936"), i < particles.length); stryMutAct_9fa48("1937") ? i-- : (stryCov_9fa48("1937"), i++)) {
              if (stryMutAct_9fa48("1938")) {
                {}
              } else {
                stryCov_9fa48("1938");
                for (let j = stryMutAct_9fa48("1939") ? i - 1 : (stryCov_9fa48("1939"), i + 1); stryMutAct_9fa48("1942") ? j >= particles.length : stryMutAct_9fa48("1941") ? j <= particles.length : stryMutAct_9fa48("1940") ? false : (stryCov_9fa48("1940", "1941", "1942"), j < particles.length); stryMutAct_9fa48("1943") ? j-- : (stryCov_9fa48("1943"), j++)) {
                  if (stryMutAct_9fa48("1944")) {
                    {}
                  } else {
                    stryCov_9fa48("1944");
                    const a = particles[i],
                      b = particles[j];
                    const zDiff = Math.abs(stryMutAct_9fa48("1945") ? a.z + b.z : (stryCov_9fa48("1945"), a.z - b.z));
                    if (stryMutAct_9fa48("1949") ? zDiff <= 0.5 : stryMutAct_9fa48("1948") ? zDiff >= 0.5 : stryMutAct_9fa48("1947") ? false : stryMutAct_9fa48("1946") ? true : (stryCov_9fa48("1946", "1947", "1948", "1949"), zDiff > 0.5)) continue; // don't connect far/near particles
                    const dx = stryMutAct_9fa48("1950") ? a.x + b.x : (stryCov_9fa48("1950"), a.x - b.x),
                      dy = stryMutAct_9fa48("1951") ? a.y + b.y : (stryCov_9fa48("1951"), a.y - b.y);
                    const dist = Math.sqrt(stryMutAct_9fa48("1952") ? dx * dx - dy * dy : (stryCov_9fa48("1952"), (stryMutAct_9fa48("1953") ? dx / dx : (stryCov_9fa48("1953"), dx * dx)) + (stryMutAct_9fa48("1954") ? dy / dy : (stryCov_9fa48("1954"), dy * dy))));
                    const adjustedDist = stryMutAct_9fa48("1955") ? LINK_DIST / (0.6 + (a.z + b.z) * 0.25) : (stryCov_9fa48("1955"), LINK_DIST * (stryMutAct_9fa48("1956") ? 0.6 - (a.z + b.z) * 0.25 : (stryCov_9fa48("1956"), 0.6 + (stryMutAct_9fa48("1957") ? (a.z + b.z) / 0.25 : (stryCov_9fa48("1957"), (stryMutAct_9fa48("1958") ? a.z - b.z : (stryCov_9fa48("1958"), a.z + b.z)) * 0.25)))));
                    if (stryMutAct_9fa48("1962") ? dist >= adjustedDist : stryMutAct_9fa48("1961") ? dist <= adjustedDist : stryMutAct_9fa48("1960") ? false : stryMutAct_9fa48("1959") ? true : (stryCov_9fa48("1959", "1960", "1961", "1962"), dist < adjustedDist)) {
                      if (stryMutAct_9fa48("1963")) {
                        {}
                      } else {
                        stryCov_9fa48("1963");
                        activeLinks.push(stryMutAct_9fa48("1964") ? [] : (stryCov_9fa48("1964"), [i, j, stryMutAct_9fa48("1965") ? 1 + dist / adjustedDist : (stryCov_9fa48("1965"), 1 - (stryMutAct_9fa48("1966") ? dist * adjustedDist : (stryCov_9fa48("1966"), dist / adjustedDist)))]));
                      }
                    }
                  }
                }
              }
            }

            // Spawn data streams
            if (stryMutAct_9fa48("1969") ? streams.length < MAX_STREAMS && activeLinks.length > 0 || Math.random() < 0.025 : stryMutAct_9fa48("1968") ? false : stryMutAct_9fa48("1967") ? true : (stryCov_9fa48("1967", "1968", "1969"), (stryMutAct_9fa48("1971") ? streams.length < MAX_STREAMS || activeLinks.length > 0 : stryMutAct_9fa48("1970") ? true : (stryCov_9fa48("1970", "1971"), (stryMutAct_9fa48("1974") ? streams.length >= MAX_STREAMS : stryMutAct_9fa48("1973") ? streams.length <= MAX_STREAMS : stryMutAct_9fa48("1972") ? true : (stryCov_9fa48("1972", "1973", "1974"), streams.length < MAX_STREAMS)) && (stryMutAct_9fa48("1977") ? activeLinks.length <= 0 : stryMutAct_9fa48("1976") ? activeLinks.length >= 0 : stryMutAct_9fa48("1975") ? true : (stryCov_9fa48("1975", "1976", "1977"), activeLinks.length > 0)))) && (stryMutAct_9fa48("1980") ? Math.random() >= 0.025 : stryMutAct_9fa48("1979") ? Math.random() <= 0.025 : stryMutAct_9fa48("1978") ? true : (stryCov_9fa48("1978", "1979", "1980"), Math.random() < 0.025)))) {
              if (stryMutAct_9fa48("1981")) {
                {}
              } else {
                stryCov_9fa48("1981");
                const [fi, fj] = activeLinks[Math.floor(stryMutAct_9fa48("1982") ? Math.random() / activeLinks.length : (stryCov_9fa48("1982"), Math.random() * activeLinks.length))];
                streams.push(stryMutAct_9fa48("1983") ? {} : (stryCov_9fa48("1983"), {
                  fromIdx: fi,
                  toIdx: fj,
                  progress: 0,
                  speed: stryMutAct_9fa48("1984") ? 0.5 - Math.random() * 1 : (stryCov_9fa48("1984"), 0.5 + (stryMutAct_9fa48("1985") ? Math.random() / 1 : (stryCov_9fa48("1985"), Math.random() * 1)))
                }));
              }
            }

            // Draw pulse wave
            if (stryMutAct_9fa48("1989") ? pulseA <= 0.01 : stryMutAct_9fa48("1988") ? pulseA >= 0.01 : stryMutAct_9fa48("1987") ? false : stryMutAct_9fa48("1986") ? true : (stryCov_9fa48("1986", "1987", "1988", "1989"), pulseA > 0.01)) {
              if (stryMutAct_9fa48("1990")) {
                {}
              } else {
                stryCov_9fa48("1990");
                ctx.beginPath();
                ctx.arc(stryMutAct_9fa48("1991") ? cw / 0.5 : (stryCov_9fa48("1991"), cw * 0.5), stryMutAct_9fa48("1992") ? ch / 0.5 : (stryCov_9fa48("1992"), ch * 0.5), pulseR, 0, stryMutAct_9fa48("1993") ? Math.PI / 2 : (stryCov_9fa48("1993"), Math.PI * 2));
                ctx.strokeStyle = stryMutAct_9fa48("1994") ? `` : (stryCov_9fa48("1994"), `rgba(6, 214, 224, ${stryMutAct_9fa48("1995") ? pulseA / 0.25 : (stryCov_9fa48("1995"), pulseA * 0.25)})`);
                ctx.lineWidth = 1.5;
                ctx.stroke();
                const rg = ctx.createRadialGradient(stryMutAct_9fa48("1996") ? cw / 0.5 : (stryCov_9fa48("1996"), cw * 0.5), stryMutAct_9fa48("1997") ? ch / 0.5 : (stryCov_9fa48("1997"), ch * 0.5), stryMutAct_9fa48("1998") ? Math.min(0, pulseR - 30) : (stryCov_9fa48("1998"), Math.max(0, stryMutAct_9fa48("1999") ? pulseR + 30 : (stryCov_9fa48("1999"), pulseR - 30))), stryMutAct_9fa48("2000") ? cw / 0.5 : (stryCov_9fa48("2000"), cw * 0.5), stryMutAct_9fa48("2001") ? ch / 0.5 : (stryCov_9fa48("2001"), ch * 0.5), stryMutAct_9fa48("2002") ? pulseR - 30 : (stryCov_9fa48("2002"), pulseR + 30));
                rg.addColorStop(0, stryMutAct_9fa48("2003") ? "" : (stryCov_9fa48("2003"), "rgba(6, 214, 224, 0)"));
                rg.addColorStop(0.5, stryMutAct_9fa48("2004") ? `` : (stryCov_9fa48("2004"), `rgba(6, 214, 224, ${stryMutAct_9fa48("2005") ? pulseA / 0.06 : (stryCov_9fa48("2005"), pulseA * 0.06)})`));
                rg.addColorStop(1, stryMutAct_9fa48("2006") ? "" : (stryCov_9fa48("2006"), "rgba(6, 214, 224, 0)"));
                ctx.fillStyle = rg;
                ctx.fillRect(0, 0, cw, ch);
              }
            }

            // Draw connections -- color/width based on average z-depth
            for (const [i, j, rawOp] of activeLinks) {
              if (stryMutAct_9fa48("2007")) {
                {}
              } else {
                stryCov_9fa48("2007");
                const a = particles[i],
                  b = particles[j];
                const avgZ = stryMutAct_9fa48("2008") ? (a.z + b.z) * 2 : (stryCov_9fa48("2008"), (stryMutAct_9fa48("2009") ? a.z - b.z : (stryCov_9fa48("2009"), a.z + b.z)) / 2);
                let op = stryMutAct_9fa48("2010") ? rawOp / (0.08 + avgZ * 0.22) : (stryCov_9fa48("2010"), rawOp * (stryMutAct_9fa48("2011") ? 0.08 - avgZ * 0.22 : (stryCov_9fa48("2011"), 0.08 + (stryMutAct_9fa48("2012") ? avgZ / 0.22 : (stryCov_9fa48("2012"), avgZ * 0.22)))));

                // Mouse proximity boost
                if (stryMutAct_9fa48("2014") ? false : stryMutAct_9fa48("2013") ? true : (stryCov_9fa48("2013", "2014"), mouse.active)) {
                  if (stryMutAct_9fa48("2015")) {
                    {}
                  } else {
                    stryCov_9fa48("2015");
                    const mx = stryMutAct_9fa48("2016") ? (a.x + b.x) / 2 + mouse.x : (stryCov_9fa48("2016"), (stryMutAct_9fa48("2017") ? (a.x + b.x) * 2 : (stryCov_9fa48("2017"), (stryMutAct_9fa48("2018") ? a.x - b.x : (stryCov_9fa48("2018"), a.x + b.x)) / 2)) - mouse.x),
                      my = stryMutAct_9fa48("2019") ? (a.y + b.y) / 2 + mouse.y : (stryCov_9fa48("2019"), (stryMutAct_9fa48("2020") ? (a.y + b.y) * 2 : (stryCov_9fa48("2020"), (stryMutAct_9fa48("2021") ? a.y - b.y : (stryCov_9fa48("2021"), a.y + b.y)) / 2)) - mouse.y);
                    const md = Math.sqrt(stryMutAct_9fa48("2022") ? mx * mx - my * my : (stryCov_9fa48("2022"), (stryMutAct_9fa48("2023") ? mx / mx : (stryCov_9fa48("2023"), mx * mx)) + (stryMutAct_9fa48("2024") ? my / my : (stryCov_9fa48("2024"), my * my))));
                    if (stryMutAct_9fa48("2028") ? md >= MOUSE_R * 1.3 : stryMutAct_9fa48("2027") ? md <= MOUSE_R * 1.3 : stryMutAct_9fa48("2026") ? false : stryMutAct_9fa48("2025") ? true : (stryCov_9fa48("2025", "2026", "2027", "2028"), md < (stryMutAct_9fa48("2029") ? MOUSE_R / 1.3 : (stryCov_9fa48("2029"), MOUSE_R * 1.3)))) stryMutAct_9fa48("2030") ? op -= (1 - md / (MOUSE_R * 1.3)) * 0.3 * avgZ : (stryCov_9fa48("2030"), op += stryMutAct_9fa48("2031") ? (1 - md / (MOUSE_R * 1.3)) * 0.3 / avgZ : (stryCov_9fa48("2031"), (stryMutAct_9fa48("2032") ? (1 - md / (MOUSE_R * 1.3)) / 0.3 : (stryCov_9fa48("2032"), (stryMutAct_9fa48("2033") ? 1 + md / (MOUSE_R * 1.3) : (stryCov_9fa48("2033"), 1 - (stryMutAct_9fa48("2034") ? md * (MOUSE_R * 1.3) : (stryCov_9fa48("2034"), md / (stryMutAct_9fa48("2035") ? MOUSE_R / 1.3 : (stryCov_9fa48("2035"), MOUSE_R * 1.3)))))) * 0.3)) * avgZ));
                  }
                }
                const lum = Math.round(stryMutAct_9fa48("2036") ? 55 - avgZ * 30 : (stryCov_9fa48("2036"), 55 + (stryMutAct_9fa48("2037") ? avgZ / 30 : (stryCov_9fa48("2037"), avgZ * 30)))); // 55-85% lightness
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = stryMutAct_9fa48("2038") ? `` : (stryCov_9fa48("2038"), `hsla(${Math.round(stryMutAct_9fa48("2039") ? (a.hue + b.hue) * 2 : (stryCov_9fa48("2039"), (stryMutAct_9fa48("2040") ? a.hue - b.hue : (stryCov_9fa48("2040"), a.hue + b.hue)) / 2))}, 90%, ${lum}%, ${stryMutAct_9fa48("2041") ? Math.max(op, 0.5) : (stryCov_9fa48("2041"), Math.min(op, 0.5))})`);
                ctx.lineWidth = stryMutAct_9fa48("2042") ? 0.4 - avgZ * 0.6 : (stryCov_9fa48("2042"), 0.4 + (stryMutAct_9fa48("2043") ? avgZ / 0.6 : (stryCov_9fa48("2043"), avgZ * 0.6)));
                ctx.stroke();
              }
            }

            // Draw data streams
            for (let s = stryMutAct_9fa48("2044") ? streams.length + 1 : (stryCov_9fa48("2044"), streams.length - 1); stryMutAct_9fa48("2047") ? s < 0 : stryMutAct_9fa48("2046") ? s > 0 : stryMutAct_9fa48("2045") ? false : (stryCov_9fa48("2045", "2046", "2047"), s >= 0); stryMutAct_9fa48("2048") ? s++ : (stryCov_9fa48("2048"), s--)) {
              if (stryMutAct_9fa48("2049")) {
                {}
              } else {
                stryCov_9fa48("2049");
                const st = streams[s];
                stryMutAct_9fa48("2050") ? st.progress -= st.speed * dt : (stryCov_9fa48("2050"), st.progress += stryMutAct_9fa48("2051") ? st.speed / dt : (stryCov_9fa48("2051"), st.speed * dt));
                if (stryMutAct_9fa48("2055") ? st.progress < 1 : stryMutAct_9fa48("2054") ? st.progress > 1 : stryMutAct_9fa48("2053") ? false : stryMutAct_9fa48("2052") ? true : (stryCov_9fa48("2052", "2053", "2054", "2055"), st.progress >= 1)) {
                  if (stryMutAct_9fa48("2056")) {
                    {}
                  } else {
                    stryCov_9fa48("2056");
                    streams.splice(s, 1);
                    continue;
                  }
                }
                const a = particles[st.fromIdx],
                  b = particles[st.toIdx];
                const sx = stryMutAct_9fa48("2057") ? a.x - (b.x - a.x) * st.progress : (stryCov_9fa48("2057"), a.x + (stryMutAct_9fa48("2058") ? (b.x - a.x) / st.progress : (stryCov_9fa48("2058"), (stryMutAct_9fa48("2059") ? b.x + a.x : (stryCov_9fa48("2059"), b.x - a.x)) * st.progress)));
                const sy = stryMutAct_9fa48("2060") ? a.y - (b.y - a.y) * st.progress : (stryCov_9fa48("2060"), a.y + (stryMutAct_9fa48("2061") ? (b.y - a.y) / st.progress : (stryCov_9fa48("2061"), (stryMutAct_9fa48("2062") ? b.y + a.y : (stryCov_9fa48("2062"), b.y - a.y)) * st.progress)));
                const avgZ = stryMutAct_9fa48("2063") ? (a.z + b.z) * 2 : (stryCov_9fa48("2063"), (stryMutAct_9fa48("2064") ? a.z - b.z : (stryCov_9fa48("2064"), a.z + b.z)) / 2);
                const fadeIn = stryMutAct_9fa48("2065") ? Math.max(st.progress * 5, 1) : (stryCov_9fa48("2065"), Math.min(stryMutAct_9fa48("2066") ? st.progress / 5 : (stryCov_9fa48("2066"), st.progress * 5), 1));
                const fadeOut = stryMutAct_9fa48("2067") ? Math.max((1 - st.progress) * 5, 1) : (stryCov_9fa48("2067"), Math.min(stryMutAct_9fa48("2068") ? (1 - st.progress) / 5 : (stryCov_9fa48("2068"), (stryMutAct_9fa48("2069") ? 1 + st.progress : (stryCov_9fa48("2069"), 1 - st.progress)) * 5), 1));
                const alpha = stryMutAct_9fa48("2070") ? fadeIn / fadeOut : (stryCov_9fa48("2070"), fadeIn * fadeOut);

                // Bright glow
                const r = stryMutAct_9fa48("2071") ? 2 - avgZ * 1.5 : (stryCov_9fa48("2071"), 2 + (stryMutAct_9fa48("2072") ? avgZ / 1.5 : (stryCov_9fa48("2072"), avgZ * 1.5)));
                const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, stryMutAct_9fa48("2073") ? r / 5 : (stryCov_9fa48("2073"), r * 5));
                glow.addColorStop(0, stryMutAct_9fa48("2074") ? `` : (stryCov_9fa48("2074"), `rgba(6, 214, 224, ${stryMutAct_9fa48("2075") ? alpha / 0.35 : (stryCov_9fa48("2075"), alpha * 0.35)})`));
                glow.addColorStop(0.4, stryMutAct_9fa48("2076") ? `` : (stryCov_9fa48("2076"), `rgba(6, 214, 224, ${stryMutAct_9fa48("2077") ? alpha / 0.08 : (stryCov_9fa48("2077"), alpha * 0.08)})`));
                glow.addColorStop(1, stryMutAct_9fa48("2078") ? "" : (stryCov_9fa48("2078"), "rgba(6, 214, 224, 0)"));
                ctx.fillStyle = glow;
                ctx.fillRect(stryMutAct_9fa48("2079") ? sx + r * 5 : (stryCov_9fa48("2079"), sx - (stryMutAct_9fa48("2080") ? r / 5 : (stryCov_9fa48("2080"), r * 5))), stryMutAct_9fa48("2081") ? sy + r * 5 : (stryCov_9fa48("2081"), sy - (stryMutAct_9fa48("2082") ? r / 5 : (stryCov_9fa48("2082"), r * 5))), stryMutAct_9fa48("2083") ? r / 10 : (stryCov_9fa48("2083"), r * 10), stryMutAct_9fa48("2084") ? r / 10 : (stryCov_9fa48("2084"), r * 10));

                // White-cyan core
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, stryMutAct_9fa48("2085") ? Math.PI / 2 : (stryCov_9fa48("2085"), Math.PI * 2));
                ctx.fillStyle = stryMutAct_9fa48("2086") ? `` : (stryCov_9fa48("2086"), `rgba(200, 255, 255, ${stryMutAct_9fa48("2087") ? alpha / 0.85 : (stryCov_9fa48("2087"), alpha * 0.85)})`);
                ctx.fill();

                // Trail
                for (let t = 1; stryMutAct_9fa48("2090") ? t > 4 : stryMutAct_9fa48("2089") ? t < 4 : stryMutAct_9fa48("2088") ? false : (stryCov_9fa48("2088", "2089", "2090"), t <= 4); stryMutAct_9fa48("2091") ? t-- : (stryCov_9fa48("2091"), t++)) {
                  if (stryMutAct_9fa48("2092")) {
                    {}
                  } else {
                    stryCov_9fa48("2092");
                    const tp = stryMutAct_9fa48("2093") ? st.progress + t * 0.018 * st.speed : (stryCov_9fa48("2093"), st.progress - (stryMutAct_9fa48("2094") ? t * 0.018 / st.speed : (stryCov_9fa48("2094"), (stryMutAct_9fa48("2095") ? t / 0.018 : (stryCov_9fa48("2095"), t * 0.018)) * st.speed)));
                    if (stryMutAct_9fa48("2099") ? tp >= 0 : stryMutAct_9fa48("2098") ? tp <= 0 : stryMutAct_9fa48("2097") ? false : stryMutAct_9fa48("2096") ? true : (stryCov_9fa48("2096", "2097", "2098", "2099"), tp < 0)) break;
                    const tx = stryMutAct_9fa48("2100") ? a.x - (b.x - a.x) * tp : (stryCov_9fa48("2100"), a.x + (stryMutAct_9fa48("2101") ? (b.x - a.x) / tp : (stryCov_9fa48("2101"), (stryMutAct_9fa48("2102") ? b.x + a.x : (stryCov_9fa48("2102"), b.x - a.x)) * tp)));
                    const ty = stryMutAct_9fa48("2103") ? a.y - (b.y - a.y) * tp : (stryCov_9fa48("2103"), a.y + (stryMutAct_9fa48("2104") ? (b.y - a.y) / tp : (stryCov_9fa48("2104"), (stryMutAct_9fa48("2105") ? b.y + a.y : (stryCov_9fa48("2105"), b.y - a.y)) * tp)));
                    ctx.beginPath();
                    ctx.arc(tx, ty, stryMutAct_9fa48("2106") ? r / (1 - t / 5) : (stryCov_9fa48("2106"), r * (stryMutAct_9fa48("2107") ? 1 + t / 5 : (stryCov_9fa48("2107"), 1 - (stryMutAct_9fa48("2108") ? t * 5 : (stryCov_9fa48("2108"), t / 5))))), 0, stryMutAct_9fa48("2109") ? Math.PI / 2 : (stryCov_9fa48("2109"), Math.PI * 2));
                    ctx.fillStyle = stryMutAct_9fa48("2110") ? `` : (stryCov_9fa48("2110"), `rgba(6, 214, 224, ${stryMutAct_9fa48("2111") ? alpha * (1 - t / 5) / 0.35 : (stryCov_9fa48("2111"), (stryMutAct_9fa48("2112") ? alpha / (1 - t / 5) : (stryCov_9fa48("2112"), alpha * (stryMutAct_9fa48("2113") ? 1 + t / 5 : (stryCov_9fa48("2113"), 1 - (stryMutAct_9fa48("2114") ? t * 5 : (stryCov_9fa48("2114"), t / 5)))))) * 0.35)})`);
                    ctx.fill();
                  }
                }
              }
            }

            // Draw particles -- layered by depth
            for (const p of particles) {
              if (stryMutAct_9fa48("2115")) {
                {}
              } else {
                stryCov_9fa48("2115");
                let extraGlow = 0;
                if (stryMutAct_9fa48("2117") ? false : stryMutAct_9fa48("2116") ? true : (stryCov_9fa48("2116", "2117"), mouse.active)) {
                  if (stryMutAct_9fa48("2118")) {
                    {}
                  } else {
                    stryCov_9fa48("2118");
                    const dx = stryMutAct_9fa48("2119") ? p.x + mouse.x : (stryCov_9fa48("2119"), p.x - mouse.x),
                      dy = stryMutAct_9fa48("2120") ? p.y + mouse.y : (stryCov_9fa48("2120"), p.y - mouse.y);
                    const d = Math.sqrt(stryMutAct_9fa48("2121") ? dx * dx - dy * dy : (stryCov_9fa48("2121"), (stryMutAct_9fa48("2122") ? dx / dx : (stryCov_9fa48("2122"), dx * dx)) + (stryMutAct_9fa48("2123") ? dy / dy : (stryCov_9fa48("2123"), dy * dy))));
                    if (stryMutAct_9fa48("2127") ? d >= MOUSE_R : stryMutAct_9fa48("2126") ? d <= MOUSE_R : stryMutAct_9fa48("2125") ? false : stryMutAct_9fa48("2124") ? true : (stryCov_9fa48("2124", "2125", "2126", "2127"), d < MOUSE_R)) extraGlow = stryMutAct_9fa48("2128") ? (1 - d / MOUSE_R) * 0.5 / p.z : (stryCov_9fa48("2128"), (stryMutAct_9fa48("2129") ? (1 - d / MOUSE_R) / 0.5 : (stryCov_9fa48("2129"), (stryMutAct_9fa48("2130") ? 1 + d / MOUSE_R : (stryCov_9fa48("2130"), 1 - (stryMutAct_9fa48("2131") ? d * MOUSE_R : (stryCov_9fa48("2131"), d / MOUSE_R)))) * 0.5)) * p.z);
                  }
                }
                const totalOp = stryMutAct_9fa48("2132") ? Math.max(1, p.opacity + extraGlow) : (stryCov_9fa48("2132"), Math.min(1, stryMutAct_9fa48("2133") ? p.opacity - extraGlow : (stryCov_9fa48("2133"), p.opacity + extraGlow)));
                const lum = stryMutAct_9fa48("2134") ? 55 - p.z * 35 : (stryCov_9fa48("2134"), 55 + (stryMutAct_9fa48("2135") ? p.z / 35 : (stryCov_9fa48("2135"), p.z * 35))); // far=55% near=90%
                const sat = stryMutAct_9fa48("2136") ? 85 - p.z * 10 : (stryCov_9fa48("2136"), 85 + (stryMutAct_9fa48("2137") ? p.z / 10 : (stryCov_9fa48("2137"), p.z * 10)));

                // Bloom halo (only for near particles or mouse-boosted)
                if (stryMutAct_9fa48("2140") ? p.z > 0.4 && extraGlow > 0.1 : stryMutAct_9fa48("2139") ? false : stryMutAct_9fa48("2138") ? true : (stryCov_9fa48("2138", "2139", "2140"), (stryMutAct_9fa48("2143") ? p.z <= 0.4 : stryMutAct_9fa48("2142") ? p.z >= 0.4 : stryMutAct_9fa48("2141") ? false : (stryCov_9fa48("2141", "2142", "2143"), p.z > 0.4)) || (stryMutAct_9fa48("2146") ? extraGlow <= 0.1 : stryMutAct_9fa48("2145") ? extraGlow >= 0.1 : stryMutAct_9fa48("2144") ? false : (stryCov_9fa48("2144", "2145", "2146"), extraGlow > 0.1)))) {
                  if (stryMutAct_9fa48("2147")) {
                    {}
                  } else {
                    stryCov_9fa48("2147");
                    const hr = stryMutAct_9fa48("2148") ? (p.size + extraGlow * 3) / (3 + p.z * 4) : (stryCov_9fa48("2148"), (stryMutAct_9fa48("2149") ? p.size - extraGlow * 3 : (stryCov_9fa48("2149"), p.size + (stryMutAct_9fa48("2150") ? extraGlow / 3 : (stryCov_9fa48("2150"), extraGlow * 3)))) * (stryMutAct_9fa48("2151") ? 3 - p.z * 4 : (stryCov_9fa48("2151"), 3 + (stryMutAct_9fa48("2152") ? p.z / 4 : (stryCov_9fa48("2152"), p.z * 4)))));
                    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, hr);
                    g.addColorStop(0, stryMutAct_9fa48("2153") ? `` : (stryCov_9fa48("2153"), `hsla(${Math.round(p.hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${stryMutAct_9fa48("2154") ? totalOp / 0.1 : (stryCov_9fa48("2154"), totalOp * 0.1)})`));
                    g.addColorStop(1, stryMutAct_9fa48("2155") ? `` : (stryCov_9fa48("2155"), `hsla(${Math.round(p.hue)}, 90%, 60%, 0)`));
                    ctx.fillStyle = g;
                    ctx.fillRect(stryMutAct_9fa48("2156") ? p.x + hr : (stryCov_9fa48("2156"), p.x - hr), stryMutAct_9fa48("2157") ? p.y + hr : (stryCov_9fa48("2157"), p.y - hr), stryMutAct_9fa48("2158") ? hr / 2 : (stryCov_9fa48("2158"), hr * 2), stryMutAct_9fa48("2159") ? hr / 2 : (stryCov_9fa48("2159"), hr * 2));
                  }
                }

                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, stryMutAct_9fa48("2160") ? p.size - extraGlow : (stryCov_9fa48("2160"), p.size + extraGlow), 0, stryMutAct_9fa48("2161") ? Math.PI / 2 : (stryCov_9fa48("2161"), Math.PI * 2));
                ctx.fillStyle = stryMutAct_9fa48("2162") ? `` : (stryCov_9fa48("2162"), `hsla(${Math.round(p.hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${totalOp})`);
                ctx.fill();

                // Hot white center for near particles
                if (stryMutAct_9fa48("2166") ? p.z <= 0.65 : stryMutAct_9fa48("2165") ? p.z >= 0.65 : stryMutAct_9fa48("2164") ? false : stryMutAct_9fa48("2163") ? true : (stryCov_9fa48("2163", "2164", "2165", "2166"), p.z > 0.65)) {
                  if (stryMutAct_9fa48("2167")) {
                    {}
                  } else {
                    stryCov_9fa48("2167");
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, stryMutAct_9fa48("2168") ? p.size / 0.3 : (stryCov_9fa48("2168"), p.size * 0.3), 0, stryMutAct_9fa48("2169") ? Math.PI / 2 : (stryCov_9fa48("2169"), Math.PI * 2));
                    ctx.fillStyle = stryMutAct_9fa48("2170") ? `` : (stryCov_9fa48("2170"), `rgba(255, 255, 255, ${stryMutAct_9fa48("2171") ? totalOp * 0.6 / p.z : (stryCov_9fa48("2171"), (stryMutAct_9fa48("2172") ? totalOp / 0.6 : (stryCov_9fa48("2172"), totalOp * 0.6)) * p.z)})`);
                    ctx.fill();
                  }
                }
              }
            }

            // Center depth glow -- warm center
            const cg = ctx.createRadialGradient(stryMutAct_9fa48("2173") ? cw / 0.5 : (stryCov_9fa48("2173"), cw * 0.5), stryMutAct_9fa48("2174") ? ch / 0.45 : (stryCov_9fa48("2174"), ch * 0.45), 0, stryMutAct_9fa48("2175") ? cw / 0.5 : (stryCov_9fa48("2175"), cw * 0.5), stryMutAct_9fa48("2176") ? ch / 0.45 : (stryCov_9fa48("2176"), ch * 0.45), stryMutAct_9fa48("2177") ? cw / 0.35 : (stryCov_9fa48("2177"), cw * 0.35));
            cg.addColorStop(0, stryMutAct_9fa48("2178") ? "" : (stryCov_9fa48("2178"), "rgba(6, 214, 224, 0.035)"));
            cg.addColorStop(0.3, stryMutAct_9fa48("2179") ? "" : (stryCov_9fa48("2179"), "rgba(6, 214, 224, 0.012)"));
            cg.addColorStop(1, stryMutAct_9fa48("2180") ? "" : (stryCov_9fa48("2180"), "rgba(0, 0, 0, 0)"));
            ctx.fillStyle = cg;
            ctx.fillRect(0, 0, cw, ch);
          }
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => {
          if (stryMutAct_9fa48("2181")) {
            {}
          } else {
            stryCov_9fa48("2181");
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener(stryMutAct_9fa48("2182") ? "" : (stryCov_9fa48("2182"), "resize"), resize);
            window.removeEventListener(stryMutAct_9fa48("2183") ? "" : (stryCov_9fa48("2183"), "mousemove"), onMove);
            window.removeEventListener(stryMutAct_9fa48("2184") ? "" : (stryCov_9fa48("2184"), "mouseleave"), onLeave);
            if (stryMutAct_9fa48("2186") ? false : stryMutAct_9fa48("2185") ? true : (stryCov_9fa48("2185", "2186"), mobile)) {
              if (stryMutAct_9fa48("2187")) {
                {}
              } else {
                stryCov_9fa48("2187");
                window.removeEventListener(stryMutAct_9fa48("2188") ? "" : (stryCov_9fa48("2188"), "touchmove"), onTouch);
                window.removeEventListener(stryMutAct_9fa48("2189") ? "" : (stryCov_9fa48("2189"), "touchend"), onTouchEnd);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("2190") ? [] : (stryCov_9fa48("2190"), [onMove, onLeave]));
    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={stryMutAct_9fa48("2191") ? {} : (stryCov_9fa48("2191"), {
      zIndex: 1
    })} aria-hidden="true" />;
  }
}