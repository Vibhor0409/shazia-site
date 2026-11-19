"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ArmForm, Bangle, Studio } from "./Bangle";
import type { Metal } from "@/lib/content";

function Spinner({ children, reduce }: { children: React.ReactNode; reduce: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current && !reduce) g.current.rotation.x += dt * 0.25;
  });
  return <group ref={g}>{children}</group>;
}

/** A draggable bangle on the wrist form, used by Customise and design pages. */
export default function ViewerScene({ metal, extra, reduce }: { metal: Metal; extra: "pave" | "emeralds" | null; reduce: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 30, position: [7, 5, 12] }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      aria-hidden
    >
      <Studio />
      <ArmForm />
      <group position={[0.55, -0.12, 0]} rotation={[0, 0, 0.06]}>
        <Spinner reduce={reduce}>
          <Bangle metal={metal} extra={extra} />
        </Spinner>
      </group>
      <OrbitControls target={[0.5, 0, 0]} enablePan={false} enableZoom={false} minPolarAngle={0.5} maxPolarAngle={2.2} />
    </Canvas>
  );
}
