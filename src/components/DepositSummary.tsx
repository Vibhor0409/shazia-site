"use client";

import { useEffect, useState } from "react";
import { DESIGNS } from "@/lib/content";

/** Shows the design she chose in Customise, so she sees her bangle as she pays. */
export function DepositSummary() {
  const [line, setLine] = useState("");
  useEffect(() => {
    try {
      const r = JSON.parse(sessionStorage.getItem("shazia-reserve") || "{}");
      const d = DESIGNS.find((x) => x.slug === r.design);
      if (d) {
        const metal = r.metal === "rose" ? "rose gold" : r.metal === "yellow" ? "yellow gold" : d.tagline.toLowerCase();
        setLine(`${d.name} in ${metal}${r.size ? `, ${r.size} ${r.unit || "cm"}` : ""}${r.engraving ? `, engraved “${r.engraving}”` : ""}`);
      }
    } catch {}
  }, []);
  return (
    <div>
      <span className="eyebrow">Your Sházia</span>
      <p style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: 26, color: "var(--teal)", marginTop: 6 }}>
        {line || "Choose your design later"}
      </p>
    </div>
  );
}
