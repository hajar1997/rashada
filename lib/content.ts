/**
 * Single source of site content. Images are optional: anything without a `src`
 * renders the neutral placeholder from the Figma file until real assets land.
 */

export type ImageAsset = {
  src: string;
  alt: string;
};

export const profile = {
  name: "Rashada Gurbanova",
  initials: "GR",
  role: "UX/UI Designer",
  location: "Baku, Azerbaijan",
  email: "gurbanovarashada@gmail.com",
  avatar: { src: "/images/avatar.png", alt: "Portrait of Rashada Gurbanova" },
  intro:
    "Hey! I'm Rashada - a UX/UI designer based in Baku who's spent the last 3 years untangling complex SaaS, web, and mobile products into something people can actually navigate without a manual. My days are a mix of user research, pixel-perfect UI kits, and a lot of translating “how it works” into “how it should feel.” Before design, I trained in fine art - that eye for detail never left.",
  story: [
    "Honestly, I didn't plan any of this - the path kind of found me. I started at the Azerbaijan Academy of Fine Arts, then trained in traditional art under teachers from London's King's Foundation School of Traditional Arts, before moving into industrial design. Somewhere in there, making things beautiful stopped being enough on its own - I wanted my work to actually solve something for people. That's what eventually pulled me into UX/UI, and it's felt like the right fit ever since.",
    "These days, that means leading design systems for engineering tools - taking dense, technical workflows used by BIM specialists and architects and turning them into interfaces that don't need a manual. Along the way I've worked across SaaS dashboards, mobile apps, and websites, for clients ranging from architecture firms to law firms to freelance projects scattered around the world. Every project looks different on the surface, but the instinct underneath is always the same: find where people get stuck, and clear the way through.",
    "Outside of client work, you'll still catch me painting. That part of me never really left - it just found a new outlet.",
  ],
} as const;

/** Rows mirror the Figma composition on wider screens; on mobile they reflow as one list. */
export const services: readonly (readonly string[])[] = [
  ["UX Research", "UI Design", "Branding", "Visual design", "Illustration"],
  ["Information Architecture", "User Personas", "Design Systems", "Wireframing"],
  ["Prototyping", "User Flow", "Usability & A/B Testing", "CJM", "UI Kit"],
  ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Adobe XD", "Claude", "Procreate"],
];

export type TimelineEntry = {
  title: string;
  period: string;
  location: string;
  mode: string;
  logo: "bimix" | { label: string };
};

export const experience: readonly TimelineEntry[] = [
  {
    title: "UX/UI Designer at BIMix",
    period: "December 2025 - Present",
    location: "Baku, Azerbaijan",
    mode: "On site",
    logo: "bimix",
  },
  {
    title: "UX/UI Designer at SIP LLC",
    period: "June 2024 - December 2025",
    location: "Baku, Azerbaijan",
    mode: "Hybrid",
    logo: { label: "SIP" },
  },
];

// TODO(content): Figma currently reuses the experience entries here — replace with real education history.
export const education: readonly TimelineEntry[] = experience;

