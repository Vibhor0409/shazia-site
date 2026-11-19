import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DESIGNS } from "@/lib/content";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "The collection",
  description: "Four Sházia designs, each with the same hidden health sensor and each made to your wrist measurement.",
  alternates: { canonical: "/collection" },
};

export default function Collection() {
  return (
    <div className={`wrap ${s.page}`}>
      <header className={s.head}>
        <h1 className={s.h1}>
          Four designs. <em>One sensor.</em> Every size.
        </h1>
        <p className="lead">
          Every piece carries the same smoked-glass sensor window on the inside and the same hinged clasp, and every piece is made to
          your wrist.
        </p>
      </header>
      <div className={s.grid2}>
        {DESIGNS.map((d, i) => (
          <Link key={d.slug} href={`/collection/${d.slug}`} className={s.tile}>
            <div className={s.tileImg}>
              <Image src={d.image} alt={d.alt} fill sizes="(max-width: 860px) 100vw, 50vw" priority={i < 2} />
              <span className={s.concept}>Design concept</span>
            </div>
            <div className={s.tileMeta}>
              <span className={s.tileName}>{d.name}</span>
              <span className="muted">{d.tagline}</span>
            </div>
          </Link>
        ))}
      </div>
      <div className={s.next}>
        <span>Make one yours</span>
        <Link href="/customise" className="btn">
          Design yours
        </Link>
      </div>
    </div>
  );
}
