/**
 * Converts exported case-study boards into the web images the project pages use.
 *
 *   node scripts/import-board-images.mjs <project-slug> <folder-of-exports>
 *   e.g. node scripts/import-board-images.mjs easydine ~/Downloads/EasyDine
 *
 * Export the frames from Figma as PNG (2x recommended) and keep Figma's default file names
 * ("Project Overview.png", "UI App 1@2x.png", ...). Each file becomes
 * public/images/projects/<project-slug>/<frame-slug>.webp, capped at 2400px wide.
 */
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [project, source] = process.argv.slice(2);
if (!project || !source) {
  console.error("Usage: node scripts/import-board-images.mjs <project-slug> <folder-of-exports>");
  process.exit(1);
}

const out = path.join("public", "images", "projects", project);
await mkdir(out, { recursive: true });

/** "UI App 1@2x.png" → "ui-app-1" (matches the slugs in lib/content.ts). */
const slugOf = (file) =>
  path
    .parse(file)
    .name.replace(/@\d+(\.\d+)?x$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const files = (await readdir(source)).filter((file) => /\.(png|jpe?g|webp)$/i.test(file));
for (const file of files) {
  const target = path.join(out, `${slugOf(file)}.webp`);
  const { width, height } = await sharp(path.join(source, file))
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(target);
  console.log(`${file} → ${target} (${width}×${height})`);
}
