import * as THREE from "three";

/**
 * Procedural line-art geometry for the CAVAS visual system.
 * Everything on the site — hero sequence and vehicle showcases — is built
 * from these stylized wireframes so the whole page reads as one system.
 * All vehicles face +X.
 */

export type Pt2 = [number, number];

/* ------------------------------------------------------------------ */
/* Side profiles (x = length, y = height). Stylized, not photoreal.   */
/* ------------------------------------------------------------------ */

// Lincoln MKZ sedan silhouette.
export const MKZ_PROFILE: Pt2[] = [
  [-2.35, 0.4],
  [-2.44, 0.74],
  [-2.28, 0.94],
  [-1.42, 1.04],
  [-0.72, 1.36],
  [0.42, 1.38],
  [1.08, 1.04],
  [2.02, 0.9],
  [2.42, 0.74],
  [2.48, 0.44],
  [2.1, 0.32],
  [-2.05, 0.32],
];

// MKZ greenhouse (open polyline — window line).
export const MKZ_GREENHOUSE: Pt2[] = [
  [-1.3, 1.04],
  [-0.68, 1.31],
  [0.38, 1.33],
  [0.98, 1.04],
];

// Olli shuttle: boxy, tall, rounded corners, symmetric front/rear.
function roundedBoxProfile(
  hw: number,
  yBottom: number,
  yTop: number,
  r: number,
  cornerSegs = 4
): Pt2[] {
  const pts: Pt2[] = [];
  const corner = (cx: number, cy: number, a0: number, a1: number) => {
    for (let i = 0; i <= cornerSegs; i++) {
      const a = a0 + ((a1 - a0) * i) / cornerSegs;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  };
  corner(hw - r, yTop - r, 0, Math.PI / 2); // front-top
  corner(-hw + r, yTop - r, Math.PI / 2, Math.PI); // rear-top
  corner(-hw + r, yBottom + r, Math.PI, Math.PI * 1.5); // rear-bottom
  corner(hw - r, yBottom + r, Math.PI * 1.5, Math.PI * 2); // front-bottom
  return pts;
}

export const OLLI_PROFILE: Pt2[] = roundedBoxProfile(1.62, 0.34, 2.1, 0.5);

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

/** Extrudes a 2D profile into a wireframe body: both side outlines plus
 *  cross-connectors at each vertex. Returns LineSegments geometry. */
export function extrudeProfile(
  profile: Pt2[],
  halfWidth: number,
  closed = true,
  connectEvery = 1
): THREE.BufferGeometry {
  const pos: number[] = [];
  const n = profile.length;
  const lim = closed ? n : n - 1;
  for (const z of [halfWidth, -halfWidth]) {
    for (let i = 0; i < lim; i++) {
      const a = profile[i];
      const b = profile[(i + 1) % n];
      pos.push(a[0], a[1], z, b[0], b[1], z);
    }
  }
  for (let i = 0; i < n; i += connectEvery) {
    const a = profile[i];
    pos.push(a[0], a[1], halfWidth, a[0], a[1], -halfWidth);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

/** Circle as a line loop. plane: 'xy' faces the camera-ish, 'xz' lies flat. */
export function circleGeometry(
  r: number,
  segments = 48,
  plane: "xy" | "xz" = "xy"
): THREE.BufferGeometry {
  const pos: number[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    if (plane === "xy") pos.push(Math.cos(a) * r, Math.sin(a) * r, 0);
    else pos.push(Math.cos(a) * r, 0, Math.sin(a) * r);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

/** Straight polyline geometry (for THREE.Line). */
export function polylineGeometry(points: THREE.Vector3[]): THREE.BufferGeometry {
  return new THREE.BufferGeometry().setFromPoints(points);
}

/** Full wireframe MKZ: body + greenhouse + wheels, as one group recipe.
 *  Returned as separate geometries so callers control materials. */
export function buildMkzGeometries() {
  return {
    body: extrudeProfile(MKZ_PROFILE, 0.85),
    greenhouse: extrudeProfile(MKZ_GREENHOUSE, 0.78, false),
    wheel: circleGeometry(0.36, 28, "xy"),
    wheelPositions: [
      [1.52, 0.36, 0.86],
      [1.52, 0.36, -0.86],
      [-1.52, 0.36, 0.86],
      [-1.52, 0.36, -0.86],
    ] as [number, number, number][],
  };
}

/** Full wireframe Olli shuttle. */
export function buildOlliGeometries() {
  const rail = (y: number): Pt2[] => [
    [-1.58, y],
    [1.58, y],
  ];
  return {
    body: extrudeProfile(OLLI_PROFILE, 0.78, true, 2),
    beltRail: extrudeProfile(rail(1.05), 0.79, false),
    roofRail: extrudeProfile(rail(1.78), 0.79, false),
    wheel: circleGeometry(0.26, 24, "xy"),
    wheelPositions: [
      [0.95, 0.26, 0.8],
      [0.95, 0.26, -0.8],
      [-0.95, 0.26, 0.8],
      [-0.95, 0.26, -0.8],
    ] as [number, number, number][],
  };
}

/** LiDAR puck (visual nod to an Ouster OS2-128): cylinder edges + beam bands. */
export function buildLidarGeometries(r = 1.0, h = 0.72) {
  const cyl = new THREE.CylinderGeometry(r, r, h, 20, 1, false);
  const edges = new THREE.EdgesGeometry(cyl, 12);
  cyl.dispose();
  return {
    shell: edges as THREE.BufferGeometry,
    band: circleGeometry(r * 1.002, 48, "xz"), // horizontal beam bands
    bandYs: [-h * 0.25, 0, h * 0.25],
    cap: circleGeometry(r * 0.55, 32, "xz"),
    capY: h / 2 + 0.001,
  };
}

/** RSU mast: pole + head box edges. */
export function buildRsuGeometries() {
  const box = new THREE.BoxGeometry(0.36, 0.5, 0.36);
  const head = new THREE.EdgesGeometry(box);
  box.dispose();
  const pole = new THREE.BufferGeometry();
  pole.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([0, 0, 0, 0, 3.3, 0], 3)
  );
  return { pole, head: head as THREE.BufferGeometry, headY: 3.3 };
}

/** Driving-simulator rig for the digital-twin beat: monitor + desk +
 *  steering wheel + pedals + side gauge cluster, as ONE merged segment
 *  list ordered in build sequence — so animating drawRange makes the rig
 *  assemble stroke-by-stroke. Monitor screen center sits at (0, 1.6, 0). */
export function buildSimRigGeometries() {
  const segs: number[] = [];
  type V3 = [number, number, number];
  const S = (a: V3, b: V3) => segs.push(...a, ...b);
  const rectXY = (cx: number, cy: number, w: number, h: number, z: number) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2;
    S([x0, y0, z], [x1, y0, z]);
    S([x1, y0, z], [x1, y1, z]);
    S([x1, y1, z], [x0, y1, z]);
    S([x0, y1, z], [x0, y0, z]);
  };
  const rectXZ = (cx: number, cz: number, w: number, d: number, y: number) => {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;
    S([x0, y, z0], [x1, y, z0]);
    S([x1, y, z0], [x1, y, z1]);
    S([x1, y, z1], [x0, y, z1]);
    S([x0, y, z1], [x0, y, z0]);
  };

  // 1 — monitor bezel: front + back frames with corner connectors.
  rectXY(0, 1.6, 2.3, 1.35, 0.03);
  rectXY(0, 1.6, 2.3, 1.35, -0.06);
  for (const sx of [-1, 1])
    for (const sy of [-1, 1])
      S([sx * 1.15, 1.6 + sy * 0.675, 0.03], [sx * 1.15, 1.6 + sy * 0.675, -0.06]);
  // 2 — screen inner rect (the "display surface" the world collapses into).
  rectXY(0, 1.6, 2.12, 1.17, 0.035);
  // 3 — stand + base plate.
  S([0, 0.925, -0.02], [0, 0.78, -0.02]);
  rectXZ(0, 0.02, 0.7, 0.3, 0.781);
  // 4 — desk top + legs.
  rectXZ(0, 0.25, 3.0, 1.5, 0.78);
  for (const sx of [-1, 1]) {
    S([sx * 1.5, 0.78, -0.5], [sx * 1.5, 0, -0.5]);
    S([sx * 1.5, 0.78, 1.0], [sx * 1.5, 0, 1.0]);
  }
  // 5 — steering wheel: tilted rim + three spokes + column.
  const wc: V3 = [0, 1.06, 0.7];
  const tilt = -0.55;
  const wp = (a: number, r: number): V3 => {
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    const y2 = y * Math.cos(tilt);
    const z2 = y * Math.sin(tilt);
    return [wc[0] + x, wc[1] + y2, wc[2] + z2];
  };
  const WSEG = 24;
  for (let i = 0; i < WSEG; i++)
    S(wp((i / WSEG) * Math.PI * 2, 0.24), wp(((i + 1) / WSEG) * Math.PI * 2, 0.24));
  for (const a of [Math.PI / 2, Math.PI * 7 / 6, Math.PI * 11 / 6])
    S(wp(a, 0.05), wp(a, 0.21));
  S([0, 0.98, 0.62], [0, 0.78, 0.5]); // column to desk
  // 6 — pedals: two tilted plates on the floor.
  const pedal = (cx: number) => {
    const pt = -0.6; // tilt about X
    const c: V3 = [cx, 0.16, 1.18];
    const pp = (lx: number, ly: number): V3 => [
      c[0] + lx,
      c[1] + ly * Math.cos(pt),
      c[2] + ly * Math.sin(pt),
    ];
    const w = 0.07, h = 0.11;
    S(pp(-w, -h), pp(w, -h));
    S(pp(w, -h), pp(w, h));
    S(pp(w, h), pp(-w, h));
    S(pp(-w, h), pp(-w, -h));
    S([c[0], 0.02, 1.22], pp(0, -h)); // floor mount
  };
  pedal(0.16);
  pedal(-0.14);
  // 7 — side gauge cluster: small angled panel with two dial circles.
  const gc: V3 = [1.55, 1.3, 0.18];
  const ry = -0.45;
  const gp = (lx: number, ly: number): V3 => [
    gc[0] + lx * Math.cos(ry),
    gc[1] + ly,
    gc[2] + lx * Math.sin(ry),
  ];
  const gw = 0.62, gh = 0.4;
  S(gp(-gw / 2, -gh / 2), gp(gw / 2, -gh / 2));
  S(gp(gw / 2, -gh / 2), gp(gw / 2, gh / 2));
  S(gp(gw / 2, gh / 2), gp(-gw / 2, gh / 2));
  S(gp(-gw / 2, gh / 2), gp(-gw / 2, -gh / 2));
  S(gp(0, gh / 2 + 0.02), gp(0, gh / 2 + 0.02 - 0.001)); // hairline tick
  S([gc[0], 1.1, gc[2]], [1.45, 0.78, 0.15]); // gauge stand to desk
  const GSEG = 16;
  for (const dx of [-0.16, 0.16]) {
    for (let i = 0; i < GSEG; i++) {
      const a0 = (i / GSEG) * Math.PI * 2;
      const a1 = ((i + 1) / GSEG) * Math.PI * 2;
      S(
        gp(dx + Math.cos(a0) * 0.1, Math.sin(a0) * 0.1),
        gp(dx + Math.cos(a1) * 0.1, Math.sin(a1) * 0.1)
      );
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(segs, 3));

  // Sync link: thin leader line from the screen's top-right corner —
  // pulsed separately to state PHYSICAL ↔ VIRTUAL without extra text in 3D.
  const sync = new THREE.BufferGeometry();
  sync.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [1.18, 2.1, 0, 1.6, 2.52, 0, 1.6, 2.52, 0, 2.15, 2.52, 0],
      3
    )
  );

  return { rig: g, rigVertexCount: segs.length / 3, sync };
}

/** Road: main corridor along X with a crossing street — line art only.
 *  MKZ lane centered z=0, Olli lane centered z=-3.6. */
export function buildRoadGeometries() {
  const solid: number[] = [];
  const seg = (a: [number, number, number], b: [number, number, number]) =>
    solid.push(...a, ...b);

  // Main road edges.
  seg([-18, 0, 1.9], [18, 0, 1.9]);
  seg([-18, 0, -5.5], [18, 0, -5.5]);
  // Crossing street at x ≈ 10.5.
  seg([9.2, 0, -14], [9.2, 0, 6]);
  seg([12.4, 0, -14], [12.4, 0, 6]);

  // Dashed lane divider between the two lanes.
  const dash: number[] = [];
  for (let x = -18; x < 18; x += 1.6) {
    dash.push(x, 0, -1.8, x + 0.85, 0, -1.8);
  }

  const solidG = new THREE.BufferGeometry();
  solidG.setAttribute("position", new THREE.Float32BufferAttribute(solid, 3));
  const dashG = new THREE.BufferGeometry();
  dashG.setAttribute("position", new THREE.Float32BufferAttribute(dash, 3));
  return { solid: solidG, dash: dashG };
}

/* ------------------------------------------------------------------ */
/* Point-cloud samplers for the hero particle morph                    */
/* ------------------------------------------------------------------ */

/** Sparse ambient cloud, ellipsoid-ish scatter. */
export function sampleRandomCloud(count: number, spread = 13): Float32Array {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    a[i * 3] = (Math.random() - 0.5) * spread * 1.6;
    a[i * 3 + 1] = (Math.random() - 0.35) * spread * 0.7;
    a[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.8;
  }
  return a;
}

/** Samples pixel positions of rendered text into world-space points.
 *  Client-only (uses a 2D canvas). Fills `out` in place. */
export function sampleTextPoints(
  out: Float32Array,
  text: string,
  worldWidth = 7.2,
  centerY = 0.5,
  fontFamily?: string
): void {
  const count = out.length / 3;
  const cw = 960;
  const ch = 240;
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#fff";
  // NOTE: ctx.font cannot parse CSS var() — resolve the real family name
  // (next/font registers a hashed family) from computed styles upstream.
  const family = fontFamily || "Arial, sans-serif";
  ctx.font = `700 168px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cw / 2, ch / 2 + 6);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const px: number[] = [];
  for (let y = 0; y < ch; y += 2) {
    for (let x = 0; x < cw; x += 2) {
      if (data[(y * cw + x) * 4 + 3] > 120) px.push(x, y);
    }
  }
  if (px.length < 4) return;
  const scale = worldWidth / cw;
  for (let i = 0; i < count; i++) {
    const k = (Math.floor(Math.random() * (px.length / 2)) | 0) * 2;
    out[i * 3] = (px[k] - cw / 2) * scale + (Math.random() - 0.5) * 0.03;
    out[i * 3 + 1] =
      (ch / 2 - px[k + 1]) * scale + centerY + (Math.random() - 0.5) * 0.03;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.22;
  }
}

/** Samples the surface of the LiDAR puck (offset to stage-left position). */
export function samplePuckPoints(
  count: number,
  r = 1.0,
  h = 0.72,
  cx = -2.2,
  cy = 0.95,
  cz = 0
): Float32Array {
  const a = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let x: number, y: number, z: number;
    if (roll < 0.72) {
      // lateral surface
      const t = Math.random() * Math.PI * 2;
      x = Math.cos(t) * r;
      z = Math.sin(t) * r;
      y = (Math.random() - 0.5) * h;
    } else {
      // top / bottom discs
      const t = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * r;
      x = Math.cos(t) * rr;
      z = Math.sin(t) * rr;
      y = roll < 0.9 ? h / 2 : -h / 2;
    }
    a[i * 3] = x + cx;
    a[i * 3 + 1] = y + cy;
    a[i * 3 + 2] = z + cz;
  }
  return a;
}

/* ------------------------------------------------------------------ */
/* Math helpers                                                        */
/* ------------------------------------------------------------------ */

export function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
