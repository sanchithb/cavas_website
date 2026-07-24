"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  buildMkzGeometries,
  buildOlliGeometries,
} from "@/lib/hero-geometry";
import { useInViewport, usePrefersReducedMotion } from "@/lib/hooks";
import { MkzSVG, OlliSVG } from "@/components/WireframeSVG";

function VehicleModel({ kind, spin }: { kind: "mkz" | "olli"; spin: boolean }) {
  const group = useRef<THREE.Group>(null);
  const geoms = useMemo(
    () => (kind === "mkz" ? buildMkzGeometries() : buildOlliGeometries()),
    [kind]
  );
  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: kind === "mkz" ? "#7DD3FC" : "#5EEAD4",
        transparent: true,
        opacity: 0.9,
      }),
    [kind]
  );
  useEffect(() => {
    return () => {
      Object.values(geoms).forEach((g) => {
        if (g instanceof THREE.BufferGeometry) g.dispose();
      });
      mat.dispose();
    };
  }, [geoms, mat]);

  useFrame((state, delta) => {
    if (group.current && spin) group.current.rotation.y += delta * 0.25;
  });

  const extras =
    kind === "olli"
      ? [
          (geoms as ReturnType<typeof buildOlliGeometries>).beltRail,
          (geoms as ReturnType<typeof buildOlliGeometries>).roofRail,
        ]
      : [(geoms as ReturnType<typeof buildMkzGeometries>).greenhouse];

  return (
    <group ref={group} rotation={[0.05, -0.6, 0]} position={[0, -0.75, 0]}>
      <lineSegments geometry={geoms.body} material={mat} />
      {extras.map((g, i) => (
        <lineSegments key={i} geometry={g} material={mat} />
      ))}
      {geoms.wheelPositions.map((wp, i) => (
        <lineLoop key={i} geometry={geoms.wheel} material={mat} position={wp} />
      ))}
    </group>
  );
}

/**
 * Small auto-rotating wireframe showpiece. Mounts the canvas only when it
 * nears the viewport, pauses the loop off-screen, and falls back to flat
 * SVG line art under prefers-reduced-motion.
 */
export default function VehicleViewer({ kind }: { kind: "mkz" | "olli" }) {
  const [ref, inView] = useInViewport<HTMLDivElement>("300px");
  const [mounted, setMounted] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (inView) setMounted(true); // mount once, then keep
  }, [inView]);

  return (
    <div ref={ref} className="reticle-cursor relative aspect-[4/3] w-full">
      {reduced ? (
        <div className="flex h-full items-center justify-center">
          {kind === "mkz" ? <MkzSVG className="w-4/5" /> : <OlliSVG className="w-4/5" />}
        </div>
      ) : mounted ? (
        <Canvas
          frameloop={inView ? "always" : "never"}
          dpr={[1, 1.5]}
          camera={{ fov: 40, position: [0, 1.4, 7.2] }}
          gl={{ antialias: true, alpha: true }}
        >
          <VehicleModel kind={kind} spin={inView} />
        </Canvas>
      ) : null}
      {/* corner brackets */}
      <div className="hud-panel pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}
