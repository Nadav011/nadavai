// dims/story-kit.js: small shared parts of the five story dimensions (about, social, play, branch, network; 2026-10-28).
// core.js runs the place; this file only holds what the five pages would otherwise copy: voxel sculptures from a 2D
// mask (a function or a line of text), the swarm's formation builder, a soft glow sprite and a field of points.
import { TAU, rnd, FOG_ADD } from './core.js';

/* a voxel sculpture from a 2D mask: as many cells as fit in n, extruded D metres. mask(u, v): u in [-W/H, W/H], v in [-1, 1] */
export function vox(mask, n, W, H, D) {
  let lo = 0.08, hi = 3, best = { pts: [[0, 0, 0]], s: 0.5 };
  for (let it = 0; it < 16; it++) {
    const s = (lo + hi) / 2, out = [];
    const nx = Math.ceil(W / s), ny = Math.ceil(H / s), nz = Math.max(1, Math.round(D / s));
    for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
      const u = ((x + 0.5) / nx) * 2 - 1, v = ((y + 0.5) / ny) * 2 - 1;
      if (!mask(u * (W / H), v)) continue;
      for (let z = 0; z < nz; z++) out.push([(x + 0.5 - nx / 2) * s, (y + 0.5 - ny / 2) * s, (z + 0.5 - nz / 2) * s]);
    }
    if (out.length <= n) { if (out.length) best = { pts: out, s }; hi = s; } else lo = s;
  }
  return best;
}
/* the same in 3D: inside(x, y, z) with each axis in [-1, 1] of a W × H × D box */
export function vox3(inside, n, W, H, D) {
  let lo = 0.08, hi = 3, best = { pts: [[0, 0, 0]], s: 0.5 };
  for (let it = 0; it < 16; it++) {
    const s = (lo + hi) / 2, out = [];
    const nx = Math.ceil(W / s), ny = Math.ceil(H / s), nz = Math.ceil(D / s);
    for (let y = 0; y < ny; y++) for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) {
      if (!inside(((x + 0.5) / nx) * 2 - 1, ((y + 0.5) / ny) * 2 - 1, ((z + 0.5) / nz) * 2 - 1)) continue;
      out.push([(x + 0.5 - nx / 2) * s, (y + 0.5 - ny / 2) * s, (z + 0.5 - nz / 2) * s]);
    }
    if (out.length <= n) { if (out.length) best = { pts: out, s }; hi = s; } else lo = s;
  }
  return best;
}
export const sdBox = (x, y, bx, by, r = 0) => { const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r; };
export const seg = (u, v, ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, t = Math.min(1, Math.max(0, ((u - ax) * dx + (v - ay) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(u - ax - dx * t, v - ay - dy * t); };

/* a mask from a line of text (any script the page's fonts carry): returns { mask, asp } with asp = w / h */
export function textMask(text, { w = 512, h = 192, font = '800 150px Archivo, Rubik, sans-serif', dir = 'ltr' } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.direction = dir; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff';
  g.fillText(text, w / 2, h / 2 + h * 0.04);
  const a = g.getImageData(0, 0, w, h).data, asp = w / h;
  return { asp, mask: (u, v) => { const x = Math.floor(((u / asp + 1) / 2) * w), y = Math.floor(((1 - v) / 2) * h); return x >= 0 && x < w && y >= 0 && y < h && a[(y * w + x) * 4 + 3] > 110; } };
}

/* a formation of the swarm. pts: the shape's cells; place(q, i) → [x, y, z]; col(i, q) → [r, g, b, glow];
   the blocks past the shape take spare(i) → { p, s, c } (dust, rain, a ring) or shrink to nothing */
export function formOf(N, pts, s, { place = (q) => q, col = () => [0.5, 0.5, 0.5, 0], spare = null, lift = 3, fill = 0.86 } = {}) {
  const p = new Float32Array(N * 3), c = new Float32Array(N * 4), sz = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let xyz, cc, ss;
    if (i < pts.length) { xyz = place(pts[i], i); cc = col(i, pts[i]); ss = s * fill; }
    else if (spare) { const o = spare(i); xyz = o.p; cc = o.c; ss = o.s; }
    else { xyz = place(pts[i % Math.max(1, pts.length)], i); cc = col(i, pts[0]); ss = 0; }
    p[i * 3] = xyz[0]; p[i * 3 + 1] = xyz[1]; p[i * 3 + 2] = xyz[2];
    c[i * 4] = cc[0]; c[i * 4 + 1] = cc[1]; c[i * 4 + 2] = cc[2]; c[i * 4 + 3] = cc[3];
    sz[i] = ss;
  }
  return { p, c, s: sz, lift };
}
/* place a shape at (cx, cy, cz), turned by yaw (and tilted by pitch) */
export const at = (cx, cy, cz, yaw = 0, pitch = 0) => (q) => {
  const y1 = q[1] * Math.cos(pitch) - q[2] * Math.sin(pitch), z1 = q[1] * Math.sin(pitch) + q[2] * Math.cos(pitch);
  return [cx + q[0] * Math.cos(yaw) + z1 * Math.sin(yaw), cy + y1, cz - q[0] * Math.sin(yaw) + z1 * Math.cos(yaw)];
};
export const mixC = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const hex = (h) => { const n = parseInt(h.replace('#', ''), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
export const lin = (c) => c.map((x) => Math.pow(x, 2.2));   // sRGB → linear, for the swarm's colours

/* a soft round glow (sprites, lamps) */
export function glowTex(THREE, tint = [255, 220, 170]) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  const [r, gg, b] = tint;
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, `rgba(${r},${gg},${b},.55)`); gr.addColorStop(0.5, `rgba(${r},${gg},${b},.12)`); gr.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/* a field of soft points: stars, dust, orbs. pos(i) → [x, y, z], col(i) → [r, g, b], size in metres at 1 m.
   uI scales them all (a page can fade a field in and out); rise lifts them over time (dust that floats up) */
const PTS_VS = /* glsl */`
attribute vec3 aCol; attribute float aSeed; uniform float uTime, uScale, uSize, uRise, uSpan, uTw;
varying vec3 vC; varying float vA;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  if (uRise > 0.0) p.y = position.y - uSpan * 0.5 + mod(position.y + uSpan * 0.5 + uTime * uRise * (0.5 + aSeed), uSpan);
  p.x += sin(uTime * 0.3 + aSeed * 30.0) * 0.3 * uRise;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  float tw = 1.0 - uTw + uTw * (0.5 + 0.5 * sin(uTime * (0.8 + aSeed * 2.0) + aSeed * 60.0));
  vC = aCol * tw; vA = 1.0;
  gl_PointSize = clamp(uSize * (0.5 + aSeed) * uScale / -mvPosition.z, 1.0, 64.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const PTS_FS = /* glsl */`
uniform float uI; varying vec3 vC; varying float vA;
#include <fog_pars_fragment>
void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c); if (r > 0.25) discard;
  float a = exp(-r * 18.0) + exp(-r * 70.0) * 0.8;
  gl_FragColor = vec4(vC * a * uI, 1.0);
  ${FOG_ADD}
}`;
export function points(ctx, n, pos, col, { size = 0.2, rise = 0, span = 40, tw = 0.6, i = 1, fog = true } = {}) {
  const { THREE, time, pointScale, fogU } = ctx;
  const P = new Float32Array(n * 3), C = new Float32Array(n * 3), S = new Float32Array(n);
  for (let k = 0; k < n; k++) { const p = pos(k), c = col(k); P.set(p, k * 3); C.set(c, k * 3); S[k] = rnd(k + 7, 41); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('aCol', new THREE.BufferAttribute(C, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(S, 1));
  const u = { ...(fog ? fogU() : {}), uTime: time, uScale: pointScale, uSize: { value: size }, uRise: { value: rise }, uSpan: { value: span }, uTw: { value: tw }, uI: { value: i } };
  const m = new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: PTS_VS, fragmentShader: PTS_FS, uniforms: u, fog, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  m.frustumCulled = false; m.renderOrder = 6;
  return { mesh: m, u };
}
export const ring = (i, n, r, y = 0) => { const a = (i / n) * TAU; return [Math.cos(a) * r, y, Math.sin(a) * r]; };
