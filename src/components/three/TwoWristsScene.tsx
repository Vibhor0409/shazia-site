"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ArmForm, Bangle, Studio } from "./Bangle";
import { bandGeometry } from "@/lib/bangle";

/** A generic sports tracker: a wide matte strap with a sensor pod on top. No brand marks. */
function SportsBand() {
  const strap = useMemo(() => bandGeometry(2.1, 0.32, 0.12, 160), []);
  return (
    <group>
      <mesh geometry={strap}>
        <meshStandardMaterial color="#45545a" roughness={0.85} metalness={0} />
      </mesh>
      <mesh position={[0, 2.42 + 0.32 + 0.22, 0]}>
        <boxGeometry args={[2.3, 0.44, 3.0]} />
        <meshStandardMaterial color="#3a484e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.42 + 0.32 + 0.45, 0]}>
        <boxGeometry args={[1.9, 0.04, 2.5]} />
        <meshStandardMaterial color="#56666c" roughness={0.4} />
      </mesh>
    </group>
  );
}

function Sway({ children, phase, reduce }: { children: React.ReactNode; phase: number; reduce: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current && !reduce) g.current.rotation.x = 0.18 * Math.sin(clock.elapsedTime * 0.5 + phase);
  });
  return <group ref={g}>{children}</group>;
}

/** Two wrists side by side: the tracker people take off, and Sházia. */
export default function TwoWristsScene({ reduce }: { reduce: boolean }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 32, position: [2, 21, 26] }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      onCreated={({ camera }) => camera.lookAt(-2.4, 0, 0.4)}
      aria-hidden
    >
      <Studio />
      <group position={[0, 0, -5.8]}>
        <ArmForm />
        <group position={[0.4, -0.2, 0]}>
          <Sway phase={0} reduce={reduce}>
            <SportsBand />
          </Sway>
        </group>
      </group>
      <group position={[0, 0, 5.8]}>
        <ArmForm />
        <group position={[0.55, -0.12, 0]} rotation={[0, 0, 0.06]}>
          <Sway phase={1.4} reduce={reduce}>
            <Bangle metal="yellow" extra={null} />
          </Sway>
        </group>
      </group>
    </Canvas>
  );
}
