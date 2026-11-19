export const SITE = {
  name: "Sházia",
  url: "https://xn--shzia-yqa.com",
  email: "hello@xn--shzia-yqa.com", // TODO: CONFIRM contact address
  instagram: "https://www.instagram.com/", // TODO: CONFIRM handle
  description:
    "Sházia is fine jewellery that tracks your health. A bangle sized to your wrist, with a hidden sensor that reads sleep, stress, your cycle and hot flashes.",
};

export type DesignSlug = "sola" | "rosa" | "lumiere" | "verde";
export type Metal = "yellow" | "rose";

export const DESIGNS: {
  slug: DesignSlug;
  name: string;
  tagline: string;
  description: string;
  metal: Metal;
  extra: "pave" | "emeralds" | null;
  image: string;
  alt: string;
}[] = [
  {
    slug: "sola",
    name: "Sola",
    tagline: "Polished gold",
    description:
      "The everyday piece. A clean, polished band that goes from a morning run to a late dinner without a second thought.",
    metal: "yellow",
    extra: null,
    image: "/images/01-plain-yellow-gold-cut.webp",
    alt: "Sola, a plain polished gold bangle with the oval sensor window visible on the inner wall and the hinge on the right",
  },
  {
    slug: "rosa",
    name: "Rosa",
    tagline: "Rose gold",
    description: "The same form in a softer, warmer metal that flatters every skin tone.",
    metal: "rose",
    extra: null,
    image: "/images/02-plain-rose-gold-cut.webp",
    alt: "Rosa, a plain polished rose gold bangle with the oval sensor window visible inside",
  },
  {
    slug: "lumiere",
    name: "Lumière",
    tagline: "Set with light",
    description:
      "Pavé stones across the top for evenings out. The sensor sits exactly where it does on every other piece.",
    metal: "yellow",
    extra: "pave",
    image: "/images/04-diamond-cut.webp",
    alt: "Lumière, a gold bangle set with clear pavé stones, with the sensor window visible on the inner wall",
  },
  {
    slug: "verde",
    name: "Verde",
    tagline: "Emerald row",
    description: "Nine graduated created emeralds along the top. The statement piece.",
    metal: "yellow",
    extra: "emeralds",
    image: "/images/03-emerald-cut.webp",
    alt: "Verde, a gold bangle with a row of nine graduated emerald-cut created emeralds",
  },
];

export const FEATURES = [
  { name: "Sleep", line: "See how long and how well you slept, and what changed it." },
  { name: "Stress", line: "Notice the moments your body tensed up, even when you didn't." },
  { name: "Your cycle", line: "Follow your cycle through temperature, not just a calendar." },
  { name: "Hot flashes", line: "Each one logged automatically: when it started, how long, how strong.", flush: true },
  { name: "Treatment check", line: "Started something new? See week by week whether it's helping." },
  { name: "Doctor report", line: "A one-page summary to bring to your appointment." },
];

export const STATS = [
  {
    figure: "89 of 100",
    text: "women told us they would pay more for a better-looking tracker.",
    source: "Sházia interviews, 2026, 100 women",
  },
  {
    figure: "71%",
    text: "of women we surveyed who own a tracker take it off for dinners, dates and nights out.",
    source: "Sházia survey, Oct 2026, 24 tracker owners among 94 verified responses",
  },
  {
    figure: "1 in 3",
    text: "people find fitness trackers too unattractive to wear.",
    source: "Gartner consumer survey, 2016, 9,592 respondents",
  },
];

export const QUOTE = {
  text: "You're solving the one problem I have with health trackers: they look ugly.",
  name: "Kelly Fong",
  role: "One of our first customers",
};

