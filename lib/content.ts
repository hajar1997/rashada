/**
 * Single source of site content. Images are optional: anything without a `src`
 * renders the neutral placeholder from the Figma file until real assets land.
 */

export type ImageAsset = {
  src: string;
  alt: string;
  /** CSS object-position for cropped frames, e.g. "50% 31%" to match a Figma crop. Defaults to centre. */
  position?: string;
};

export const profile = {
  name: "Rashada Gurbanova",
  initials: "GR",
  role: "UX/UI Designer",
  location: "Baku, Azerbaijan",
  email: "gurbanovarashada@gmail.com",
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
  ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Adobe XD", "Procreate"],
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


export const projectCategories = ["Website", "Mobile App", "SaaS", "Graphic Design"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type GalleryItem =
  | { span: "full" | "half"; image?: ImageAsset }
  /** A full case-study board (e.g. a 1440px Figma frame), shown wide and uncropped at its own ratio. */
  | { span: "board"; image: ImageAsset; width: number; height: number }
  /** A paragraph of case-study copy between boards. */
  | { span: "text"; text: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  categories: readonly ProjectCategory[];
  cover?: ImageAsset;
  /** Vector cover built in code (used instead of `cover`), e.g. the Revit icon grid. */
  coverArt?: "revit-icons";
  /** Closing credit for a collaborator, shown at the end of the project page. */
  collaborator?: { name: string; href: string };
  /** Card meta line ("Mobile App · 2024"); cards without it show the summary instead. */
  meta?: readonly string[];
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

// TODO(content): replace placeholder projects with real case studies.
/**
 * Boards from the Figma "EasyDine" page, top to bottom: [frame name, height] (all 1440 wide).
 * Images live in public/images/projects/easydine/<slug>.webp — refresh them with
 * scripts/import-board-images.mjs after exporting the frames from Figma.
 */
const easyDineBoards: readonly (readonly [string, number])[] = [
  ["Mockups", 1024],
  ["Mockups 2", 1024],
  ["Project Overview", 1024],
  ["Design Timeline", 630],
  ["User Interviews", 1042],
  ["Surveys", 1652],
  ["Empathy Maps", 2037],
  ["Personas", 1881],
  ["Benchmarking", 1355],
  ["Problem Statements", 909],
  ["User Story", 538],
  ["Information Architecture", 2311],
  ["User Flow", 2846],
  ["Wireframes", 2957],
  ["Design System", 3163],
  ["UI Mockups", 898],
  ["UI App 1", 2743],
  ["UI App 2", 1076],
  ["UI App 3", 3892],
  ["UI App 4", 2910],
  ["UI App 5", 746],
  ["Responsive Website", 6697],
  ["Websites", 3230],
  ["Dashboards", 1103],
  ["User Testing", 1287],
  ["Maze Usability", 1275],
  ["Ending", 401],
];

const boardSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const easyDine: Project = {
  slug: "easydine",
  title: "EasyDine",
  summary: "Your table awaits — easy reservations, unforgettable dining. A UX/UI case study for a restaurant booking app and website.",
  description:
    "Reserving a table often means long calls, unclear availability, and little information about the restaurant. EasyDine is a platform where diners quickly find nearby restaurants, book instantly, and get personalised recommendations — while restaurants manage reservations and reach more customers. Three months, 10 interviews, 55+ surveys and 60+ screens, from research through testing.",
  categories: ["Website", "Mobile App"],
  cover: {
    src: "/images/projects/easydine-cover.webp",
    alt: "EasyDine UX/UI case study cover: logo, tagline and the app's home screen",
    position: "50% 31%", // Figma's crop on the projects card
  },
  meta: ["Mobile App", "2024"],
  gallery: easyDineBoards.map(([name, height]) => ({
    span: "board",
    image: { src: `/images/projects/easydine/${boardSlug(name)}.webp`, alt: `EasyDine — ${name}` },
    width: 1440,
    height,
  })),
};

/** Boards from the Figma "Plugin Icons (details)" frame, all 800 wide. */
const bimixBoard = (file: string, alt: string, height: number): GalleryItem => ({
  span: "board",
  image: { src: `/images/projects/bimix-plugin-icons/${file}.webp`, alt },
  width: 800,
  height,
});

const bimixIcons: Project = {
  slug: "bimix-plugin-icons",
  title: "BIMix Plugin Icons",
  summary: "A product icon system for a suite of Revit plugins.",
  description: [
    "A product icon system for a suite of Revit plugins.",
    "This project focuses on designing a unified icon family for BIMix's Revit plugins. The aim was to make specialized BIM tools, from architecture and structure to MEP and safety, easy to recognize at a glance, both inside Revit and across the BIMix platform.",
    "Each icon combines a clean outline with a single blue accent that highlights the core idea of the tool. This keeps the set consistent while giving every plugin its own identity.",
    "The system is designed for both dark and light modes, so the icons stay clear and balanced in any interface.",
  ].join("\n\n"),
  categories: ["Graphic Design"],
  coverArt: "revit-icons",
  meta: ["Graphic Design", "2026"],
  collaborator: { name: "Sarkhan Salahzada", href: "https://www.linkedin.com/in/sarkhansalahzada/" },
  gallery: [
    bimixBoard("dark-icon-set", "BIMix plugin icons — full set in dark mode", 511),
    bimixBoard("light-icon-set", "BIMix plugin icons — full set in light mode", 511),
    {
      span: "text",
      text: "With 54 icons built on a shared 32px grid and a 4px stroke, the set is ready to grow alongside the BIMix product line.",
    },
    bimixBoard("grid-system", "Icon grid system: keylines, padding and stroke construction", 513),
    bimixBoard("marketplace", "The icons in use on the BIMix plugin marketplace", 511),
  ],
};

export const projects: readonly Project[] = [
  bimixIcons,
  easyDine,
  // TODO(content): the one remaining placeholder from the Figma projects page.
  {
    slug: "project-3",
    title: "Project name 3",
    summary: placeholderSummary,
    description: placeholderDescription,
    categories: ["Website", "Mobile App", "Graphic Design"],
    gallery: placeholderGallery,
  },
];

export const featuredProjects = projects.slice(0, 3);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export const playgroundCategories = ["Animation", "Illustration", "Visuals", "Art", "Geometry"] as const;
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
    id: "portrait",
    kind: "photo",
    image: { src: "/images/portrait.png", alt: "Rashada resting her chin in her hands, pulling a face" },
  },
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
