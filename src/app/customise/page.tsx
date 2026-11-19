import type { Metadata } from "next";
import { Suspense } from "react";
import { Customiser } from "@/components/Customiser";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "Customise yours",
  description: "Choose your Sházia design and metal, add your wrist size and an engraving, then reserve it with a refundable deposit.",
  alternates: { canonical: "/customise" },
};

export default function CustomisePage() {
  return (
    <div className={`wrap ${s.page}`}>
      <header className={s.head}>
        <h1 className={s.h1}>
          Make it <em>yours</em>
        </h1>
        <p className="lead">Four choices, then reserve. Your bangle updates as you go.</p>
      </header>
      <Suspense>
        <Customiser />
      </Suspense>
    </div>
  );
}
