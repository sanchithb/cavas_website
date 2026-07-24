"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildLidarGeometries,
  buildMkzGeometries,
  buildOlliGeometries,
  buildRoadGeometries,
  buildRsuGeometries,
  buildSimRigGeometries,
  circleGeometry,
  lerp,
  sampleRandomCloud,
  samplePuckPoints,
  sampleTextPoints,
  smoothstep,
} from "@/lib/hero-geometry";

const COUNT = 5200; // hero point-cloud budget — keeps mid-range laptops at 60fps
const STAR_COUNT = 700;

/** Beats 1–6 occupy the first 80% of the pin; the final 20% is the
 *  digital-twin beat, where the whole world collapses into a monitor. */
const WORLD_SPAN = 0.8;

/* Digital-twin beat: final camera pose (head-on at the sim rig) and where
 * the shrunken world lands — the center of the monitor's screen plane. */
const TWIN_CAM_POS: [number, number, number] = [-1.1, 1.55, 6.3];
const TWIN_CAM_LOOK: [number, number, number] = [-1.1, 1.25, 0];
const TWIN_SCREEN: [number, number, number] = [0, 1.6, 0.05];
const TWIN_WORLD_SCALE = 0.042;

/* Scroll-progress camera keyframes: one continuous dolly through beats 1–6
 * (sampled on the compressed 0–1 of WORLD_SPAN). */
const CAM_KEYS: { t: number; p: [number, number, number]; l: [number, number, number] }[] = [
  { t: 0.0, p: [0, 0.5, 10.6], l: [0, 0.5, 0] }, // cold open
  { t: 0.1, p: [0, 0.5, 9.4], l: [0, 0.5, 0] },
  { t: 0.26, p: [0, 0.5, 9.0], l: [0, 0.5, 0] }, // wordmark
  { t: 0.36, p: [1.5, 1.15, 5.6], l: [-1.1, 0.85, 0] }, // LiDAR unit, stage left
  { t: 0.455, p: [1.7, 1.2, 5.8], l: [-1.1, 0.9, 0] },
  { t: 0.58, p: [5.3, 2.15, 8.7], l: [0.2, 0.8, 0] }, // MKZ reveal
  { t: 0.64, p: [5.5, 2.25, 8.9], l: [0.2, 0.8, -0.4] },
  { t: 0.76, p: [3.4, 2.8, 10.8], l: [-1.9, 0.9, -1.5] }, // Olli enters
  { t: 0.82, p: [3.6, 3.0, 11.1], l: [-1.7, 0.9, -1.7] },
  { t: 0.95, p: [9.8, 7.0, 14.0], l: [0.6, 0.3, -2.8] }, // full intersection
  { t: 1.0, p: [10.2, 7.2, 14.3], l: [0.6, 0.3, -2.8] },
];

const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

function sampleCam(p: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  const K = CAM_KEYS;
  let i = 0;
  while (i < K.length - 2 && p > K[i + 1].t) i++;
  const a = K[i];
  const b = K[i + 1];
  const u = smoothstep(a.t, b.t, p);
  outPos.set(lerp(a.p[0], b.p[0], u), lerp(a.p[1], b.p[1], u), lerp(a.p[2], b.p[2], u));
  outLook.set(lerp(a.l[0], b.l[0], u), lerp(a.l[1], b.l[1], u), lerp(a.l[2], b.l[2], u));
}

const LIDAR_STAGE: [number, number, number] = [-2.2, 0.95, 0]; // beat 3 position
const LIDAR_ROOF: [number, number, number] = [0, 1.52, 0]; // on the MKZ roof
const OLLI_POS: [number, number, number] = [-5, 0, -3.6];
const RSU_POS: [number, number, number] = [5, 0, -6.4];

