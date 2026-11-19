import Link from "next/link";
import { SITE } from "@/lib/content";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={`section-teal ${styles.footer}`}>
      <div className={`wrap ${styles.grid}`}>
        <div className="stack">
          <span className={styles.mark}>sházia</span>
          <p className={styles.tag}>Fine jewellery that tracks your health.</p>
        </div>
        <nav aria-label="Footer" className={styles.cols}>
          <div>
            <h2 className={styles.h}>Shop</h2>
            <Link href="/collection">Collection</Link>
            <Link href="/customise">Customise</Link>
            <Link href="/reserve">Reserve yours</Link>
          </div>
          <div>
            <h2 className={styles.h}>Learn</h2>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/our-story">Our story</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div>
            <h2 className={styles.h}>Contact</h2>
            <span className={styles.selectable}>{SITE.email}</span>
            <a href={SITE.instagram} rel="noopener noreferrer" target="_blank">
              Instagram
            </a>
            <Link href="/privacy">Privacy</Link>
            <Link href="/deposit-terms">Deposit terms</Link>
          </div>
        </nav>
      </div>
      <div className={`wrap ${styles.legal}`}>
        <p>Wellness guidance, not a medical diagnosis.</p>
        <p>© {new Date().getFullYear()} Sházia. Made by a team from UC Berkeley.</p>
      </div>
    </footer>
  );
}
