"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ArmForm, Bangle, Studio, type AnchorKey, type Anchors } from "./Bangle";
import { B } from "@/lib/bangle";
import { DESIGNS } from "@/lib/content";

type Pose = {
  cam: THREE.Vector3;
  at: THREE.Vector3;
  pos: THREE.Vector3;
  rot: THREE.Quaternion | null;
  mode: "spin" | "sway" | "still";
  callouts: AnchorKey[];
  xray: number;
  design: number;
};

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const ON_WRIST = v(0.55, -0.12, 0);
const LIFTED = v(7.2, 0.4, 0);
const INSPECT = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.5, Math.PI / 2, Math.PI / 2, "XYZ"));
// the x-ray view: band lifted and turned so the underside arc, where the electronics sit, faces the camera
const XRAY = new THREE.Quaternion().setFromEuler(new THREE.Euler(-1.15, 0.85, 0, "YXZ"));
const BASE = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0.06, "YXZ"));
const X_AXIS = new THREE.Vector3(1, 0, 0);

function buildPoses(): Pose[] {
  const sW = new THREE.Vector3(0, -B, 0).applyQuaternion(INSPECT).add(LIFTED);
  const nW = new THREE.Vector3(0, 1, 0).applyQuaternion(INSPECT);
  const aW = new THREE.Vector3(1, 0, 0).applyQuaternion(INSPECT);
  if (aW.y < 0) aW.negate();
  const near = (n: number, a: number) => sW.clone().addScaledVector(nW, n).addScaledVector(aW, a);
  return [
    { cam: v(8, 5, 15.5), at: v(0.4, 0, 0), pos: ON_WRIST, rot: null, mode: "spin", callouts: [], xray: 0, design: 0 },
    { cam: v(-3.5, 2.6, 15), at: v(0.4, 0, 0), pos: ON_WRIST, rot: null, mode: "spin", callouts: [], xray: 0, design: 0 },
    { cam: near(7.4, 6.2), at: near(1.9, 0), pos: LIFTED, rot: INSPECT, mode: "still", callouts: ["sensor"], xray: 0, design: 0 },
    { cam: near(2.2, 2.2), at: near(0.2, 0), pos: LIFTED, rot: INSPECT, mode: "still", callouts: ["contacts"], xray: 0, design: 0 },
    { cam: v(9.2, 2.2, 14.5), at: v(7.0, -0.3, 0), pos: LIFTED, rot: XRAY, mode: "still", callouts: ["flex", "battery", "chip"], xray: 1, design: 0 },
    { cam: v(1.8, 1.4, 8.6), at: v(0.55, 0, 3.2), pos: ON_WRIST, rot: new THREE.Quaternion(), mode: "still", callouts: ["hinge"], xray: 0, design: 0 },
    ...DESIGNS.map((_, i) => ({
      cam: i < 2 ? v(7, 5.2, 11) : v(5.5, 6.2, 10),
      at: i < 2 ? v(0.4, 0.3, 0) : v(0.4, 0.6, 0),
      pos: ON_WRIST,
      rot: null,
      mode: "sway" as const,
      callouts: [] as AnchorKey[],
      xray: 0,
      design: i,
    })),
    { cam: v(10, 4, 18), at: v(-0.6, 0, 0), pos: ON_WRIST, rot: null, mode: "spin", callouts: [], xray: 0, design: 0 },
  ];
}

export type StoryState = { index: number; t: number };

