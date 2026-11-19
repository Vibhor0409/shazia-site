import type { Metadata } from "next";
import Link from "next/link";
import { FAQS } from "@/lib/content";
import s from "../pages.module.css";
import h from "../home.module.css";

export const metadata: Metadata = {
  title: "Questions",
  description: "Answers about Sházia: the refundable deposit, sizing, charging, water resistance, your data, and how it tracks your health.",
  alternates: { canonical: "/faq" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Faq() {
  return (
    <div className={`wrap ${s.page}`}>
      <nav aria-label="Breadcrumb" className={s.crumbs}>
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li aria-current="page">Questions</li>
        </ol>
      </nav>
      <header className={s.head} style={{ marginTop: 16 }}>
        <h1 className={s.h1}>
          Everything you&apos;d <em>want to know</em>
        </h1>
        <p className="source">Updated November 2026</p>
      </header>
      <div className={h.faq}>
        {FAQS.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <div className={s.next}>
        <span>Still deciding?</span>
        <Link href="/reserve" className="btn">
          Reserve yours
        </Link>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
