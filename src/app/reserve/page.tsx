import type { Metadata } from "next";
import { ReserveForm } from "@/components/ReserveForm";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "Reserve yours",
  description: "Join the Sházia founding list. A $50 deposit holds your place and is fully refundable any time.",
  alternates: { canonical: "/reserve" },
};

export default function Reserve() {
  return (
    <div className={`wrap ${s.page}`}>
      <div className={s.split}>
        <header className={s.head}>
          <h1 className={s.h1}>
            Join the <em>founding list</em>
          </h1>
          <p className="lead">Leave your name and email. On the next step you can hold your place with a refundable $50 deposit, or simply stay on the list.</p>
          <ul className={s.assure}>
            <li>First production pieces go to founding members</li>
            <li>Pricing shared with you first</li>
            <li>No account, no password</li>
          </ul>
        </header>
        <div className={s.panel}>
          <ReserveForm />
        </div>
      </div>
    </div>
  );
}
