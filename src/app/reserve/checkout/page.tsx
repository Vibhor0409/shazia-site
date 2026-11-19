import type { Metadata } from "next";
import Link from "next/link";
import s from "../../pages.module.css";

export const metadata: Metadata = { title: "Secure checkout", robots: { index: false } };

export default function Checkout() {
  return (
    <div className={`wrap ${s.page}`}>
      <div className={s.split}>
        <header className={s.head}>
          <h1 className={s.h1}>
            Checkout opens <em>soon</em>
          </h1>
          <p className="lead">
            Sházia launches in the new year. You&apos;re already on the founding list, so we&apos;ll email you the moment deposits open,
            before anyone else.
          </p>
        </header>
        <div className={s.panel}>
          <p>When checkout opens, the $50 deposit will be paid securely through Stripe and is fully refundable any time.</p>
          <Link href="/collection" className="btn" style={{ justifySelf: "start" }}>
            Explore the collection
          </Link>
          <Link href="/" className="btn-link" style={{ justifySelf: "start" }}>
            Back to home
          </Link>
        </div>
      </div>
      <div style={{ height: 96 }} />
    </div>
  );
}
