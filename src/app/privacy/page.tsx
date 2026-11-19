import type { Metadata } from "next";
import s from "../pages.module.css";

export const metadata: Metadata = { title: "Privacy", alternates: { canonical: "/privacy" } };

export default function Privacy() {
  return (
    <div className={`wrap ${s.page}`}>
      <header className={s.head}>
        <h1 className={s.h1}>Your data is yours</h1>
        <p className="source">Draft, November 2026. The full policy will be published before launch.</p>
      </header>
      <div className={s.prose} style={{ paddingBottom: 96 }}>
        <h2>What this website collects</h2>
        <p>When you join the waitlist we keep your first name, your email address and the design you chose, so we can contact you about Sházia. Deposits are handled by Stripe; we never see or store your card details.</p>
        <h2>What we never do</h2>
        <p>We never sell your information. We only email you about Sházia, and you can unsubscribe at any time.</p>
        <h2>Health data</h2>
        <p>Health readings from the bangle stay yours. You will be able to export or delete them at any time. Full details will be in the app&apos;s privacy policy.</p>
        <h2>Contact</h2>
        <p>To see, change or delete what we hold about you, email hello@xn--shzia-yqa.com.</p>
        {/* TODO: CONFIRM final privacy wording and cookie consent before launch */}
      </div>
    </div>
  );
}
