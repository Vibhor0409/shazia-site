import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Viewer } from "@/components/Viewer";
import { DESIGNS, SITE } from "@/lib/content";
import s from "../../pages.module.css";

export function generateStaticParams() {
  return DESIGNS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = DESIGNS.find((x) => x.slug === slug);
  if (!d) return {};
  return {
    title: `${d.name}, ${d.tagline.toLowerCase()}`,
    description: `${d.description} A Sházia bangle with a hidden health sensor, made to your wrist.`,
    alternates: { canonical: `/collection/${d.slug}` },
  };
}

export default async function Design({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = DESIGNS.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const d = DESIGNS[i];
  const next = DESIGNS[(i + 1) % DESIGNS.length];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `Sházia ${d.name}`,
      description: d.description,
      brand: { "@type": "Brand", name: "Sházia" },
      image: `${SITE.url}${d.image}`,
      // Offers are added once pricing is public.
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Collection", item: `${SITE.url}/collection` },
        { "@type": "ListItem", position: 2, name: d.name, item: `${SITE.url}/collection/${d.slug}` },
      ],
    },
  ];

  return (
    <div className={`wrap ${s.page}`}>
      <nav aria-label="Breadcrumb" className={s.crumbs}>
        <ol>
          <li>
            <Link href="/collection">Collection</Link>
          </li>
          <li aria-current="page">{d.name}</li>
        </ol>
      </nav>
      <div className={s.split} style={{ marginTop: 24 }}>
        <Viewer metal={d.metal} extra={d.extra} fallback={d.image} alt={d.alt} />
        <div className="stack">
          <h1 className={s.h1}>
            {d.name}, <em>{d.tagline.toLowerCase()}</em>
          </h1>
          <p className="lead">{d.description}</p>
          <ul className={s.assure}>
            <li>Made to your wrist measurement</li>
            <li>Sensor window and gold contacts on the inside</li>
            <li>Hinged clasp, no screen, magnetic charging dock</li>
            <li>Yellow or rose gold</li>
          </ul>
          <p className="muted">Founding members hear pricing first.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href={`/customise?design=${d.slug}`} className="btn">
              Customise {d.name}
            </Link>
            <Link href="/reserve" className="btn-secondary">
              Reserve yours
            </Link>
          </div>
        </div>
      </div>
      <div className={s.next}>
        <span>Next: {next.name}</span>
        <Link href={`/collection/${next.slug}`} className="btn-link">
          See {next.name}
        </Link>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </div>
  );
}
