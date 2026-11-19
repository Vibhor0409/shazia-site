"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { A, B, FLEX_SPAN, GOLD, T, W, arcStrip, armGeometry, bandGeometry, onOuter, ringNormal, ringPoint } from "@/lib/bangle";
import type { Metal } from "@/lib/content";

export type AnchorKey = "sensor" | "contacts" | "hinge" | "flex" | "battery" | "chip";
export type Anchors = Partial<Record<AnchorKey, THREE.Object3D | null>>;

/** Studio lighting: a generated room environment for gold reflections, plus key and rim lights. */
export function Studio() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return (
    <>
      <directionalLight position={[6, 10, 8]} intensity={1.8} color="#fff4e6" />
      <directionalLight position={[-8, 4, -6]} intensity={1.1} color="#e8fbf6" />
      <hemisphereLight args={["#f2faf8", "#a9c8c2", 0.7]} />
    </>
  );
}

export function ArmForm() {
  const geo = useMemo(() => armGeometry(), []);
  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial color="#aec7c1" roughness={0.9} envMapIntensity={0.25} sheen={0.4} sheenColor="#ffffff" sheenRoughness={0.8} />
    </mesh>
  );
}

function goldMaterial(metal: Metal) {
  return new THREE.MeshPhysicalMaterial({
    color: GOLD[metal],
    metalness: 1,
    roughness: 0.16,
    envMapIntensity: 3.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.15,
  });
}

