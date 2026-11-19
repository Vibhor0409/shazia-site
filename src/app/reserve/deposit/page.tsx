import type { Metadata } from "next";
import Link from "next/link";
import { DepositSummary } from "@/components/DepositSummary";
import s from "../../pages.module.css";

export const metadata: Metadata = {
  title: "Hold your place",
  robots: { index: false },
};

export default function Deposit() {
  const link = process.env.NEXT_PUBLIC_STRIPE_DEPOSIT_URL;
  return (
    <div className={`wrap ${s.page}`}>
      <div className={s.split}>
        <header className={s.head}>
          <h1 className={s.h1}>
            Hold your place for <em>$50</em>
          </h1>
          <p className="lead">You&apos;re on the founding list. Your deposit moves you to the front of the founding list and is credited in full to your bangle.</p>
        </header>
        <div className={s.panel}>
          <DepositSummary />
          <ul className={s.assure}>
            <li>Fully refundable, any time, with one email</li>
            <li>Credited in full to your bangle</li>
            <li>Paid securely through Stripe. We never see your card.</li>
          </ul>
          <a className="btn" href={link || "/reserve/checkout"} rel={link ? "noopener" : undefined}>
            Hold my place · $50
          </a>
          <Link href="/" className="btn-link" style={{ justifySelf: "start" }}>
            Not yet, keep me on the list
          </Link>
          <p className="source">
            By paying you agree to our <Link href="/deposit-terms">deposit terms</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
