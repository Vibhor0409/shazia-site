import Link from "next/link";
import { ScrollStory } from "@/components/ScrollStory";
import { ReserveForm } from "@/components/ReserveForm";
import { TwoWrists } from "@/components/TwoWrists";
import { FAQS, FEATURES, QUOTE, STATS } from "@/lib/content";
import s from "./home.module.css";

export default function Home() {
  return (
    <>
      <ScrollStory />

      <section className={`section ${s.proof}`} aria-labelledby="proof-h">
        <div className="wrap">
          <div className={s.proofHead}>
            <h2 id="proof-h" className="h2">
              You take it off for dinner. <em>Your body doesn’t.</em>
            </h2>
          </div>
          <TwoWrists />
          <ul className={s.stats}>
            {STATS.map((st) => (
              <li key={st.figure}>
                <p>
                  <em className={s.figure}>{st.figure}</em> {st.text}
                </p>
                <span className="source">{st.source}</span>
              </li>
            ))}
          </ul>
          <figure className={s.quote}>
            <blockquote>“{QUOTE.text}”</blockquote>
            <figcaption>
              {QUOTE.name}, <span className="muted">{QUOTE.role.toLowerCase()}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section" aria-labelledby="tracks-h">
        <div className="wrap stack">
          <h2 id="tracks-h" className="h2">
            Everything a tracker does, <em>none of the look</em>
          </h2>
          <ul className={s.features}>
            {FEATURES.map((f) => (
              <li key={f.name} data-flush={"flush" in f ? "true" : undefined}>
                <h3>{f.name}</h3>
                <p>{f.line}</p>
              </li>
            ))}
          </ul>
          <Link href="/how-it-works" className="btn-link">
            See how it works
          </Link>
        </div>
      </section>

      <section className={`section ${s.fit}`} aria-labelledby="fit-h">
        <div className={`wrap ${s.split}`}>
          <div className="stack">
            <h2 id="fit-h" className="h2">
              Sized to you, <em>because it has to be</em>
            </h2>
            <p className="lead">
              Every Sházia is made to your wrist measurement. A close fit is what lets the sensor read accurately, so sizing isn’t an
              extra; it’s how it works. Measure at home with a strip of paper, or book a private fitting.
            </p>
            <div>
              <Link href="/customise" className="btn">
                Design yours
              </Link>
            </div>
          </div>
          <ol className={s.steps}>
            <li>
              <b>Choose a design</b>
              <span>Sola, Rosa, Lumière or Verde</span>
            </li>
            <li>
              <b>Pick your metal</b>
              <span>Yellow or rose gold</span>
            </li>
            <li>
              <b>Add your size</b>
              <span>Wrist measurement, or a fitting</span>
            </li>
            <li>
              <b>Engrave it</b>
              <span>A word or date on the inside</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="compare-h">
        <div className="wrap stack">
          <h2 id="compare-h" className="h2">
            The only one you’d <em>wear to dinner</em>
          </h2>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <caption className="sr-only">How Sházia compares with other wearables</caption>
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Sházia</th>
                  <th scope="col">Smart ring</th>
                  <th scope="col">Fitness band</th>
                  <th scope="col">Smartwatch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Looks like fine jewellery</th>
                  <td>Yes</td>
                  <td>Partly</td>
                  <td>No</td>
                  <td>No</td>
                </tr>
                <tr>
                  <th scope="row">Made to your wrist measurement</th>
                  <td>Yes</td>
                  <td>Ring sizes</td>
                  <td>Strap</td>
                  <td>Strap</td>
                </tr>
                <tr>
                  <th scope="row">No screen</th>
                  <td>Yes</td>
                  <td>Yes</td>
                  <td>Some</td>
                  <td>No</td>
                </tr>
                <tr>
                  <th scope="row">Hot flash tracking built in</th>
                  <td>Built for it</td>
                  <td>Logged by hand</td>
                  <td>No</td>
                  <td>No</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="source">General comparison of product categories as of November 2026. {/* TODO: CONFIRM sensing rows with Divyansh */}</p>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-h">
        <div className="wrap stack">
          <h2 id="faq-h" className="h2">
            Before you <em>reserve</em>
          </h2>
          <div className={s.faq}>
            {FAQS.slice(1, 5).map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
          <Link href="/faq" className="btn-link">
            Read every answer
          </Link>
        </div>
      </section>

      <section className="section section-teal" aria-labelledby="join-h">
        <div className={`wrap ${s.join}`}>
          <h2 id="join-h" className="h2">
            Be one of the <em>first to wear it</em>
          </h2>
          <p className="lead">Launching in the new year. Founding members get the first pieces, a private fitting, and engraving on us. A $50 deposit holds your place, fully refundable any time.</p>
          {/* TODO: CONFIRM founding perks */}
          <ReserveForm compact />
        </div>
      </section>
    </>
  );
}
