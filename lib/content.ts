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
  /** One-line summary under the name on the home page. */
  tagline: "UX/UI Designer turning complex SaaS, web and mobile products into interfaces that feel simple and intuitive.",
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


export const projectCategories = ["Website", "Mobile App", "SaaS", "Visual Design"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type GalleryItem =
  | { span: "full" | "half"; image?: ImageAsset }
  /** A full case-study board (e.g. a 1440px Figma frame), shown wide and uncropped at its own ratio. */
  | { span: "board"; image: ImageAsset; width: number; height: number }
  /** A paragraph of case-study copy between boards. */
  | { span: "text"; text: string }
  /** A titled block of case-study copy; each entry in `lines` is its own line/paragraph. */
  | { span: "section"; title: string; lines: readonly string[] }
  /** A video slot; shows a "coming soon" placeholder until `src` is set. */
  | { span: "video"; label: string; src?: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  categories: readonly ProjectCategory[];
  cover?: ImageAsset;
  /** Cover for the project page when it differs from the card's (shown at 752:480). */
  pageCover?: ImageAsset;
  /** Vector cover built in code (used instead of `cover`), e.g. the Revit icon grid. */
  coverArt?: "revit-icons";
  /** Collaborator, linked wherever `{collaborator}` appears in `role`. */
  collaborator?: { name: string; href: string };
  /** "My role:" paragraph after the description; `{collaborator}` becomes a link to them. */
  role?: string;
  /** Card meta line ("Mobile App · 2024"); cards without it show the summary instead. */
  meta?: readonly string[];
  gallery: readonly GalleryItem[];
};

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
  ].join("\n\n"),
  categories: ["Visual Design"],
  coverArt: "revit-icons",
  meta: ["Visual Design", "2026"],
  collaborator: { name: "Sarkhan Salahzada", href: "https://www.linkedin.com/in/sarkhansalahzada/" },
  role: "I designed this icon system together with my colleague {collaborator}. As a team, we defined the core rules of the set: the 32px grid, 4px stroke, keyline shapes and the single blue accent, so that every new icon would fit the family naturally. We worked closely with the plugin developers and BIM specialists to understand what each tool does and turn it into a simple, recognizable metaphor. The system is designed for both dark and light modes, so the icons stay clear and balanced in any interface.",
  gallery: [
    bimixBoard("dark-icon-set", "BIMix plugin icons — full set in dark mode", 511),
    bimixBoard("light-icon-set", "BIMix plugin icons — full set in light mode", 511),
    bimixBoard("grid-system", "Icon grid system: keylines, padding and stroke construction", 513),
    bimixBoard("marketplace", "The icons in use on the BIMix plugin marketplace", 511),
  ],
};

