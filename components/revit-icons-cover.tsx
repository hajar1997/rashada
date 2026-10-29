/**
 * Cover for "Icons for Revit Plugins", rebuilt from the Figma card as one vector graphic (752×480):
 * eight numbered plugin icons on a dark grid. Icons are Figma's own SVG exports, so it stays sharp at any size.
 */

const DIR = "/images/projects/revit-icons";
const COLUMNS = [35, 205, 376, 547, 717];
const ROWS = [35, 240, 445];
const CELL_X = [39, 209, 380, 551];

/** [file, label, icon box x, y, width, height] — two icons are trimmed groups with their own boxes. */
const ICONS: readonly (readonly [string, string, number, number, number, number])[] = [
  ["drywall-profile", "Drywall Profile", 74, 91, 92, 92],
  ["evacuation-simulator", "Evacuation Simulator", 245, 91, 92, 92],
  ["isometric-view", "Isometric View", 416, 91, 92, 92],
  ["levels-manager", "Levels Manager", 590.31, 98.19, 83.375, 77.505],
  ["hvac-selector", "HVAC Selector", 75.63, 307.94, 79.885, 66.125],
  ["fire-system", "Fire System", 245, 295, 92, 92],
  ["floor-generator", "Floor Generator", 416, 295, 92, 92],
  ["solar-system", "Solar System", 586, 295, 92, 92],
];

export function RevitIconsCover({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 752 480"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Eight Revit plugin icons: Drywall Profile, Evacuation Simulator, Isometric View, Levels Manager, HVAC Selector, Fire System, Floor Generator and Solar System"
      className={`block size-full bg-[#05070a] ${className}`}
    >
      <g stroke="#2d3338">
        {COLUMNS.map((x) => (
          <line key={`c${x}`} x1={x + 0.5} x2={x + 0.5} y1={0} y2={480} />
        ))}
        {ROWS.map((y) => (
          <line key={`r${y}`} x1={0} x2={752} y1={y + 0.5} y2={y + 0.5} />
        ))}
      </g>

      <g fill="#4e5a64" className="font-sans text-[14px] tracking-[-0.5px]">
        {ICONS.map(([file, label], index) => {
          const x = CELL_X[index % 4];
          const top = index < 4 ? 54 : 244;
          return (
            <g key={file}>
              <text x={x} y={top + 13.5}>
                {String(index + 1).padStart(2, "0")}
              </text>
              <text x={x} y={(index < 4 ? 218 : 423) + 13.5}>
                {label}
              </text>
            </g>
          );
        })}
      </g>

      {ICONS.map(([file, , x, y, width, height]) => (
        <image key={file} href={`${DIR}/${file}.svg`} x={x} y={y} width={width} height={height} />
      ))}
    </svg>
  );
}
