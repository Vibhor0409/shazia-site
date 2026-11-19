"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import styles from "./ReserveForm.module.css";

type Status = "idle" | "sending" | "error";

/**
 * Step 1 of reserving: email (and first name on the full form). Saves to the waitlist,
 * then moves to the deposit step. Personal details are never put in the URL.
 */
export function ReserveForm({ compact = false, design }: { compact?: boolean; design?: string }) {
  const router = useRouter();
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  useEffect(() => {
    try {
      setSaved(JSON.parse(sessionStorage.getItem("shazia-reserve") || "{}").design || "");
    } catch {}
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setError("Please enter a full email address, like name@example.com.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: String(form.get("firstName") || "").trim(),
          design: design || saved,
          website: String(form.get("website") || ""),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      try {
        const prev = JSON.parse(sessionStorage.getItem("shazia-reserve") || "{}");
        sessionStorage.setItem("shazia-reserve", JSON.stringify({ ...prev, design: design || saved, firstName: String(form.get("firstName") || "") }));
      } catch {}
      router.push("/reserve/deposit");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className={compact ? styles.compact : styles.full} onSubmit={onSubmit} noValidate>
      {!compact && (
        <div className={styles.field}>
          <label htmlFor={`${id}-name`}>First name</label>
          <input id={`${id}-name`} name="firstName" autoComplete="given-name" maxLength={60} />
        </div>
      )}
      <div className={styles.field}>
        <label htmlFor={`${id}-email`} className={compact ? "sr-only" : undefined}>
          Email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={compact ? "Your email address" : undefined}
          required
          maxLength={254}
          aria-invalid={status === "error"}
          aria-describedby={`${id}-msg`}
        />
      </div>
      {/* spam trap: hidden from people, filled in by bots */}
      <div className={styles.trap} aria-hidden>
        <label htmlFor={`${id}-web`}>Website</label>
        <input id={`${id}-web`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Saving your place…" : "Reserve yours"}
      </button>
      <p id={`${id}-msg`} className={status === "error" ? styles.error : styles.note} role={status === "error" ? "alert" : undefined}>
        {status === "error" ? error : "Join the founding list. A $50 refundable deposit holds your place."}
      </p>
    </form>
  );
}
