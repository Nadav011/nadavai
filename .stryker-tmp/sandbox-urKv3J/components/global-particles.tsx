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
  size: number;
  z: number;
  hue: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}
export function GlobalParticles() {
  if (stryMutAct_9fa48("1393")) {
    {}
  } else {
    stryCov_9fa48("1393");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef(stryMutAct_9fa48("1394") ? {} : (stryCov_9fa48("1394"), {
      x: stryMutAct_9fa48("1395") ? +9999 : (stryCov_9fa48("1395"), -9999),
      y: stryMutAct_9fa48("1396") ? +9999 : (stryCov_9fa48("1396"), -9999)
    }));
    const frameRef = useRef(0);
    const scrollRef = useRef(0);
    const onMove = useCallback((e: MouseEvent) => {
      if (stryMutAct_9fa48("1397")) {
        {}
      } else {
        stryCov_9fa48("1397");
        mouseRef.current = stryMutAct_9fa48("1398") ? {} : (stryCov_9fa48("1398"), {
          x: e.clientX,
          y: e.clientY
        });
      }
    }, stryMutAct_9fa48("1399") ? ["Stryker was here"] : (stryCov_9fa48("1399"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("1400")) {
        {}
      } else {
        stryCov_9fa48("1400");
        const canvas = canvasRef.current;
        if (stryMutAct_9fa48("1403") ? false : stryMutAct_9fa48("1402") ? true : stryMutAct_9fa48("1401") ? canvas : (stryCov_9fa48("1401", "1402", "1403"), !canvas)) return;
        const ctx = canvas.getContext(stryMutAct_9fa48("1404") ? "" : (stryCov_9fa48("1404"), "2d"), stryMutAct_9fa48("1405") ? {} : (stryCov_9fa48("1405"), {
          alpha: stryMutAct_9fa48("1406") ? false : (stryCov_9fa48("1406"), true)
        }));
        if (stryMutAct_9fa48("1409") ? false : stryMutAct_9fa48("1408") ? true : stryMutAct_9fa48("1407") ? ctx : (stryCov_9fa48("1407", "1408", "1409"), !ctx)) return;
        const mobile = stryMutAct_9fa48("1413") ? window.innerWidth >= 768 : stryMutAct_9fa48("1412") ? window.innerWidth <= 768 : stryMutAct_9fa48("1411") ? false : stryMutAct_9fa48("1410") ? true : (stryCov_9fa48("1410", "1411", "1412", "1413"), window.innerWidth < 768);
        const COUNT = mobile ? 35 : 70;
        const LINK_DIST = mobile ? 110 : 160;
        const MOUSE_R = mobile ? 80 : 150;
        const SPEED = 0.15;
        let cw = 0,
          ch = 0;
        const resize = () => {
          if (stryMutAct_9fa48("1414")) {
            {}
          } else {
            stryCov_9fa48("1414");
            const dpr = stryMutAct_9fa48("1415") ? Math.max(window.devicePixelRatio, mobile ? 1 : 1.5) : (stryCov_9fa48("1415"), Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
            cw = window.innerWidth;
            ch = window.innerHeight;
            canvas.width = stryMutAct_9fa48("1416") ? cw / dpr : (stryCov_9fa48("1416"), cw * dpr);
            canvas.height = stryMutAct_9fa48("1417") ? ch / dpr : (stryCov_9fa48("1417"), ch * dpr);
            canvas.style.width = stryMutAct_9fa48("1418") ? `` : (stryCov_9fa48("1418"), `${cw}px`);
            canvas.style.height = stryMutAct_9fa48("1419") ? `` : (stryCov_9fa48("1419"), `${ch}px`);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
        };
        resize();

        // Create particles spread across the viewport
        const particles: Particle[] = Array.from(stryMutAct_9fa48("1420") ? {} : (stryCov_9fa48("1420"), {
          length: COUNT
        }), () => {
          if (stryMutAct_9fa48("1421")) {
            {}
          } else {
            stryCov_9fa48("1421");
            const z = Math.random();
            return stryMutAct_9fa48("1422") ? {} : (stryCov_9fa48("1422"), {
              x: stryMutAct_9fa48("1423") ? Math.random() / cw : (stryCov_9fa48("1423"), Math.random() * cw),
              y: stryMutAct_9fa48("1424") ? Math.random() / ch : (stryCov_9fa48("1424"), Math.random() * ch),
              vx: stryMutAct_9fa48("1425") ? (Math.random() - 0.5) * SPEED / (0.4 + z * 0.6) : (stryCov_9fa48("1425"), (stryMutAct_9fa48("1426") ? (Math.random() - 0.5) / SPEED : (stryCov_9fa48("1426"), (stryMutAct_9fa48("1427") ? Math.random() + 0.5 : (stryCov_9fa48("1427"), Math.random() - 0.5)) * SPEED)) * (stryMutAct_9fa48("1428") ? 0.4 - z * 0.6 : (stryCov_9fa48("1428"), 0.4 + (stryMutAct_9fa48("1429") ? z / 0.6 : (stryCov_9fa48("1429"), z * 0.6))))),
              vy: stryMutAct_9fa48("1430") ? (Math.random() - 0.5) * SPEED / (0.4 + z * 0.6) : (stryCov_9fa48("1430"), (stryMutAct_9fa48("1431") ? (Math.random() - 0.5) / SPEED : (stryCov_9fa48("1431"), (stryMutAct_9fa48("1432") ? Math.random() + 0.5 : (stryCov_9fa48("1432"), Math.random() - 0.5)) * SPEED)) * (stryMutAct_9fa48("1433") ? 0.4 - z * 0.6 : (stryCov_9fa48("1433"), 0.4 + (stryMutAct_9fa48("1434") ? z / 0.6 : (stryCov_9fa48("1434"), z * 0.6))))),
              size: stryMutAct_9fa48("1435") ? 0.4 - z * 1.6 : (stryCov_9fa48("1435"), 0.4 + (stryMutAct_9fa48("1436") ? z / 1.6 : (stryCov_9fa48("1436"), z * 1.6))),
              z,
              hue: stryMutAct_9fa48("1437") ? 180 - Math.random() * 12 : (stryCov_9fa48("1437"), 180 + (stryMutAct_9fa48("1438") ? Math.random() / 12 : (stryCov_9fa48("1438"), Math.random() * 12))),
              opacity: stryMutAct_9fa48("1439") ? 0.08 - z * 0.35 : (stryCov_9fa48("1439"), 0.08 + (stryMutAct_9fa48("1440") ? z / 0.35 : (stryCov_9fa48("1440"), z * 0.35))),
              pulse: stryMutAct_9fa48("1441") ? Math.random() * Math.PI / 2 : (stryCov_9fa48("1441"), (stryMutAct_9fa48("1442") ? Math.random() / Math.PI : (stryCov_9fa48("1442"), Math.random() * Math.PI)) * 2),
              pulseSpeed: stryMutAct_9fa48("1443") ? 0.004 - Math.random() * 0.012 : (stryCov_9fa48("1443"), 0.004 + (stryMutAct_9fa48("1444") ? Math.random() / 0.012 : (stryCov_9fa48("1444"), Math.random() * 0.012)))
            });
          }
        });
        window.addEventListener(stryMutAct_9fa48("1445") ? "" : (stryCov_9fa48("1445"), "resize"), resize);
        window.addEventListener(stryMutAct_9fa48("1446") ? "" : (stryCov_9fa48("1446"), "mousemove"), onMove);
        const onScroll = () => {
          if (stryMutAct_9fa48("1447")) {
            {}
          } else {
            stryCov_9fa48("1447");
            scrollRef.current = window.scrollY;
          }
        };
        window.addEventListener(stryMutAct_9fa48("1448") ? "" : (stryCov_9fa48("1448"), "scroll"), onScroll, stryMutAct_9fa48("1449") ? {} : (stryCov_9fa48("1449"), {
          passive: stryMutAct_9fa48("1450") ? false : (stryCov_9fa48("1450"), true)
        }));
        const animate = () => {
          if (stryMutAct_9fa48("1451")) {
            {}
          } else {
            stryCov_9fa48("1451");
            frameRef.current = requestAnimationFrame(animate);
            if (stryMutAct_9fa48("1453") ? false : stryMutAct_9fa48("1452") ? true : (stryCov_9fa48("1452", "1453"), document.hidden)) return;
            ctx.clearRect(0, 0, cw, ch);
            const mouse = mouseRef.current;

            // Update particles
            for (const p of particles) {
              if (stryMutAct_9fa48("1454")) {
                {}
              } else {
                stryCov_9fa48("1454");
                stryMutAct_9fa48("1455") ? p.pulse -= p.pulseSpeed : (stryCov_9fa48("1455"), p.pulse += p.pulseSpeed);
                const sizeMod = stryMutAct_9fa48("1456") ? Math.sin(p.pulse) * 0.25 / p.z : (stryCov_9fa48("1456"), (stryMutAct_9fa48("1457") ? Math.sin(p.pulse) / 0.25 : (stryCov_9fa48("1457"), Math.sin(p.pulse) * 0.25)) * p.z);

                // Mouse repulsion
                const dx = stryMutAct_9fa48("1458") ? p.x + mouse.x : (stryCov_9fa48("1458"), p.x - mouse.x);
                const dy = stryMutAct_9fa48("1459") ? p.y + mouse.y : (stryCov_9fa48("1459"), p.y - mouse.y);
                const dist = Math.sqrt(stryMutAct_9fa48("1460") ? dx * dx - dy * dy : (stryCov_9fa48("1460"), (stryMutAct_9fa48("1461") ? dx / dx : (stryCov_9fa48("1461"), dx * dx)) + (stryMutAct_9fa48("1462") ? dy / dy : (stryCov_9fa48("1462"), dy * dy))));
                if (stryMutAct_9fa48("1465") ? dist < MOUSE_R || dist > 0 : stryMutAct_9fa48("1464") ? false : stryMutAct_9fa48("1463") ? true : (stryCov_9fa48("1463", "1464", "1465"), (stryMutAct_9fa48("1468") ? dist >= MOUSE_R : stryMutAct_9fa48("1467") ? dist <= MOUSE_R : stryMutAct_9fa48("1466") ? true : (stryCov_9fa48("1466", "1467", "1468"), dist < MOUSE_R)) && (stryMutAct_9fa48("1471") ? dist <= 0 : stryMutAct_9fa48("1470") ? dist >= 0 : stryMutAct_9fa48("1469") ? true : (stryCov_9fa48("1469", "1470", "1471"), dist > 0)))) {
                  if (stryMutAct_9fa48("1472")) {
                    {}
                  } else {
                    stryCov_9fa48("1472");
                    const force = stryMutAct_9fa48("1473") ? (MOUSE_R - dist) / MOUSE_R / (0.3 + p.z * 0.4) : (stryCov_9fa48("1473"), (stryMutAct_9fa48("1474") ? (MOUSE_R - dist) * MOUSE_R : (stryCov_9fa48("1474"), (stryMutAct_9fa48("1475") ? MOUSE_R + dist : (stryCov_9fa48("1475"), MOUSE_R - dist)) / MOUSE_R)) * (stryMutAct_9fa48("1476") ? 0.3 - p.z * 0.4 : (stryCov_9fa48("1476"), 0.3 + (stryMutAct_9fa48("1477") ? p.z / 0.4 : (stryCov_9fa48("1477"), p.z * 0.4)))));
                    stryMutAct_9fa48("1478") ? p.vx -= dx / dist * force * 0.05 : (stryCov_9fa48("1478"), p.vx += stryMutAct_9fa48("1479") ? dx / dist * force / 0.05 : (stryCov_9fa48("1479"), (stryMutAct_9fa48("1480") ? dx / dist / force : (stryCov_9fa48("1480"), (stryMutAct_9fa48("1481") ? dx * dist : (stryCov_9fa48("1481"), dx / dist)) * force)) * 0.05));
                    stryMutAct_9fa48("1482") ? p.vy -= dy / dist * force * 0.05 : (stryCov_9fa48("1482"), p.vy += stryMutAct_9fa48("1483") ? dy / dist * force / 0.05 : (stryCov_9fa48("1483"), (stryMutAct_9fa48("1484") ? dy / dist / force : (stryCov_9fa48("1484"), (stryMutAct_9fa48("1485") ? dy * dist : (stryCov_9fa48("1485"), dy / dist)) * force)) * 0.05));
                  }
                }

                // Damping and drift
                stryMutAct_9fa48("1486") ? p.vx /= 0.995 : (stryCov_9fa48("1486"), p.vx *= 0.995);
                stryMutAct_9fa48("1487") ? p.vy /= 0.995 : (stryCov_9fa48("1487"), p.vy *= 0.995);
                const spd = Math.sqrt(stryMutAct_9fa48("1488") ? p.vx * p.vx - p.vy * p.vy : (stryCov_9fa48("1488"), (stryMutAct_9fa48("1489") ? p.vx / p.vx : (stryCov_9fa48("1489"), p.vx * p.vx)) + (stryMutAct_9fa48("1490") ? p.vy / p.vy : (stryCov_9fa48("1490"), p.vy * p.vy))));
                if (stryMutAct_9fa48("1494") ? spd >= SPEED * 0.15 : stryMutAct_9fa48("1493") ? spd <= SPEED * 0.15 : stryMutAct_9fa48("1492") ? false : stryMutAct_9fa48("1491") ? true : (stryCov_9fa48("1491", "1492", "1493", "1494"), spd < (stryMutAct_9fa48("1495") ? SPEED / 0.15 : (stryCov_9fa48("1495"), SPEED * 0.15)))) {
                  if (stryMutAct_9fa48("1496")) {
                    {}
                  } else {
                    stryCov_9fa48("1496");
                    stryMutAct_9fa48("1497") ? p.vx -= (Math.random() - 0.5) * 0.02 : (stryCov_9fa48("1497"), p.vx += stryMutAct_9fa48("1498") ? (Math.random() - 0.5) / 0.02 : (stryCov_9fa48("1498"), (stryMutAct_9fa48("1499") ? Math.random() + 0.5 : (stryCov_9fa48("1499"), Math.random() - 0.5)) * 0.02));
                    stryMutAct_9fa48("1500") ? p.vy -= (Math.random() - 0.5) * 0.02 : (stryCov_9fa48("1500"), p.vy += stryMutAct_9fa48("1501") ? (Math.random() - 0.5) / 0.02 : (stryCov_9fa48("1501"), (stryMutAct_9fa48("1502") ? Math.random() + 0.5 : (stryCov_9fa48("1502"), Math.random() - 0.5)) * 0.02));
                  }
                }
                stryMutAct_9fa48("1503") ? p.x -= p.vx : (stryCov_9fa48("1503"), p.x += p.vx);
                stryMutAct_9fa48("1504") ? p.y -= p.vy : (stryCov_9fa48("1504"), p.y += p.vy);

                // Wrap around viewport
                if (stryMutAct_9fa48("1508") ? p.x >= -20 : stryMutAct_9fa48("1507") ? p.x <= -20 : stryMutAct_9fa48("1506") ? false : stryMutAct_9fa48("1505") ? true : (stryCov_9fa48("1505", "1506", "1507", "1508"), p.x < (stryMutAct_9fa48("1509") ? +20 : (stryCov_9fa48("1509"), -20)))) p.x = stryMutAct_9fa48("1510") ? cw - 20 : (stryCov_9fa48("1510"), cw + 20);
                if (stryMutAct_9fa48("1514") ? p.x <= cw + 20 : stryMutAct_9fa48("1513") ? p.x >= cw + 20 : stryMutAct_9fa48("1512") ? false : stryMutAct_9fa48("1511") ? true : (stryCov_9fa48("1511", "1512", "1513", "1514"), p.x > (stryMutAct_9fa48("1515") ? cw - 20 : (stryCov_9fa48("1515"), cw + 20)))) p.x = stryMutAct_9fa48("1516") ? +20 : (stryCov_9fa48("1516"), -20);
                if (stryMutAct_9fa48("1520") ? p.y >= -20 : stryMutAct_9fa48("1519") ? p.y <= -20 : stryMutAct_9fa48("1518") ? false : stryMutAct_9fa48("1517") ? true : (stryCov_9fa48("1517", "1518", "1519", "1520"), p.y < (stryMutAct_9fa48("1521") ? +20 : (stryCov_9fa48("1521"), -20)))) p.y = stryMutAct_9fa48("1522") ? ch - 20 : (stryCov_9fa48("1522"), ch + 20);
                if (stryMutAct_9fa48("1526") ? p.y <= ch + 20 : stryMutAct_9fa48("1525") ? p.y >= ch + 20 : stryMutAct_9fa48("1524") ? false : stryMutAct_9fa48("1523") ? true : (stryCov_9fa48("1523", "1524", "1525", "1526"), p.y > (stryMutAct_9fa48("1527") ? ch - 20 : (stryCov_9fa48("1527"), ch + 20)))) p.y = stryMutAct_9fa48("1528") ? +20 : (stryCov_9fa48("1528"), -20);

                // Draw connections to nearby particles
                for (const q of particles) {
                  if (stryMutAct_9fa48("1529")) {
                    {}
                  } else {
                    stryCov_9fa48("1529");
                    if (stryMutAct_9fa48("1532") ? q !== p : stryMutAct_9fa48("1531") ? false : stryMutAct_9fa48("1530") ? true : (stryCov_9fa48("1530", "1531", "1532"), q === p)) continue;
                    const zDiff = Math.abs(stryMutAct_9fa48("1533") ? p.z + q.z : (stryCov_9fa48("1533"), p.z - q.z));
                    if (stryMutAct_9fa48("1537") ? zDiff <= 0.45 : stryMutAct_9fa48("1536") ? zDiff >= 0.45 : stryMutAct_9fa48("1535") ? false : stryMutAct_9fa48("1534") ? true : (stryCov_9fa48("1534", "1535", "1536", "1537"), zDiff > 0.45)) continue;
                    const cdx = stryMutAct_9fa48("1538") ? p.x + q.x : (stryCov_9fa48("1538"), p.x - q.x);
                    const cdy = stryMutAct_9fa48("1539") ? p.y + q.y : (stryCov_9fa48("1539"), p.y - q.y);
                    const cdist = Math.sqrt(stryMutAct_9fa48("1540") ? cdx * cdx - cdy * cdy : (stryCov_9fa48("1540"), (stryMutAct_9fa48("1541") ? cdx / cdx : (stryCov_9fa48("1541"), cdx * cdx)) + (stryMutAct_9fa48("1542") ? cdy / cdy : (stryCov_9fa48("1542"), cdy * cdy))));
                    const adjustedDist = stryMutAct_9fa48("1543") ? LINK_DIST / (0.5 + (p.z + q.z) * 0.3) : (stryCov_9fa48("1543"), LINK_DIST * (stryMutAct_9fa48("1544") ? 0.5 - (p.z + q.z) * 0.3 : (stryCov_9fa48("1544"), 0.5 + (stryMutAct_9fa48("1545") ? (p.z + q.z) / 0.3 : (stryCov_9fa48("1545"), (stryMutAct_9fa48("1546") ? p.z - q.z : (stryCov_9fa48("1546"), p.z + q.z)) * 0.3)))));
                    if (stryMutAct_9fa48("1549") ? cdist < adjustedDist || cdist > 0 : stryMutAct_9fa48("1548") ? false : stryMutAct_9fa48("1547") ? true : (stryCov_9fa48("1547", "1548", "1549"), (stryMutAct_9fa48("1552") ? cdist >= adjustedDist : stryMutAct_9fa48("1551") ? cdist <= adjustedDist : stryMutAct_9fa48("1550") ? true : (stryCov_9fa48("1550", "1551", "1552"), cdist < adjustedDist)) && (stryMutAct_9fa48("1555") ? cdist <= 0 : stryMutAct_9fa48("1554") ? cdist >= 0 : stryMutAct_9fa48("1553") ? true : (stryCov_9fa48("1553", "1554", "1555"), cdist > 0)))) {
                      if (stryMutAct_9fa48("1556")) {
                        {}
                      } else {
                        stryCov_9fa48("1556");
                        const avgZ = stryMutAct_9fa48("1557") ? (p.z + q.z) * 2 : (stryCov_9fa48("1557"), (stryMutAct_9fa48("1558") ? p.z - q.z : (stryCov_9fa48("1558"), p.z + q.z)) / 2);
                        let op = stryMutAct_9fa48("1559") ? (1 - cdist / adjustedDist) / (0.04 + avgZ * 0.12) : (stryCov_9fa48("1559"), (stryMutAct_9fa48("1560") ? 1 + cdist / adjustedDist : (stryCov_9fa48("1560"), 1 - (stryMutAct_9fa48("1561") ? cdist * adjustedDist : (stryCov_9fa48("1561"), cdist / adjustedDist)))) * (stryMutAct_9fa48("1562") ? 0.04 - avgZ * 0.12 : (stryCov_9fa48("1562"), 0.04 + (stryMutAct_9fa48("1563") ? avgZ / 0.12 : (stryCov_9fa48("1563"), avgZ * 0.12)))));

                        // Mouse proximity brightens connections
                        if (stryMutAct_9fa48("1567") ? dist >= MOUSE_R * 1.5 : stryMutAct_9fa48("1566") ? dist <= MOUSE_R * 1.5 : stryMutAct_9fa48("1565") ? false : stryMutAct_9fa48("1564") ? true : (stryCov_9fa48("1564", "1565", "1566", "1567"), dist < (stryMutAct_9fa48("1568") ? MOUSE_R / 1.5 : (stryCov_9fa48("1568"), MOUSE_R * 1.5)))) {
                          if (stryMutAct_9fa48("1569")) {
                            {}
                          } else {
                            stryCov_9fa48("1569");
                            stryMutAct_9fa48("1570") ? op -= (1 - dist / (MOUSE_R * 1.5)) * 0.08 * avgZ : (stryCov_9fa48("1570"), op += stryMutAct_9fa48("1571") ? (1 - dist / (MOUSE_R * 1.5)) * 0.08 / avgZ : (stryCov_9fa48("1571"), (stryMutAct_9fa48("1572") ? (1 - dist / (MOUSE_R * 1.5)) / 0.08 : (stryCov_9fa48("1572"), (stryMutAct_9fa48("1573") ? 1 + dist / (MOUSE_R * 1.5) : (stryCov_9fa48("1573"), 1 - (stryMutAct_9fa48("1574") ? dist * (MOUSE_R * 1.5) : (stryCov_9fa48("1574"), dist / (stryMutAct_9fa48("1575") ? MOUSE_R / 1.5 : (stryCov_9fa48("1575"), MOUSE_R * 1.5)))))) * 0.08)) * avgZ));
                          }
                        }
                        const lum = Math.round(stryMutAct_9fa48("1576") ? 50 - avgZ * 30 : (stryCov_9fa48("1576"), 50 + (stryMutAct_9fa48("1577") ? avgZ / 30 : (stryCov_9fa48("1577"), avgZ * 30))));
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = stryMutAct_9fa48("1578") ? `` : (stryCov_9fa48("1578"), `hsla(${Math.round(stryMutAct_9fa48("1579") ? (p.hue + q.hue) * 2 : (stryCov_9fa48("1579"), (stryMutAct_9fa48("1580") ? p.hue - q.hue : (stryCov_9fa48("1580"), p.hue + q.hue)) / 2))}, 85%, ${lum}%, ${stryMutAct_9fa48("1581") ? Math.max(op, 0.3) : (stryCov_9fa48("1581"), Math.min(op, 0.3))})`);
                        ctx.lineWidth = stryMutAct_9fa48("1582") ? 0.3 - avgZ * 0.4 : (stryCov_9fa48("1582"), 0.3 + (stryMutAct_9fa48("1583") ? avgZ / 0.4 : (stryCov_9fa48("1583"), avgZ * 0.4)));
                        ctx.stroke();
                      }
                    }
                  }
                }

                // Draw particle
                const totalSize = stryMutAct_9fa48("1584") ? p.size - sizeMod : (stryCov_9fa48("1584"), p.size + sizeMod);
                const lum = stryMutAct_9fa48("1585") ? 50 - p.z * 35 : (stryCov_9fa48("1585"), 50 + (stryMutAct_9fa48("1586") ? p.z / 35 : (stryCov_9fa48("1586"), p.z * 35)));
                const sat = stryMutAct_9fa48("1587") ? 80 - p.z * 15 : (stryCov_9fa48("1587"), 80 + (stryMutAct_9fa48("1588") ? p.z / 15 : (stryCov_9fa48("1588"), p.z * 15)));

                // Bloom halo for near particles
                if (stryMutAct_9fa48("1592") ? p.z <= 0.5 : stryMutAct_9fa48("1591") ? p.z >= 0.5 : stryMutAct_9fa48("1590") ? false : stryMutAct_9fa48("1589") ? true : (stryCov_9fa48("1589", "1590", "1591", "1592"), p.z > 0.5)) {
                  if (stryMutAct_9fa48("1593")) {
                    {}
                  } else {
                    stryCov_9fa48("1593");
                    const hr = stryMutAct_9fa48("1594") ? totalSize / (2 + p.z * 3) : (stryCov_9fa48("1594"), totalSize * (stryMutAct_9fa48("1595") ? 2 - p.z * 3 : (stryCov_9fa48("1595"), 2 + (stryMutAct_9fa48("1596") ? p.z / 3 : (stryCov_9fa48("1596"), p.z * 3)))));
                    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, hr);
                    g.addColorStop(0, stryMutAct_9fa48("1597") ? `` : (stryCov_9fa48("1597"), `hsla(${Math.round(p.hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${stryMutAct_9fa48("1598") ? p.opacity / 0.06 : (stryCov_9fa48("1598"), p.opacity * 0.06)})`));
                    g.addColorStop(1, stryMutAct_9fa48("1599") ? `` : (stryCov_9fa48("1599"), `hsla(${Math.round(p.hue)}, 85%, 55%, 0)`));
                    ctx.fillStyle = g;
                    ctx.fillRect(stryMutAct_9fa48("1600") ? p.x + hr : (stryCov_9fa48("1600"), p.x - hr), stryMutAct_9fa48("1601") ? p.y + hr : (stryCov_9fa48("1601"), p.y - hr), stryMutAct_9fa48("1602") ? hr / 2 : (stryCov_9fa48("1602"), hr * 2), stryMutAct_9fa48("1603") ? hr / 2 : (stryCov_9fa48("1603"), hr * 2));
                  }
                }

                // Core dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, totalSize, 0, stryMutAct_9fa48("1604") ? Math.PI / 2 : (stryCov_9fa48("1604"), Math.PI * 2));
                ctx.fillStyle = stryMutAct_9fa48("1605") ? `` : (stryCov_9fa48("1605"), `hsla(${Math.round(p.hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${p.opacity})`);
                ctx.fill();

                // White center for near particles
                if (stryMutAct_9fa48("1609") ? p.z <= 0.7 : stryMutAct_9fa48("1608") ? p.z >= 0.7 : stryMutAct_9fa48("1607") ? false : stryMutAct_9fa48("1606") ? true : (stryCov_9fa48("1606", "1607", "1608", "1609"), p.z > 0.7)) {
                  if (stryMutAct_9fa48("1610")) {
                    {}
                  } else {
                    stryCov_9fa48("1610");
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, stryMutAct_9fa48("1611") ? totalSize / 0.25 : (stryCov_9fa48("1611"), totalSize * 0.25), 0, stryMutAct_9fa48("1612") ? Math.PI / 2 : (stryCov_9fa48("1612"), Math.PI * 2));
                    ctx.fillStyle = stryMutAct_9fa48("1613") ? `` : (stryCov_9fa48("1613"), `rgba(220, 255, 255, ${stryMutAct_9fa48("1614") ? p.opacity / 0.4 : (stryCov_9fa48("1614"), p.opacity * 0.4)})`);
                    ctx.fill();
                  }
                }
              }
            }
          }
        };
        frameRef.current = requestAnimationFrame(animate);
        return () => {
          if (stryMutAct_9fa48("1615")) {
            {}
          } else {
            stryCov_9fa48("1615");
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener(stryMutAct_9fa48("1616") ? "" : (stryCov_9fa48("1616"), "resize"), resize);
            window.removeEventListener(stryMutAct_9fa48("1617") ? "" : (stryCov_9fa48("1617"), "mousemove"), onMove);
            window.removeEventListener(stryMutAct_9fa48("1618") ? "" : (stryCov_9fa48("1618"), "scroll"), onScroll);
          }
        };
      }
    }, stryMutAct_9fa48("1619") ? [] : (stryCov_9fa48("1619"), [onMove]));
    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={stryMutAct_9fa48("1620") ? {} : (stryCov_9fa48("1620"), {
      zIndex: 1
    })} aria-hidden="true" />;
  }
}