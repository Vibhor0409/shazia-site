"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Metal } from "@/lib/content";
import s from "@/app/pages.module.css";

const ViewerScene = dynamic(() => import("./three/ViewerScene"), { ssr: false });

/** Live 3D bangle with a still image for devices without WebGL. */
export function Viewer({ metal, extra, fallback, alt }: { metal: Metal; extra: "pave" | "emeralds" | null; fallback: string; alt: string }) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
  }, []);
  return (
    <div className={s.viewer}>
      {webgl ? (
        <>
          <ViewerScene metal={metal} extra={extra} reduce={reduce} />
          <span className={s.viewerHint}>Drag to turn</span>
        </>
      ) : (
        <div className={s.tileImg} style={{ position: "absolute", inset: 0, aspectRatio: "auto" }}>
          <Image src={fallback} alt={alt} fill sizes="50vw" />
        </div>
      )}
    </div>
  );
}
