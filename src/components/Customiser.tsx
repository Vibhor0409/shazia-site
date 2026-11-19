"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DESIGNS, type DesignSlug, type Metal } from "@/lib/content";
import { Viewer } from "./Viewer";
import p from "@/app/pages.module.css";
import s from "./Customiser.module.css";

type Choice = { design: DesignSlug; metal: Metal; size: string; unit: "cm" | "in"; fitting: boolean; engraving: string };
const KEY = "shazia-customise";

function suggestSize(size: string, unit: "cm" | "in") {
  const n = parseFloat(size);
  if (!n) return null;
  const cm = unit === "in" ? n * 2.54 : n;
  if (cm < 13 || cm > 22) return "Please check this: most wrists measure 13 to 22 cm.";
  const label = cm < 14.5 ? "XS" : cm < 15.8 ? "S" : cm < 17 ? "M" : cm < 18.4 ? "L" : "XL";
  return `Suggested size ${label}. We make yours to the exact measurement.`;
}

export function Customiser() {
  const router = useRouter();
  const params = useSearchParams();
  const [c, setC] = useState<Choice>({ design: "sola", metal: "yellow", size: "", unit: "cm", fitting: false, engraving: "" });

  useEffect(() => {
    let saved: Partial<Choice> = {};
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {}
    const q = params.get("design") as DesignSlug | null;
    const fromQuery = q && DESIGNS.some((d) => d.slug === q) ? { design: q, metal: DESIGNS.find((d) => d.slug === q)!.metal } : {};
    setC((prev) => ({ ...prev, ...saved, ...fromQuery }));
  }, [params]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {}
  }, [c]);

  const d = DESIGNS.find((x) => x.slug === c.design)!;
  const hint = suggestSize(c.size, c.unit);
  const set = <K extends keyof Choice>(k: K, v: Choice[K]) => setC((prev) => ({ ...prev, [k]: v }));

  function reserve() {
    try {
      sessionStorage.setItem("shazia-reserve", JSON.stringify({ ...c }));
    } catch {}
    router.push("/reserve");
  }

  return (
    <div className={p.split}>
      <Viewer metal={c.metal} extra={d.extra} fallback={d.image} alt={d.alt} />
      <div className={s.steps}>
        <fieldset className={s.step}>
          <legend>
            <span>1</span> Design
          </legend>
          <div className={s.options}>
            {DESIGNS.map((x) => (
              <label key={x.slug} className={s.option} data-on={c.design === x.slug}>
                <input type="radio" name="design" value={x.slug} checked={c.design === x.slug} onChange={() => setC((prev) => ({ ...prev, design: x.slug, metal: x.metal }))} />
                <b>{x.name}</b>
                <span>{x.tagline}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={s.step}>
          <legend>
            <span>2</span> Metal
          </legend>
          <div className={s.options}>
            {(["yellow", "rose"] as const).map((m) => (
              <label key={m} className={s.option} data-on={c.metal === m}>
                <input type="radio" name="metal" value={m} checked={c.metal === m} onChange={() => set("metal", m)} />
                <i className={s.swatch} data-metal={m} aria-hidden />
                <b>{m === "yellow" ? "Yellow gold" : "Rose gold"}</b>
                <span>Heavy gold vermeil</span>
              </label>
            ))}
          </div>
          <p className="source">Solid 14k gold on request.</p>
        </fieldset>

        <fieldset className={s.step}>
          <legend>
            <span>3</span> Size
          </legend>
          <div className={s.sizeRow}>
            <label htmlFor="wrist" className="sr-only">
              Wrist measurement
            </label>
            <input id="wrist" inputMode="decimal" placeholder="Wrist measurement" value={c.size} disabled={c.fitting} onChange={(e) => set("size", e.target.value.replace(/[^0-9.]/g, "").slice(0, 5))} />
            <div className={s.units} role="group" aria-label="Unit">
              {(["cm", "in"] as const).map((u) => (
                <button key={u} type="button" aria-pressed={c.unit === u} onClick={() => set("unit", u)}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          {!c.fitting && hint && <p className={s.hint}>{hint}</p>}
          <label className={s.check}>
            <input type="checkbox" checked={c.fitting} onChange={(e) => set("fitting", e.target.checked)} />
            I&apos;d rather be measured at a private fitting
          </label>
          <details className={s.howto}>
            <summary>How to measure your wrist</summary>
            <ol>
              <li>Wrap a strip of paper round your wrist, just below the wrist bone.</li>
              <li>Mark where it overlaps, without pulling tight.</li>
              <li>Lay it flat and measure to the mark. A close fit helps the sensor read accurately.</li>
            </ol>
          </details>
        </fieldset>

        <fieldset className={s.step}>
          <legend>
            <span>4</span> Engraving <em>optional</em>
          </legend>
          <label htmlFor="engrave" className="sr-only">
            Engraving, up to 12 characters
          </label>
          <input id="engrave" className={s.text} maxLength={12} placeholder="Up to 12 characters" value={c.engraving} onChange={(e) => set("engraving", e.target.value)} />
          {/* TODO: CONFIRM engraving is offered */}
        </fieldset>

        <div className={s.review}>
          <h2>Your Sházia</h2>
          <dl>
            <div>
              <dt>Design</dt>
              <dd>{d.name}</dd>
            </div>
            <div>
              <dt>Metal</dt>
              <dd>{c.metal === "yellow" ? "Yellow gold" : "Rose gold"}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{c.fitting ? "Measured at a fitting" : c.size ? `${c.size} ${c.unit}` : "Add later"}</dd>
            </div>
            <div>
              <dt>Engraving</dt>
              <dd>{c.engraving || "None"}</dd>
            </div>
          </dl>
          <button type="button" className="btn" onClick={reserve}>
            Reserve this design
          </button>
          <p className="source">A $50 refundable deposit holds your place.</p>
        </div>
      </div>
    </div>
  );
}
