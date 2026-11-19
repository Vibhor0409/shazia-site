"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import s from "./TwoWrists.module.css";

const TwoWristsScene = dynamic(() => import("./three/TwoWristsScene"), { ssr: false });

/** The brand's signature comparison: the tracker people take off, and the piece they keep on. */
export function TwoWrists() {
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    const el = box.current;
    if (!el) return;
    // only start the 3D when the section is close to the screen
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={s.figure}>
      <div ref={box} className={s.stage}>
        {near && webgl ? (
          <TwoWristsScene reduce={reduce} />
        ) : (
          <Image src="/images/01-plain-yellow-gold-cut.webp" alt="" fill sizes="(max-width: 860px) 100vw, 60vw" className={s.poster} />
        )}
        <span className={`${s.tag} ${s.top}`}>A tracker: off for dinner</span>
        <span className={`${s.tag} ${s.bottom}`}>Sházia: on all evening</span>
      </div>
      <figcaption className="source">A sports tracker and a Sházia bangle on the same wrist form. Drawn in 3D; not to scale.</figcaption>
    </figure>
  );
}
