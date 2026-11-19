import type { Metadata } from "next";
import Link from "next/link";
import { QUOTE } from "@/lib/content";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "Our story",
  description: "Why a team from UC Berkeley set out to make health tracking you'd actually want to wear.",
  alternates: { canonical: "/our-story" },
};

export default function OurStory() {
  return (
    <div className={`wrap ${s.page}`}>
      <header className={s.head}>
        <h1 className={s.h1}>
          Health tracking you&apos;d <em>actually wear</em>
        </h1>
      </header>
      <div className={s.prose}>
        <p className="lead">
          We kept hearing the same thing. Women wanted to understand their sleep, their stress, their cycles and their hot flashes, but
          the devices that could tell them looked like gym equipment. So they took them off exactly when they wanted to look their best.
        </p>
        <blockquote style={{ margin: 0, fontFamily: "var(--font-display), Georgia, serif", fontStyle: "italic", fontSize: 28, lineHeight: 1.3, color: "var(--teal)" }}>
          “{QUOTE.text}”
          <footer style={{ fontFamily: "var(--font-body), sans-serif", fontStyle: "normal", fontSize: 14, marginTop: 10, color: "var(--harbour)" }}>
            {QUOTE.name}, {QUOTE.role.toLowerCase()}
          </footer>
        </blockquote>
        <h2>Who we are</h2>
        <p>
          Sházia is built by a small team of students at UC Berkeley, combining hardware engineering, health research and jewellery
          design. Every piece is made with a family jewellery workshop with a century of craft behind it.
        </p>
        {/* TODO: CONFIRM founder names, roles and photo for the team section */}
        <h2>What we believe</h2>
        <p>
          Looks and health matter equally. Nobody should have to choose between feeling confident and knowing what their body is doing.
        </p>
        <h2>Get in touch</h2>
        <p>
          We read every message. Write to us at <span style={{ userSelect: "all" }}>hello@xn--shzia-yqa.com</span>.
        </p>
      </div>
      <div className={s.next}>
        <span>Be one of the first</span>
        <Link href="/reserve" className="btn">
          Reserve yours
        </Link>
      </div>
    </div>
  );
}
