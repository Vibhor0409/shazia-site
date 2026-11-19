import type { Metadata } from "next";
import s from "../pages.module.css";

export const metadata: Metadata = { title: "Deposit terms", alternates: { canonical: "/deposit-terms" } };

export default function DepositTerms() {
  return (
    <div className={`wrap ${s.page}`}>
      <header className={s.head}>
        <h1 className={s.h1}>The $50 founding deposit</h1>
        <p className="source">Draft, November 2026.</p>
      </header>
      <div className={s.prose} style={{ paddingBottom: 96 }}>
        <p>Your $50 deposit holds your place on the Sházia founding list. It is not a purchase, and it does not commit you to buying.</p>
        <h2>Refunds</h2>
        <p>You can ask for a full refund at any time before you confirm an order. Email hello@xn--shzia-yqa.com and we will refund the full amount to your original payment method.</p>
        <h2>When you order</h2>
        <p>If you go ahead, the full $50 is credited towards your bangle. Founding members hear pricing and delivery dates before anyone else.</p>
        <h2>If we don&apos;t ship</h2>
        <p>If we are unable to make your bangle, we will refund your deposit in full automatically.</p>
        {/* TODO: CONFIRM terms with the team and an adviser before taking payments */}
      </div>
    </div>
  );
}
