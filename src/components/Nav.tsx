"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Nav.module.css";

const LINKS = [
  { href: "/collection", label: "Collection" },
  { href: "/customise", label: "Customise" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/our-story", label: "Our story" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 80);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={styles.nav} data-scrolled={scrolled || pathname !== "/"}>
      <Link href="/" className={styles.mark} aria-label="Sházia home">
        sházia
      </Link>
      <nav aria-label="Main" className={styles.links}>
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div className={styles.right}>
        <Link href="/reserve" className="btn">
          Reserve yours
        </Link>
        <button type="button" className={styles.menu} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className={styles.bars} data-open={open} />
        </button>
      </div>
      <div id="mobile-menu" className={styles.panel} hidden={!open}>
        <nav aria-label="Mobile">
          {[...LINKS, { href: "/faq", label: "FAQ" }].map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