export const projectCategories = ["Website", "Mobile app", "SaaS"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type GalleryItem = {
  span: "full" | "half";
  image?: ImageAsset;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  categories: readonly ProjectCategory[];
  cover?: ImageAsset;
  gallery: readonly GalleryItem[];
};

const placeholderSummary =
  "Lorem ipsum dolor sit amet consectetur. Pharetra pellentesque vitae bibendum elit ultrices molestie. Eu luctus bibendum et aliquet duis.";
const placeholderDescription =
  "Lorem ipsum dolor sit amet consectetur. Sem convallis felis nisi nec ornare tincidunt integer interdum. Lectus at interdum eu tincidunt. Lacinia cursus gravida egestas laoreet libero lacus. Cursus iaculis lorem ut odio. Non neque mi elit pharetra pulvinar mattis. Dictum ut curabitur ac odio amet felis eu augue.";
const placeholderGallery: readonly GalleryItem[] = [
  { span: "full" },
  { span: "half" },
  { span: "half" },
  { span: "full" },
  { span: "half" },
  { span: "half" },
  { span: "full" },
];
const placeholderCategories: readonly (readonly ProjectCategory[])[] = [
  ["Website", "SaaS"],
  ["Website", "Mobile app"],
  ["Website"],
  ["Website", "SaaS"],
  ["Website", "Mobile app"],
  ["Website"],
];

// TODO(content): replace placeholder projects with real case studies.
export const projects: readonly Project[] = placeholderCategories.map((categories, index) => ({
  slug: `project-${index + 1}`,
  title: `Project name ${index + 1}`,
  summary: placeholderSummary,
  description: placeholderDescription,
  categories,
  gallery: placeholderGallery,
}));

export const featuredProjects = projects.slice(0, 3);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const playgroundCategories = ["Illustration", "Animation", "Visuals", "Art", "Geometry"] as const;
export type PlaygroundCategory = (typeof playgroundCategories)[number];

export type PlaygroundItem = {
  id: string;
  category: PlaygroundCategory;
  image?: ImageAsset;
  /** Interactive piece rendered in place of an image. */
  demo?: "signature" | "collectibles" | "emotions";
};

/** Interactive demos by item id; everything else is artwork. */
const playgroundDemos: Record<string, PlaygroundItem["demo"]> = {
  "animation-1": "signature",
  "animation-2": "collectibles",
  "animation-3": "emotions",
};

// TODO(content): add playground artwork.
export const playground: readonly PlaygroundItem[] = playgroundCategories.flatMap((category) =>
  [1, 2, 3].map((n) => {
    const id = `${category.toLowerCase()}-${n}`;
    return { id, category, demo: playgroundDemos[id] };
  }),
);

/**
 * A tag pill on the "What inspires me" card: centre point (px within the 256×354 card) and tilt.
 * Kept above y≈270 so the pills clear the "Drag" hint at the bottom of the card.
 */
export type InspirationTag = { label: string; x: number; y: number; rotate: number; filled?: boolean };

export type AboutCard =
  | { id: string; kind: "photo"; image: ImageAsset }
  | { id: string; kind: "tags"; title: string; tags: readonly InspirationTag[] }
  | { id: string; kind: "letter"; letter: string }
  | { id: string; kind: "quote"; text: string; author: string };

/** The draggable card stack at the end of the about page (Figma "Cards" frame plus quotes). */
export const aboutCards: readonly AboutCard[] = [
  {
    id: "inspiration",
    kind: "tags",
    title: "What inspires me:",
    tags: [
      { label: "Nature", x: 66, y: 104, rotate: -12 },
      { label: "Cartoon", x: 182, y: 98, rotate: 14 },
      { label: "Food", x: 128, y: 152, rotate: 4, filled: true },
      { label: "Books", x: 62, y: 200, rotate: -8 },
      { label: "Creating", x: 184, y: 198, rotate: -10, filled: true },
      { label: "People", x: 84, y: 252, rotate: 9 },
      { label: "Jazz", x: 180, y: 250, rotate: -4 },
    ],
  },
  {
    id: "portrait",
    kind: "photo",
    image: { src: "/images/portrait.png", alt: "Rashada resting her chin in her hands, pulling a face" },
  },
  { id: "monogram", kind: "letter", letter: "R" },
  { id: "quote-pop", kind: "quote", text: "Can you make it pop a little more?", author: "Every client, ever" },
  {
    id: "quote-adams",
    kind: "quote",
    text: "Creativity is allowing yourself to make mistakes. Design is knowing which ones to keep.",
    author: "Scott Adams",
  },
  {
    id: "quote-rand",
    kind: "quote",
    text: "Design is so simple, that's why it is so complicated.",
    author: "Paul Rand",
  },
  { id: "quote-logo", kind: "quote", text: "Can we make the logo bigger?", author: "Also every client" },
  {
    id: "quote-speth",
    kind: "quote",
    text: "If you think good design is expensive, you should look at the cost of bad design.",
    author: "Ralf Speth",
  },
];