export const FAQS = [
  {
    q: "What is Sházia?",
    a: "Sházia is fine jewellery that tracks your health. Each bangle has a small sensor window on the inside that reads your pulse, skin temperature and skin response, and an app turns that into insights on sleep, stress, your cycle and hot flashes.",
  },
  {
    q: "Is the $50 deposit refundable?",
    a: "Yes. The deposit holds your place on the founding list and is fully refundable at any time before your order is confirmed. It is credited in full towards your bangle.",
  },
  {
    q: "When does it ship?",
    a: "Sházia launches in the new year. Founding members get the first production pieces, and we will share delivery dates with the founding list before anyone confirms an order.",
  },
  {
    q: "How is it sized?",
    a: "Every Sházia is made to your wrist measurement. A close fit keeps the sensor in contact with your skin, which is how it reads accurately. You can measure at home with a strip of paper, or book a private fitting.",
  },
  {
    q: "How do I charge it?",
    a: "It sits on a small magnetic dock that charges through two hidden pads on the inside of the band. There is no cable to plug in and no port on the jewellery.",
  },
  {
    q: "Is it waterproof?",
    a: "It is designed for everyday wear, including hand-washing and rain. Final water-resistance ratings will be published after testing.", // TODO: CONFIRM rating
  },
  {
    q: "Does it work if I'm on hormone therapy?",
    a: "Yes. Treatment check is built for exactly that: tell the app what you've started and it compares your patterns week by week.", // TODO: CONFIRM wording with the team
  },
  {
    q: "What happens to my data?",
    a: "Your health data belongs to you. We never sell it, and you can export or delete it at any time. Our full privacy policy will be published before launch.", // TODO: CONFIRM privacy wording
  },
  {
    q: "Is it a medical device?",
    a: "No. Sházia gives wellness guidance and patterns to discuss with your doctor. It does not diagnose or treat any condition.",
  },
];

export const CHAPTERS = [
  {
    eyebrow: "Health, worn beautifully",
    title: "Sházia is fine jewellery that",
    accent: "tracks your health",
    body: "Sleep, stress, your cycle and hot flashes, read quietly from inside a bangle sized to your wrist.",
    hero: true,
  },
  {
    eyebrow: "The form",
    title: "A hinged oval,",
    accent: "sized to you",
    body: "Shaped like a real wrist, not a circle. A close fit keeps the sensor where it needs to be, so every piece is made to your measurement.",
    spec: [["Shape", "Oval, hinged"], ["Band", "About 6.7 mm wide"], ["Screen", "None"]],
  },
  {
    eyebrow: "The sensor",
    title: "A window you'd",
    accent: "mistake for onyx",
    body: "On the inside, against your skin, a smoked-glass window is designed to read your pulse and skin temperature, day and night. No lights, nothing to explain at dinner.",
    spec: [["Reads", "Pulse, skin temperature, motion"], ["Where", "Inner wall, under the wrist"]],
  },
  {
    eyebrow: "The contacts",
    title: "Two gold points",
    accent: "that notice",
    body: "Either side of the window, two gold inlays track tiny changes in your skin, the signal behind stress and hot flashes.",
    spec: [["Tracks", "Stress, hot flashes, sleep quality"], ["Material", "Gold, set flush"]],
  },
  {
    eyebrow: "Inside",
    title: "Under the gold,",
    accent: "a whole lab",
    body: "A circuit thinner than a credit card curves around your wrist, with two curved batteries, a Bluetooth chip and five sensors. All of it sealed inside, so all anyone ever sees is the jewellery.",
    spec: [["Circuit", "Flexible, about 0.2 mm thin"], ["Power", "Two curved cells"], ["Sensors", "Pulse, two temperature, skin response, motion"]],
  },
  {
    eyebrow: "The clasp",
    title: "Opens wide,",
    accent: "closes flush",
    body: "A jeweller's hinge at the side lets it open over your hand and close with no gap. It charges on a small dock through two hidden pads.",
    spec: [["Clasp", "Hinge with hidden catch"], ["Charging", "Magnetic dock"]],
  },
  ...DESIGNS.map((d) => ({
    eyebrow: "The collection",
    title: `${d.name},`,
    accent: d.tagline.toLowerCase(),
    body: d.description,
    design: d.slug,
  })),
] as const;