export default function HeroScene({
  progressRef,
}: {
  progressRef: React.MutableRefObject<number>;
}) {
  /* ------------------------- point cloud targets ------------------------- */
  const targets = useMemo(() => {
    const rand = sampleRandomCloud(COUNT);
    // Text target starts as a tighter cloud; refined to real letterforms
    // once fonts are ready (sampleTextPoints fills it in place).
    const text = sampleRandomCloud(COUNT, 6);
    const puck = samplePuckPoints(COUNT, 1.0, 0.72, ...LIDAR_STAGE);
    const phase = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) phase[i] = Math.random() * Math.PI * 2;
    return { rand, text, puck, phase };
  }, []);

  useEffect(() => {
    let alive = true;
    const fill = () => {
      if (!alive) return;
      // Resolve the actual (hashed) next/font family from the document.
      const family = getComputedStyle(document.body).fontFamily;
      sampleTextPoints(targets.text, "CAVAS", 7.2, 0.5, family);
    };
    fill(); // immediate pass with whatever is loaded
    if ("fonts" in document) {
      document.fonts.ready.then(fill); // re-sample with the real display face
    }
    return () => {
      alive = false;
    };
  }, [targets]);

  const pointsGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(targets.rand.slice(), 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("position", attr);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 30); // skip recompute
    return g;
  }, [targets]);

  const starsGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(sampleRandomCloud(STAR_COUNT, 46), 3));
    return g;
  }, []);

  /* ----------------------------- wireframes ----------------------------- */
  const lidar = useMemo(() => buildLidarGeometries(), []);
  const mkz = useMemo(() => buildMkzGeometries(), []);
  const olli = useMemo(() => buildOlliGeometries(), []);
  const rsu = useMemo(() => buildRsuGeometries(), []);
  const road = useMemo(() => buildRoadGeometries(), []);
  const ringGeom = useMemo(() => circleGeometry(1, 64, "xz"), []);
  const haloTicks = useMemo(() => {
    const n = 56;
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      a[i * 3] = Math.cos(t) * 2.3;
      a[i * 3 + 1] = 0;
      a[i * 3 + 2] = Math.sin(t) * 2.3;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(a, 3));
    return g;
  }, []);

  // Planned-trajectory spline ahead of the MKZ (draw-on with scroll).
  const pathGeom = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(2.7, 0.06, 0),
      new THREE.Vector3(7.2, 0.06, 0.15),
      new THREE.Vector3(11.6, 0.06, 1.5)
    );
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
  }, []);

  // V2X links: RSU ↔ MKZ ↔ Olli (line segments + moving packet dots).
  const linkEnds = useMemo(() => {
    const rsuHead = new THREE.Vector3(RSU_POS[0], 3.3, RSU_POS[2]);
    const mkzRoof = new THREE.Vector3(0, 1.55, 0);
    const olliRoof = new THREE.Vector3(OLLI_POS[0], 2.15, OLLI_POS[2]);
    return [
      [rsuHead, mkzRoof],
      [rsuHead, olliRoof],
      [mkzRoof, olliRoof],
    ] as const;
  }, []);
  const linkGeom = useMemo(() => {
    const pos: number[] = [];
    for (const [a, b] of linkEnds) pos.push(a.x, a.y, a.z, b.x, b.y, b.z);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [linkEnds]);
  const packetGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(new Float32Array(9), 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    g.setAttribute("position", attr);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 40);
    return g;
  }, []);

  // Digital-twin sim rig: one merged segment list, drawRange-animated so it
  // assembles stroke-by-stroke. Reuses no new point clouds — line art only.
  const simRig = useMemo(() => buildSimRigGeometries(), []);

  const grid = useMemo(() => {
    const gh = new THREE.GridHelper(48, 24, 0x8b93a1, 0x8b93a1);
    const m = gh.material as THREE.Material;
    m.transparent = true;
    m.opacity = 0;
    gh.position.y = -0.02;
    return gh;
  }, []);

  /* ------------------------------ materials ------------------------------ */
  const mats = useMemo(() => {
    const line = (color: string) =>
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
    return {
      points: new THREE.PointsMaterial({
        color: "#5EEAD4",
        size: 0.045,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
      stars: new THREE.PointsMaterial({
        color: "#8B93A1",
        size: 0.03,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      }),
      lidar: line("#5EEAD4"),
      scanRings: [line("#5EEAD4"), line("#5EEAD4"), line("#5EEAD4")],
      mkz: line("#7DD3FC"),
      path: line("#5EEAD4"),
      road: line("#E8EAED"),
      olli: line("#5EEAD4"),
      halo: line("#38BDF8"),
      haloTicks: new THREE.PointsMaterial({
        color: "#38BDF8",
        size: 0.05,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
      rsu: line("#38BDF8"),
      bcastRings: [line("#38BDF8"), line("#38BDF8")],
      links: line("#38BDF8"),
      packets: new THREE.PointsMaterial({
        color: "#5EEAD4",
        size: 0.16,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
      rig: line("#7DD3FC"),
      sync: line("#5EEAD4"),
    };
  }, []);

  // Dispose GPU resources on unmount.
  useEffect(() => {
    return () => {
      pointsGeom.dispose();
      starsGeom.dispose();
      pathGeom.dispose();
      linkGeom.dispose();
      packetGeom.dispose();
      ringGeom.dispose();
      haloTicks.dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      [lidar.shell, lidar.band, lidar.cap, mkz.body, mkz.greenhouse, mkz.wheel,
        olli.body, olli.beltRail, olli.roofRail, olli.wheel,
        rsu.pole, rsu.head, road.solid, road.dash, simRig.rig, simRig.sync,
      ].forEach((g) => g.dispose());
      Object.values(mats).forEach((m) =>
        Array.isArray(m) ? m.forEach((x) => x.dispose()) : m.dispose()
      );
    };
  }, [pointsGeom, starsGeom, pathGeom, linkGeom, packetGeom, ringGeom, haloTicks, grid, lidar, mkz, olli, rsu, road, simRig, mats]);

  /* -------------------------------- refs -------------------------------- */
  const pointsRef = useRef<THREE.Points>(null);
  const worldGroup = useRef<THREE.Group>(null); // everything that "collapses into the screen"
  const lidarGroup = useRef<THREE.Group>(null);
  const scanRingRefs = useRef<(THREE.LineLoop | null)[]>([]);
  const bcastRingRefs = useRef<(THREE.LineLoop | null)[]>([]);
  const olliGroup = useRef<THREE.Group>(null);
  const haloGroup = useRef<THREE.Group>(null);

  const pathLine = useMemo(() => new THREE.Line(pathGeom, mats.path), [pathGeom, mats]);

  /* ------------------------------ animation ------------------------------ */
  useFrame((state) => {
    const praw = progressRef.current;
    // Beats 1–6 run on the compressed 0–1; the twin beat uses raw progress.
    const p = Math.min(1, praw / WORLD_SPAN);
    const t = state.clock.elapsedTime;
    const { rand, text, puck, phase } = targets;
    const t7 = smoothstep(0.8, 0.93, praw); // world → screen collapse

    /* Camera: continuous dolly with a whisper of idle drift; in the twin
       beat it blends to a head-on pose while the FOV narrows slightly —
       a gentle dolly-zoom that "flattens" the world into displayed content. */
    sampleCam(p, _pos, _look);
    _pos.x = lerp(_pos.x, TWIN_CAM_POS[0], t7) + Math.sin(t * 0.22) * 0.04;
    _pos.y = lerp(_pos.y, TWIN_CAM_POS[1], t7) + Math.cos(t * 0.18) * 0.03;
    _pos.z = lerp(_pos.z, TWIN_CAM_POS[2], t7);
    _look.set(
      lerp(_look.x, TWIN_CAM_LOOK[0], t7),
      lerp(_look.y, TWIN_CAM_LOOK[1], t7),
      lerp(_look.z, TWIN_CAM_LOOK[2], t7)
    );
    state.camera.position.copy(_pos);
    state.camera.lookAt(_look);
    const cam = state.camera as THREE.PerspectiveCamera;
    const fov = 48 - 9 * t7;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    /* Digital twin: the whole physical world shrinks into the monitor's
       screen plane — still live (rings pulsing, packets moving), with a
       slow idle yaw so it reads as a running simulation, not a screenshot. */
    if (worldGroup.current) {
      const s = lerp(1, TWIN_WORLD_SCALE, t7);
      worldGroup.current.scale.setScalar(s);
      worldGroup.current.position.set(
        TWIN_SCREEN[0] * t7,
        TWIN_SCREEN[1] * t7,
        TWIN_SCREEN[2] * t7
      );
      worldGroup.current.rotation.y = t7 * Math.sin(t * 0.25) * 0.18;
    }

    /* Sim rig assembles stroke-by-stroke (drawRange in whole segments). */
    const rigDraw = smoothstep(0.82, 0.95, praw);
    simRig.rig.setDrawRange(0, Math.floor((simRig.rigVertexCount * rigDraw) / 2) * 2);
    mats.rig.opacity = smoothstep(0.81, 0.845, praw) * 0.95;
    const syncIn = smoothstep(0.92, 0.955, praw);
    mats.sync.opacity = syncIn * (0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * 2.2)));

    /* Point cloud: flicker in → CAVAS letterforms → LiDAR puck → fade out.
       Skip the per-point work entirely once the cloud has fully faded. */
    const wText = smoothstep(0.1, 0.235, p);
    const wPuck = smoothstep(0.27, 0.36, p);
    const cloudAlive = p < 0.44;
    const attr = pointsGeom.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const driftAmp = (1 - wText) * 0.22 + (1 - wPuck) * 0.02;
    for (let i = 0; cloudAlive && i < COUNT; i++) {
      const i3 = i * 3;
      const ph = phase[i];
      let x = lerp(rand[i3], text[i3], wText);
      let y = lerp(rand[i3 + 1], text[i3 + 1], wText);
      let z = lerp(rand[i3 + 2], text[i3 + 2], wText);
      x = lerp(x, puck[i3], wPuck);
      y = lerp(y, puck[i3 + 1], wPuck);
      z = lerp(z, puck[i3 + 2], wPuck);
      arr[i3] = x + Math.sin(t * 0.6 + ph) * driftAmp;
      arr[i3 + 1] = y + Math.cos(t * 0.5 + ph * 1.3) * driftAmp;
      arr[i3 + 2] = z + Math.sin(t * 0.4 + ph * 0.7) * driftAmp * 0.6;
    }
    if (cloudAlive) attr.needsUpdate = true;
    // Cold open: points accumulate with time first, then with scroll.
    const frac = Math.min(1, smoothstep(0.4, 3.4, t) * 0.08 + smoothstep(0.02, 0.16, p));
    pointsGeom.setDrawRange(0, Math.floor(COUNT * frac));
    // Hand off from point cloud to wireframe just as the puck converges.
    mats.points.opacity = 0.9 * (1 - smoothstep(0.355, 0.43, p));
    mats.points.size = lerp(lerp(0.05, 0.036, wText), 0.028, wPuck);

    /* LiDAR unit: fade in stage left, then shrink onto the MKZ roof. */
    const lidarIn = smoothstep(0.295, 0.385, p);
    mats.lidar.opacity = lidarIn * 0.95;
    const move = smoothstep(0.455, 0.555, p);
    if (lidarGroup.current) {
      lidarGroup.current.position.set(
        lerp(LIDAR_STAGE[0], LIDAR_ROOF[0], move),
        lerp(LIDAR_STAGE[1], LIDAR_ROOF[1], move),
        lerp(LIDAR_STAGE[2], LIDAR_ROOF[2], move)
      );
      const s = lerp(1, 0.32, move);
      lidarGroup.current.scale.setScalar(s);
      lidarGroup.current.rotation.y = t * 1.3;
    }
    // Concentric scan pulses radiating from the sensor.
    for (let i = 0; i < 3; i++) {
      const ring = scanRingRefs.current[i];
      if (!ring) continue;
      const s = (t * 0.32 + i / 3) % 1;
      ring.scale.setScalar(lerp(0.6, 6.5, s));
      mats.scanRings[i].opacity = lidarIn * (1 - s) * 0.5;
    }

    /* Lincoln MKZ + road + planned trajectory. */
    const mkzIn = smoothstep(0.455, 0.555, p);
    mats.mkz.opacity = mkzIn * 0.95;
    mats.road.opacity = mkzIn * 0.16;
    (grid.material as THREE.Material).opacity = mkzIn * 0.05;
    const pathDraw = smoothstep(0.52, 0.66, p);
    pathGeom.setDrawRange(0, Math.max(0, Math.floor(81 * pathDraw)));
    mats.path.opacity = smoothstep(0.52, 0.58, p) * 0.8 * (1 - smoothstep(0.93, 1, p));

    /* Olli rolls into the adjacent lane. */
    const olliIn = smoothstep(0.615, 0.72, p);
    mats.olli.opacity = smoothstep(0.615, 0.665, p) * 0.95;
    if (olliGroup.current) {
      olliGroup.current.position.set(lerp(-15, OLLI_POS[0], olliIn), OLLI_POS[1], OLLI_POS[2]);
    }
    const haloIn = smoothstep(0.665, 0.725, p);
    mats.halo.opacity = haloIn * 0.35;
    mats.haloTicks.opacity = haloIn * 0.85;
    if (haloGroup.current) haloGroup.current.rotation.y = t * 0.45;

    /* RSU + V2X broadcast + packet traffic. */
    const rsuIn = smoothstep(0.815, 0.885, p);
    mats.rsu.opacity = rsuIn * 0.95;
    for (let i = 0; i < 2; i++) {
      const ring = bcastRingRefs.current[i];
      if (!ring) continue;
      const s = (t * 0.28 + i * 0.5) % 1;
      ring.scale.setScalar(lerp(0.4, 7.5, s));
      mats.bcastRings[i].opacity = rsuIn * (1 - s) * 0.45;
    }
    const pk = smoothstep(0.85, 0.9, p);
    mats.links.opacity = pk * 0.2;
    mats.packets.opacity = pk;
    if (pk > 0) {
      const pAttr = packetGeom.getAttribute("position") as THREE.BufferAttribute;
      for (let j = 0; j < 3; j++) {
        const [a, b] = linkEnds[j];
        const u = (t * 0.26 + j * 0.37) % 1;
        pAttr.setXYZ(j, lerp(a.x, b.x, u), lerp(a.y, b.y, u), lerp(a.z, b.z, u));
      }
      pAttr.needsUpdate = true;
    }
  });

  /* -------------------------------- scene -------------------------------- */
  return (
    <>
      <fog attach="fog" args={["#0A0B0D", 16, 52]} />

      {/* ambient depth points — stay outside the collapsing world */}
      <points geometry={starsGeom} material={mats.stars} />

      {/* Everything physical lives in worldGroup: in the digital-twin beat
          it shrinks into the sim rig's monitor while still animating live. */}
      <group ref={worldGroup}>
      {/* the morphing LiDAR return cloud */}
      <points ref={pointsRef} geometry={pointsGeom} material={mats.points} />

      {/* LiDAR unit (Ouster-style puck) + scan pulses */}
      <group ref={lidarGroup} position={LIDAR_STAGE}>
        <lineSegments geometry={lidar.shell} material={mats.lidar} />
        {lidar.bandYs.map((y, i) => (
          <lineLoop key={i} geometry={lidar.band} material={mats.lidar} position={[0, y, 0]} />
        ))}
        <lineLoop geometry={lidar.cap} material={mats.lidar} position={[0, lidar.capY, 0]} />
        {mats.scanRings.map((m, i) => (
          <lineLoop
            key={i}
            ref={(el) => {
              scanRingRefs.current[i] = el as THREE.LineLoop | null;
            }}
            geometry={ringGeom}
            material={m}
          />
        ))}
      </group>

      {/* Lincoln MKZ wireframe */}
      <group>
        <lineSegments geometry={mkz.body} material={mats.mkz} />
        <lineSegments geometry={mkz.greenhouse} material={mats.mkz} />
        {mkz.wheelPositions.map((wp, i) => (
          <lineLoop key={i} geometry={mkz.wheel} material={mats.mkz} position={wp} />
        ))}
      </group>

      {/* planned trajectory */}
      <primitive object={pathLine} />

      {/* road + ground grid */}
      <lineSegments geometry={road.solid} material={mats.road} />
      <lineSegments geometry={road.dash} material={mats.road} />
      <primitive object={grid} />

      {/* Olli shuttle + 360° sensor halo */}
      <group ref={olliGroup} position={OLLI_POS}>
        <lineSegments geometry={olli.body} material={mats.olli} />
        <lineSegments geometry={olli.beltRail} material={mats.olli} />
        <lineSegments geometry={olli.roofRail} material={mats.olli} />
        {olli.wheelPositions.map((wp, i) => (
          <lineLoop key={i} geometry={olli.wheel} material={mats.olli} position={wp} />
        ))}
        <group ref={haloGroup} position={[0, 1.35, 0]}>
          <lineLoop geometry={circleFromCache()} material={mats.halo} />
          <points geometry={haloTicks} material={mats.haloTicks} />
        </group>
      </group>

      {/* RSU mast + V2X broadcast rings */}
      <group position={RSU_POS}>
        <lineSegments geometry={rsu.pole} material={mats.rsu} />
        <lineSegments geometry={rsu.head} material={mats.rsu} position={[0, rsu.headY, 0]} />
        {mats.bcastRings.map((m, i) => (
          <lineLoop
            key={i}
            ref={(el) => {
              bcastRingRefs.current[i] = el as THREE.LineLoop | null;
            }}
            geometry={ringGeom}
            material={m}
            position={[0, rsu.headY, 0]}
          />
        ))}
      </group>

      {/* V2X packet traffic */}
      <lineSegments geometry={linkGeom} material={mats.links} />
      <points geometry={packetGeom} material={mats.packets} />
      </group>

      {/* Digital-twin sim rig: monitor + desk + wheel + pedals + gauges,
          drawn on stroke-by-stroke via drawRange. Fixed in front of the
          final camera pose; the world lands on its screen plane. */}
      <lineSegments geometry={simRig.rig} material={mats.rig} />
      <lineSegments geometry={simRig.sync} material={mats.sync} />
    </>
  );
}

/* Shared unit halo circle (r=2.3, flat) — cached across renders. */
let _haloCircle: THREE.BufferGeometry | null = null;
function circleFromCache() {
  if (!_haloCircle) _haloCircle = circleGeometry(2.3, 72, "xz");
  return _haloCircle;
}