function Rig({
  state,
  onDesign,
  design,
  callouts,
  reduce,
}: {
  state: RefObject<StoryState>;
  onDesign: (i: number) => void;
  design: number;
  callouts: RefObject<Record<string, HTMLElement | null>>;
  reduce: boolean;
}) {
  const poses = useMemo(buildPoses, []);
  const group = useRef<THREE.Group>(null);
  const anchors = useRef<Anchors>({});
  const xray = useRef(0);
  const { camera, size } = useThree();
  const cur = useRef({ cam: poses[0].cam.clone(), at: poses[0].at.clone(), pos: poses[0].pos.clone(), quat: BASE.clone() });
  const spin = useRef(0);
  const lastActive = useRef(-1);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const poseQuat = (p: Pose, time: number) => {
    if (p.rot) return p.rot.clone();
    const ang = p.mode === "sway" ? (reduce ? 0.25 : 0.25 + 0.45 * Math.sin(time * 0.7)) : spin.current;
    return BASE.clone().multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, ang));
  };

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const { index, t } = state.current;
    const a = poses[Math.min(index, poses.length - 1)];
    const b = poses[Math.min(index + 1, poses.length - 1)];
    const spinW = (a.mode === "spin" ? 1 : 0) * (1 - t) + (b.mode === "spin" ? 1 : 0) * t;
    if (!reduce) spin.current = (spin.current + dt * 0.45 * spinW) % (Math.PI * 2);

    const narrow = size.width < 760;
    const tAt = a.at.clone().lerp(b.at, t);
    // phones: step back and aim lower so the whole piece sits above the copy card
    const tCam = a.cam.clone().lerp(b.cam, t).sub(tAt).multiplyScalar(narrow ? 1.6 : 1).add(tAt);
    if (narrow) tAt.y -= 3.2;
    const tPos = a.pos.clone().lerp(b.pos, t);
    if (a.pos !== b.pos) tPos.y += Math.sin(t * Math.PI) * 1.4;
    const tQ = poseQuat(a, clock.elapsedTime).slerp(poseQuat(b, clock.elapsedTime), t);
    xray.current = a.xray * (1 - t) + b.xray * t;

    const k = reduce ? 1 : 1 - Math.pow(0.002, dt);
    const c = cur.current;
    c.cam.lerp(tCam, k);
    c.at.lerp(tAt, k);
    c.pos.lerp(tPos, k);
    c.quat.slerp(tQ, k);
    camera.position.copy(c.cam);
    camera.lookAt(c.at);
    if (group.current) {
      group.current.position.copy(c.pos);
      group.current.quaternion.copy(c.quat);
    }

    const active = Math.min(t > 0.5 ? index + 1 : index, poses.length - 1);
    if (active !== lastActive.current) {
      lastActive.current = active;
      onDesign(poses[active].design);
    }
    const els = callouts.current;
    for (const key of ["sensor", "contacts", "hinge", "flex", "battery", "chip"] as const) {
      const el = els?.[key];
      if (!el) continue;
      const show = poses[active].callouts.includes(key);
      el.dataset.on = String(show);
      const o = anchors.current[key];
      if (show && o) {
        o.getWorldPosition(tmp).project(camera);
        const px = ((tmp.x + 1) / 2) * size.width;
        const left = px > size.width * 0.62; // near the right edge: put the label on the dot's left
        el.dataset.side = left ? "left" : "right";
        el.style.transform = `translate(${left ? px - el.offsetWidth + 6 : px - 6}px, ${((1 - tmp.y) / 2) * size.height - 12}px)`;
      }
    }
  });

  const d = DESIGNS[design];
  return (
    <>
      <Studio />
      <ArmForm />
      <group ref={group}>
        <Bangle metal={d.metal} extra={d.extra} anchors={anchors} xray={xray} />
      </group>
    </>
  );
}

function Framing() {
  // keep the piece clear of the copy: to the right on wide screens, higher up on phones
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const narrow = size.width < 760;
    cam.fov = narrow ? 44 : 32;
    cam.setViewOffset(size.width, size.height, narrow ? 0 : -size.width * 0.17, 0, size.width, size.height);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export default function StoryScene({ onReady, ...props }: {
  onReady?: () => void;
  state: RefObject<StoryState>;
  onDesign: (i: number) => void;
  design: number;
  callouts: RefObject<Record<string, HTMLElement | null>>;
  reduce: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 32, near: 0.1, far: 200, position: [8, 5, 15.5] }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      aria-hidden
      onCreated={() => requestAnimationFrame(() => onReady?.())}
    >
      <Framing />
      <Rig {...props} />
    </Canvas>
  );
}
