import type { Metadata } from "next";
import Link from "next/link";
import s from "../../pages.module.css";

export const metadata: Metadata = { title: "You're in", robots: { index: false } };

export default function Confirmed() {
  return (
    <div className={`wrap ${s.page}`}>
      <header className={s.head}>
        <h1 className={s.h1}>
          You&apos;re <em>in</em>
        </h1>
        <p className="lead">Your place is held. We&apos;ve sent a receipt to your email, and you&apos;ll hear from us first about pricing, fittings and delivery.</p>
      </header>
      <div className={s.panel}>
        <h2 className="h2" style={{ fontSize: 28 }}>Want a private fitting?</h2>
        <p>Reply to your receipt email and we&apos;ll find a time to measure your wrist and show you the pieces in person.</p>
        <Link href="/collection" className="btn-secondary" style={{ justifySelf: "start" }}>
          Explore the collection
        </Link>
      </div>
      <div style={{ height: 96 }} />
    </div>
  );
}
