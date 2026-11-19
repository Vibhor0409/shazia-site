import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/reserve/deposit", "/reserve/checkout", "/reserve/confirmed"] },
      // answer engines and AI assistants are welcome to read and cite the site
      { userAgent: ["Googlebot", "meta-webindexer", "GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