const bimixPlugins: Project = {
  slug: "bimix-plugins",
  title: "BIMix Plugins",
  summary: "UX/UI design for a suite of 25+ Revit plugins.",
  description: [
    "UX/UI design for a suite of 25+ Revit plugins",
    "BIMix builds Revit plugins for architects, BIM specialists and MEP engineers. Before I joined there was no designer: developers made the interfaces, so the plugins looked and worked differently and had many UX problems.",
    "As a UX/UI designer, I worked with developers and BIM specialists. I researched and designed new plugins from scratch and, in parallel, helped build the BIMix design system. The goal was a clean, consistent SaaS-like experience inside Revit.",
    "Below are four plugins, one from each discipline.",
  ].join("\n\n"),
  categories: ["SaaS"],
  cover: { src: "/images/projects/bimix-plugins/card-cover.webp", alt: "BIMix Plugins — Revit LT logo and the BIMix mark" },
  pageCover: { src: "/images/projects/bimix-plugins/page-cover.webp", alt: "BIMix Plugins — Revit LT logo and the BIMix mark" },
  meta: ["SaaS Design", "2026"],
  gallery: [
    {
      span: "section",
      title: "Exporter · BIM General",
      lines: [
        "A batch export tool for Revit sheets, views and models, to PDF, DWG or image in one run.",
        "Research: I talked with architects and BIM specialists who prepare drawing sets. Exporting sheets one by one in Revit was slow, and everyone named files differently, so packages had to be checked and renamed by hand.",
        "The challenge: a project has hundreds of sheets, but each delivery needs only a few, in a set format and naming standard. One mistake meant redoing the whole export.",
        "The solution: I designed one window for the whole process. Users filter and select sheets in a familiar table, choose the format, and build the file-naming rule with a live preview. They can save the setup and reuse it next time, and a progress window confirms when the export is done.",
      ],
    },
    { span: "video", label: "Exporter plugin walkthrough", src: "/videos/bimix-plugins/exporter.mp4" },
    {
      span: "section",
      title: "Split Layers · Architecture",
      lines: [
        "A Revit tool that splits a compound wall or floor into separate elements, one per layer.",
        "Research: I talked with architects who model walls layer by layer for detailed drawings and quantities. Before the plugin they did this by hand, rebuilding each layer as a new element one at a time, which was slow and easy to get wrong.",
        "The challenge: wall type names in Revit are long and look alike, so picking the right type from a list was confusing. After splitting, doors and windows also need a host layer, or the openings break.",
        "The solution: I designed one window for the whole process. Users pick the wall from a type list or directly in the model, and its layers and thickness appear right away. They group layers, name each new wall type, and choose which layer hosts doors and windows. One click splits every matching wall, and a progress bar tracks the run.",
      ],
    },
    { span: "video", label: "Split Layers plugin walkthrough", src: "/videos/bimix-plugins/split-layers.mp4" },
    {
      span: "section",
      title: "Underfloor Heating · Mechanical",
      lines: [
        "A Revit tool that designs underfloor heating: it places the manifold, splits rooms into loops and lays out all the pipes automatically.",
        "Research: I talked with MEP engineers who design heating systems. They drew every pipe loop by hand, room by room, and checked loop lengths and manifold limits themselves. One floor could take days, and any change to the layout meant redrawing it.",
        "The challenge: a good layout depends on many rules at once: pipe spacing, distance from walls, maximum loop length, loops per manifold, and routing through doors. Engineers needed control over these rules without the tool becoming hard to use.",
        "The solution: I designed one window built around the floor plan. Users choose a level, set piping rules and Revit families once in Settings, and click a wall to place the manifold. They assign rooms to it and adjust zoning, with the plugin suggesting the number of loops and circuit length. One click lays out all the pipes and connects them to the manifold in the Revit model.",
      ],
    },
    { span: "video", label: "Underfloor Heating plugin walkthrough", src: "/videos/bimix-plugins/underfloor-heating.mp4" },
    {
      span: "section",
      title: "CCTV · Electrical",
      lines: [
        "A Revit tool for planning security cameras: it shows each camera's coverage on the plan and creates a 3D view from the camera's point of view.",
        "Research: I talked with engineers who design CCTV systems. They checked coverage by drawing zones by hand and guessing what each camera could actually see. Walls, columns and furniture often blocked the view, and nobody noticed until the cameras were installed.",
        "The challenge: coverage depends on distance (to detect, observe, recognize or identify a person), on obstacles, and on the camera's angle. Showing all of that clearly in one tool, without making it complicated, was the hard part.",
        "The solution: I designed one window with two tabs.",
        "Coverage Zones: users pick cameras on the plan and choose which categories and linked models count as obstacles. The plugin then draws the four DORI distance zones (detect, observe, recognize, identify), with blocked areas cut out.",
        "Camera Adjustment: users fine-tune pan, tilt and height with a live preview, then generate a 3D view from the camera with its field of view shown.",
      ],
    },
    { span: "video", label: "CCTV plugin walkthrough", src: "/videos/bimix-plugins/cctv.mp4" },
  ],
};

export const projects: readonly Project[] = [
  bimixPlugins,
  bimixIcons,
  easyDine,
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
