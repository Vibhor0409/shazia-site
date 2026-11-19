"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CHAPTERS, DESIGNS } from "@/lib/content";
import { ReserveForm } from "./ReserveForm";
import type { StoryState } from "./three/StoryScene";
import styles from "./ScrollStory.module.css";

const StoryScene = dynamic(() => import("./three/StoryScene"), { ssr: false });

const ease = (t: number) => t * t * (3 - 2 * t);

const LABELS = {
  sensor: "Sensor window",
  contacts: "Gold skin contacts",
  hinge: "Hinge and clasp",
  flex: "Flexible circuit",
  battery: "Curved battery",
  chip: "Bluetooth chip",
};
const FIRST_DESIGN = 6; // chapter index where the collection starts

export function ScrollStory() {
  const sections = useRef<(HTMLElement | null)[]>([]);
  const state = useRef<StoryState>({ index: 0, t: 0 });
  const callouts = useRef<Record<string, HTMLElement | null>>({});
  const [active, setActive] = useState(0);
  const [design, setDesign] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  // the 3D starts on the visitor's first scroll, tap or key press; the hero image covers until then,
  // so the page is quick and responsive on load
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (scrollY > 0) {
      setGo(true);
      return;
    }
    const start = () => setGo(true);
    const events = ["scroll", "pointerdown", "keydown", "touchstart", "wheel"] as const;
    events.forEach((e) => addEventListener(e, start, { once: true, passive: true }));
    // fetch the 3D code quietly in the background so it is ready when needed
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const prefetch = () => import("./three/StoryScene");
    const t = idle ? idle(prefetch) : window.setTimeout(prefetch, 2500);
    return () => {
      events.forEach((e) => removeEventListener(e, start));
      if (!idle) clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    try {
      const c = document.createElement("canvas");
      setWebgl(!!(c.getContext("webgl2") || c.getContext("webgl")));
    } catch {
      setWebgl(false);
    }
    const onScroll = () => {
      const y = scrollY + innerHeight * 0.5;
      const list = sections.current.filter(Boolean) as HTMLElement[];
      let i = 0;
      list.forEach((s, k) => {
        if (s.offsetTop <= y) i = k;
      });
      const s = list[i];
      if (!s) return;
      const f = Math.min(1, Math.max(0, (y - s.offsetTop) / s.offsetHeight));
      const t = i < list.length - 1 ? ease(Math.min(1, Math.max(0, (f - 0.55) / 0.45))) : 0;
      state.current = { index: i, t };
      setActive(t > 0.5 ? Math.min(i + 1, list.length - 1) : i);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i: number) => sections.current[i]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  const total = CHAPTERS.length + 1;

  return (
    <div className={styles.story}>
      <div className={styles.stage} aria-hidden>
        {webgl && go && <StoryScene state={state} onDesign={setDesign} design={design} callouts={callouts} reduce={reduce} onReady={() => setReady(true)} />}
        {/* shown instantly, and kept for devices without 3D */}
        <div className={styles.poster} data-hidden={webgl !== false && ready}>
          <Image src={DESIGNS[design].image} alt="" fill sizes="(max-width: 760px) 90vw, 55vw" priority className={styles.posterImg} />
        </div>
      </div>

      {Object.entries(LABELS).map(([k, label]) => (
        <div key={k} className={styles.callout} data-on="false" ref={(el) => { callouts.current[k] = el; }} aria-hidden>
          <i />
          <b>{label}</b>
        </div>
      ))}

      <ol className={styles.dots} aria-label="Story progress">
        {Array.from({ length: total }, (_, i) => (
          <li key={i}>
            <button type="button" aria-label={`Go to part ${i + 1}`} aria-current={active === i} onClick={() => goTo(i)} />
          </li>
        ))}
      </ol>

      {CHAPTERS.map((c, i) => {
        const Heading = i === 0 ? "h1" : "h2";
        return (
          <section key={i} className={styles.chapter} ref={(el) => { sections.current[i] = el; }} aria-labelledby={`ch-${i}`}>
            <div className={styles.copy} data-on={active === i}>
              <Heading id={`ch-${i}`} className={i === 0 ? styles.h1 : styles.h2}>
                {c.title} <em>{c.accent}</em>
              </Heading>
              <p>{c.body}</p>
              {"spec" in c && c.spec && (
                <dl className={styles.spec}>
                  {c.spec.map(([k, val]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{val}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {"design" in c && (
                <div className={styles.designs} role="group" aria-label="Choose a design">
                  {DESIGNS.map((d, k) => (
                    <button key={d.slug} type="button" className={styles.dz} aria-pressed={design === k} onClick={() => goTo(FIRST_DESIGN + k)}>
                      {d.name}
                    </button>
                  ))}
                </div>
              )}
              {i === 0 && <ReserveForm compact />}
            </div>
          </section>
        );
      })}

      <section className={styles.chapter} ref={(el) => { sections.current[CHAPTERS.length] = el; }} aria-labelledby="ch-reserve">
        <div className={styles.copy} data-on={active === CHAPTERS.length}>
          <h2 id="ch-reserve" className={styles.h2}>
            Be one of the <em>first to wear it</em>
          </h2>
          <p>Join the waitlist. A $50 deposit holds your place, fully refundable any time.</p>
          <ReserveForm compact />
        </div>
      </section>
    </div>
  );
}