export function Bangle({
  metal,
  extra,
  anchors,
  xray,
}: {
  metal: Metal;
  extra: "pave" | "emeralds" | null;
  anchors?: RefObject<Anchors>;
  /** 0 = solid gold, 1 = see-through band with the electronics showing */
  xray?: RefObject<number>;
}) {
  const band = useMemo(() => bandGeometry(), []);
  const gold = useMemo(() => goldMaterial(metal), [metal]);
  useEffect(() => () => gold.dispose(), [gold]);

  const contacts = useMemo(
    () =>
      [-0.32, 0.32].map((d) => {
        const th = -Math.PI / 2 + d;
        const p = ringPoint(th);
        const n = ringNormal(th);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n.clone().negate());
        return { p: p.addScaledVector(n, -0.005), q };
      }),
    [],
  );

  const pave = useMemo(() => {
    const out: { p: THREE.Vector3; q: THREE.Quaternion }[] = [];
    for (let i = 0; i <= 26; i++)
      for (const s of [-0.2, 0, 0.2]) {
        const th = Math.PI * 0.18 + (i / 26) * Math.PI * 0.64;
        const { p, n } = onOuter(th, 0.04);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
        out.push({ p: new THREE.Vector3(s, p.y, p.z), q });
      }
    return out;
  }, []);

  const emeralds = useMemo(
    () =>
      Array.from({ length: 9 }, (_, k) => {
        const i = k - 4;
        const size = 1 - Math.abs(i) * 0.11;
        const { p, n } = onOuter(Math.PI / 2 - i * 0.17, 0.07 * size);
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
        return { p, q, size };
      }),
    [],
  );

  // ---- what's inside: flex circuit, chips, two curved cells (from the bangle-v2 board) ----
  const inside = useMemo(() => {
    const mid = -Math.PI / 2;
    const flex = arcStrip(0.1, 0.022, 0.52, mid - FLEX_SPAN / 2, mid + FLEX_SPAN / 2);
    const trace = arcStrip(0.123, 0.004, 0.025, mid - FLEX_SPAN / 2 + 0.05, mid + FLEX_SPAN / 2 - 0.05);
    const cells = [
      arcStrip(0.16, 0.2, 0.5, mid - 1.05, mid - 0.3),
      arcStrip(0.16, 0.2, 0.5, mid + 0.3, mid + 1.05),
    ];
    const chipAt = (th: number, sx: number, sz: number) => {
      const n = ringNormal(th);
      const p = ringPoint(th).addScaledVector(n, 0.145);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
      return { p, q, sx, sz };
    };
    const chips = [chipAt(mid - 0.18, 0.3, 0.3), chipAt(mid + 0.18, 0.24, 0.24), chipAt(mid + 0.42, 0.32, 0.26), chipAt(mid - 0.42, 0.2, 0.2)];
    // label points: where each label should attach, on the part itself
    const at = (th: number, r: number) => ringPoint(th).addScaledVector(ringNormal(th), r);
    const labels = { flex: at(mid - 0.95, 0.11), battery: at(mid + 0.7, 0.26) };
    return { flex, trace, cells, chips, labels };
  }, []);
  const mats = useMemo(
    () => ({
      flex: new THREE.MeshPhysicalMaterial({ color: "#c98a2e", roughness: 0.45, clearcoat: 0.6, transparent: true, opacity: 0 }),
      trace: new THREE.MeshStandardMaterial({ color: "#f3d48f", metalness: 1, roughness: 0.3, transparent: true, opacity: 0 }),
      cell: new THREE.MeshPhysicalMaterial({ color: "#c3ced1", metalness: 0.7, roughness: 0.35, transparent: true, opacity: 0 }),
      chip: new THREE.MeshStandardMaterial({ color: "#2b4148", metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0 }),
    }),
    [],
  );
  const insideGroup = useRef<THREE.Group>(null);
  const shown = useRef(0);
  useFrame((_, dt) => {
    const target = xray?.current ?? 0;
    shown.current += (target - shown.current) * Math.min(1, dt * 4);
    const x = shown.current;
    const see = x > 0.01;
    if (gold.transparent !== see) {
      gold.transparent = see;
      gold.needsUpdate = true; // three.js recompiles the shader when transparency changes
    }
    gold.opacity = 1 - 0.7 * x;
    gold.depthWrite = x < 0.4;
    for (const m of Object.values(mats)) m.opacity = x;
    if (insideGroup.current) insideGroup.current.visible = x > 0.02;
  });

  const set = (key: AnchorKey) => (o: THREE.Object3D | null) => {
    if (anchors?.current) anchors.current[key] = o;
  };

  return (
    <group>
      <mesh geometry={band} material={gold} />

      {/* sensor window at 6 o'clock, facing the skin */}
      <group position={[0, -B + 0.03, 0]} ref={set("sensor")} renderOrder={2}>
        <mesh scale={[0.2, 0.05, 0.42]}>
          <sphereGeometry args={[1, 48, 24]} />
          <meshPhysicalMaterial color="#1f3f47" roughness={0.05} metalness={0.2} clearcoat={1} clearcoatRoughness={0.03} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.22, 0.44, 0.5]} material={gold}>
          <torusGeometry args={[1, 0.11, 12, 64]} />
        </mesh>
      </group>

      {contacts.map((c, i) => (
        <mesh key={i} position={c.p} quaternion={c.q} ref={i === 1 ? set("contacts") : undefined}>
          <cylinderGeometry args={[0.09, 0.09, 0.03, 32]} />
          <meshPhysicalMaterial color="#f2d08c" metalness={1} roughness={0.28} envMapIntensity={2} />
        </mesh>
      ))}

      {/* hinge knuckles at 3 o'clock */}
      <group ref={set("hinge")}>
        {[-0.22, 0, 0.22].map((x) => (
          <mesh key={x} position={[x, 0, A + T + 0.03]} rotation={[0, 0, Math.PI / 2]} material={gold}>
            <cylinderGeometry args={[0.1, 0.1, 0.19, 24]} />
          </mesh>
        ))}
        <mesh position={[0, 0.12, A + T / 2]}>
          <boxGeometry args={[W + 0.01, 0.012, T + 0.01]} />
          <meshStandardMaterial color="#6b5330" metalness={0.6} roughness={0.5} />
        </mesh>
      </group>

      <group ref={insideGroup} visible={false}>
        <mesh geometry={inside.flex} material={mats.flex} />
        <object3D position={inside.labels.flex} ref={set("flex")} />
        <object3D position={inside.labels.battery} ref={set("battery")} />
        {[-0.16, 0, 0.16].map((x) => (
          <mesh key={x} geometry={inside.trace} material={mats.trace} position={[x, 0, 0]} />
        ))}
        {inside.cells.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.cell} />
        ))}
        {inside.chips.map((c, i) => (
          <mesh key={i} position={c.p} quaternion={c.q} material={mats.chip} ref={i === 0 ? set("chip") : undefined}>
            <boxGeometry args={[c.sx, 0.05, c.sz]} />
          </mesh>
        ))}
      </group>

      {extra === "pave" &&
        pave.map((s, i) => (
          <mesh key={i} position={s.p} quaternion={s.q}>
            <octahedronGeometry args={[0.075, 0]} />
            <meshPhysicalMaterial color="#ffffff" roughness={0} transmission={0.85} ior={2.4} thickness={0.1} iridescence={0.6} clearcoat={1} />
          </mesh>
        ))}

      {extra === "emeralds" &&
        emeralds.map((e, i) => (
          <mesh key={i} position={e.p} quaternion={e.q}>
            <boxGeometry args={[0.62 * e.size, 0.16 * e.size, 0.38 * e.size]} />
            <meshPhysicalMaterial
              color="#2f8f63"
              roughness={0.04}
              transmission={0.55}
              thickness={0.4}
              ior={1.57}
              clearcoat={1}
              attenuationColor="#0d5a37"
              attenuationDistance={0.6}
            />
          </mesh>
        ))}
    </group>
  );
}
