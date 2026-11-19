import Link from "next/link";
import s from "./pages.module.css";

export default function NotFound() {
  return (
    <div className={`wrap ${s.page}`} style={{ paddingBottom: 120 }}>
      <header className={s.head}>
        <h1 className={s.h1}>
          This page has <em>slipped off</em>
        </h1>
        <p className="lead">It may have moved, or the link may be wrong. Here are good places to start.</p>
      </header>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link href="/" className="btn">Go home</Link>
        <Link href="/collection" className="btn-secondary">View the collection</Link>
      </div>
    </div>
  );
}
