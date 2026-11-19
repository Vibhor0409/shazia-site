import type { MetadataRoute } from "next";
import { DESIGNS, SITE } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["", "/collection", ...DESIGNS.map((d) => `/collection/${d.slug}`), "/customise", "/how-it-works", "/our-story", "/faq", "/reserve", "/privacy", "/deposit-terms"];
  return paths.map((p) => ({ url: `${SITE.url}${p}`, lastModified: now }));
}
