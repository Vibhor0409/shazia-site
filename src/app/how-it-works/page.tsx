import type { Metadata } from "next";
import Link from "next/link";
import { FEATURES } from "@/lib/content";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How a Sházia bangle tracks your health: a sensor window and two gold skin contacts on the inside, and an app that turns the readings into insights on sleep, stress, your cycle and hot flashes.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorks() {
  return (
    <div className={`wrap ${s.page}`}>
      <header className={s.head}>
        <h1 className={s.h1}>
          A bangle that <em>reads, quietly</em>
        </h1>
        <p className="lead">
          Everything that measures sits on the inside, against your skin. Everything you see is jewellery.
        </p>
      </header>

      <div className={s.prose}>
        <h2>What does Sházia measure?</h2>
        <p>
          A smoked-glass window on the inner wall is designed to read your pulse and skin temperature. Two gold inlays either side of it
          track small changes in your skin&apos;s response. A motion sensor knows when you&apos;re moving, resting or asleep. The app combines
          these into patterns you can actually use.
        </p>
        <h2>How does it notice a hot flash?</h2>
        <p>
          A hot flash shows up as a quick rise in skin temperature together with a surge in skin response. Sházia compares the warmth of
          your skin with the warmth of the band itself, so a hot room or a hot drink is less likely to be mistaken for one. Each event is
          logged with when it started, how long it lasted and how strong it was.
        </p>
        <h2>Is it accurate?</h2>
        <p>
          We are testing every reading against established wearables and will publish the results before launch. Until then, think of
          Sházia as a guide to your patterns, not a medical measurement.
        </p>
      </div>

      <section className="section" aria-labelledby="app-h" style={{ paddingInline: 0 }}>
        <div className="stack">
          <h2 id="app-h" className="h2">
            Six things it <em>tells you</em>
          </h2>
          <ul className={s.cards}>
            {FEATURES.map((f) => (
              <li key={f.name}>
                <h3>{f.name}</h3>
                <p>{f.line}</p>
              </li>
            ))}
          </ul>
          <p className="source">Wellness guidance, not a medical diagnosis.</p>
        </div>
      </section>

      <div className={s.next}>
        <span>Next: choose your design</span>
        <Link href="/collection" className="btn-link">
          View the collection
        </Link>
      </div>
    </div>
  );
}
