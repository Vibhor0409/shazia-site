import * as THREE from "three";

/** Bangle dimensions in scene units (roughly cm). Inner oval semi-axes, band width and depth. */
export const B = 2.42;
export const A = 3.0;
export const W = 0.67;
export const T = 0.45;
const RR = 0.14;

export function ringPoint(th: number) {
  return new THREE.Vector3(0, B * Math.sin(th), A * Math.cos(th));
}
export function ringNormal(th: number) {
  return new THREE.Vector3(0, Math.sin(th) / B, Math.cos(th) / A).normalize();
}

/** A rounded-rectangle profile swept round the inner oval: the band itself. */
export function bandGeometry(w = W, t = T, rr = RR, segments = 240) {
  const RR_ = rr;
  const seg = 6;
  const hw = w / 2;
  const corners: [number, number, number][] = [
    [hw - RR_, t - RR_, 0],
    [-hw + RR_, t - RR_, Math.PI / 2],
    [-hw + RR_, RR_, Math.PI],
    [hw - RR_, RR_, 1.5 * Math.PI],
  ];
  const P: [number, number][] = [];
  for (const [cs, cr, a0] of corners)
    for (let k = 0; k <= seg; k++) {
      const a = a0 + (k / seg) * (Math.PI / 2);
      P.push([cs + RR_ * Math.cos(a), cr + RR_ * Math.sin(a)]);
    }
  const N = segments;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i < N; i++) {
    const th = (i / N) * Math.PI * 2;
    const c = ringPoint(th);
    const n = ringNormal(th);
    for (const [s, r] of P) pos.push(s, c.y + n.y * r, c.z + n.z * r);
  }
  const M = P.length;
  for (let i = 0; i < N; i++)
    for (let j = 0; j < M; j++) {
      const a = i * M + j;
      const b = ((i + 1) % N) * M + j;
      const c = ((i + 1) % N) * M + ((j + 1) % M);
      const d = i * M + ((j + 1) % M);
      idx.push(a, b, d, b, c, d);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** The display arm: a matte ceramic form like a jeweller's bracelet stand. Wrist at x = 0. */
export function armGeometry() {
  const R = (x: number) => {
    if (x < 0) return 2.3 + 0.05 * Math.pow(-x, 1.15);
    if (x < 2.4) return 2.3 + 0.22 * Math.sin((x / 2.4) * (Math.PI / 2));
    const t = (x - 2.4) / 1.6;
    return 2.52 * Math.sqrt(Math.max(0, 1 - t * t));
  };
  const prof: THREE.Vector2[] = [];
  for (let i = 0; i <= 80; i++) {
    const x = -12 + (16 * i) / 80;
    prof.push(new THREE.Vector2(Math.max(R(Math.min(x, 3.999)), 0.001), x));
  }
  const g = new THREE.LatheGeometry(prof, 96);
  g.rotateZ(-Math.PI / 2);
  g.scale(1, 1, 1.24);
  return g;
}

export function onOuter(th: number, lift: number) {
  const p = ringPoint(th);
  const n = ringNormal(th);
  return { p: p.addScaledVector(n, T + lift), n };
}

export const GOLD = { yellow: "#f0cd85", rose: "#f2bda5" } as const;

/**
 * A thin curved strip that follows the inner oval, used for the parts inside the band:
 * the flex circuit and the curved battery cells. r0 = distance out from the inner wall.
 */
export function arcStrip(r0: number, depth: number, width: number, th0: number, th1: number, seg = 120) {
  const pos: number[] = [];
  const idx: number[] = [];
  const corners: [number, number][] = [
    [width / 2, r0],
    [width / 2, r0 + depth],
    [-width / 2, r0 + depth],
    [-width / 2, r0],
  ];
  for (let i = 0; i <= seg; i++) {
    const th = th0 + ((th1 - th0) * i) / seg;
    const c = ringPoint(th);
    const n = ringNormal(th);
    for (const [s, r] of corners) pos.push(s, c.y + n.y * r, c.z + n.z * r);
  }
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < 4; j++) {
      const a = i * 4 + j;
      const b = (i + 1) * 4 + j;
      const c = (i + 1) * 4 + ((j + 1) % 4);
      const d = i * 4 + ((j + 1) % 4);
      idx.push(a, b, d, b, c, d);
    }
  // end caps
  const last = seg * 4;
  idx.push(0, 1, 2, 0, 2, 3, last, last + 2, last + 1, last, last + 3, last + 2);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Arc length of the flex circuit is 12.57 cm, centred under the wrist at 6 o'clock. */
export const FLEX_SPAN = 2.32; // radians, about 12.6 cm along the inner oval
