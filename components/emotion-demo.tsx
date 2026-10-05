"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Playground "Animation 3" from Figma: a face whose mood follows a slider. Dragging the knob
 * morphs everything continuously between happy → confuse → sad (colour, pupils, mouth, label);
 * releasing springs to the nearest mood. All geometry is in the Figma card's 272×265 space.
 */

type Point = readonly [number, number];

type Mood = {
  label: string;
  color: readonly [number, number, number];
  pupils: readonly [Point, Point];
  glints: readonly [Point, Point];
  /**
   * The mouth as an open line of MOUTH_POINTS points, always running left to right. `in` is used when
   * morphing in from the previous mood, `out` toward the next (they differ only for the "O").
   */
  mouth: { in: readonly Point[]; out: readonly Point[] };
};

/**
 * Every mouth is the same open stroke sampled at the same number of points, so moods morph by
 * simply sliding each point: the smile curls up into an "O" (its ends meet at the top, hidden by
 * the round caps) and then relaxes into a frown. No loops, no spinning.
 */
const MOUTH_POINTS = 48;
const samples = Array.from({ length: MOUTH_POINTS }, (_, n) => n / (MOUTH_POINTS - 1));

/** Figma's smile stroke (card coordinates). */
const SMILE_CURVE: readonly [Point, Point, Point, Point] = [
  [114, 144.91],
  [131.83, 154.47],
  [173.9, 163.27],
  [199.5, 122],
];

function cubicAt([p0, p1, p2, p3]: readonly [Point, Point, Point, Point], s: number): Point {
  const r = 1 - s;
  const [a, b, c, d] = [r * r * r, 3 * r * r * s, 3 * r * s * s, s * s * s];
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

const SMILE = samples.map((s) => cubicAt(SMILE_CURVE, s));

/** Figma's frown: the smile turned over (-165°) around the sad mouth's centre, reordered left to right. */
const FROWN = (() => {
  const from: Point = [156.75, 137.45];
  const to: Point = [136.3, 147];
  const angle = (-165 * Math.PI) / 180;
  const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
  return SMILE.map(([x, y]): Point => {
    const [dx, dy] = [x - from[0], y - from[1]];
    return [to[0] + dx * cos - dy * sin, to[1] + dx * sin + dy * cos];
  }).reverse();
})();

/**
 * The surprised "O", as a loop whose two ends meet (hidden under the round caps). It's sampled two
 * ways so it opens the natural way on each side:
 * - from the smile, the ends meet at the top (left side → bottom → right side), so the smile's
 *   tips curl up and close;
 * - toward the frown, the ends meet at the bottom (left side → top → right side), so the loop
 *   opens downward into the frown's arch.
 * Closed, the two are visually identical, so switching at the "O" itself is invisible.
 */
function ohLoop(from: "top" | "bottom") {
  const [cx, cy, rx, ry, gap] = [106, 142, 13, 20, 0.16];
  const sweep = 2 * Math.PI - 2 * gap;
  return samples.map((s): Point => {
    const a = from === "top" ? -Math.PI / 2 - gap - s * sweep : Math.PI / 2 + gap + s * sweep;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
}

const MOODS: readonly Mood[] = [
  {
    label: "happy",
    color: [0x9a, 0xd2, 0x52],
    pupils: [[96, 88], [175, 88]],
    glints: [[98.5, 91.5], [176.5, 91.5]],
    mouth: { in: SMILE, out: SMILE },
  },
  {
    label: "confuse",
    color: [0xff, 0xbe, 0x1b],
    pupils: [[86, 70], [165, 70]],
    glints: [[84.5, 66.5], [162.5, 66.5]],
    mouth: { in: ohLoop("top"), out: ohLoop("bottom") },
  },
  {
    label: "sad",
    color: [0x6f, 0xa4, 0xff],
    pupils: [[96, 79], [175, 79]],
    glints: [[95.5, 78.5], [174.5, 78.5]],
    mouth: { in: FROWN, out: FROWN },
  },
];

const LAST = MOODS.length - 1;
const TRACK_X = 62; // first stop's centre
const STOP_GAP = 74;
const SETTLE_MS = 520;

const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const lerpPoint = (a: Point, b: Point, u: number): Point => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Smooth SVG path through the points (Catmull-Rom converted to cubic Béziers). */
function smoothPath(points: readonly Point[]) {
  const f = (x: number, y: number) => `${x.toFixed(2)} ${y.toFixed(2)}`;
  const at = (n: number) => points[clamp(n, 0, points.length - 1)];
  let d = `M${f(...points[0])}`;
  for (let n = 0; n < points.length - 1; n++) {
    const [p0, p1, p2, p3] = [at(n - 1), at(n), at(n + 1), at(n + 2)];
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)}`;
    d += ` ${f(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)} ${f(...p2)}`;
  }
  return d;
}

/** Blended mood at a continuous position t ∈ [0, LAST]. */
function moodAt(t: number) {
  const i = Math.min(Math.floor(t), LAST - 1);
  const u = t - i;
  const [a, b] = [MOODS[i], MOODS[i + 1]];
  return {
    color: `rgb(${a.color.map((c, n) => Math.round(lerp(c, b.color[n], u))).join(" ")})`,
    pupils: a.pupils.map((p, n) => lerpPoint(p, b.pupils[n], u)),
    glints: a.glints.map((p, n) => lerpPoint(p, b.glints[n], u)),
    mouth: smoothPath(a.mouth.out.map((p, n) => lerpPoint(p, b.mouth.in[n], u))),
  };
}

/** Eye-white centres; a pupil (r 9) can travel up to LOOK_RANGE from centre and stay inside (r 30). */
const EYES: readonly [Point, Point] = [
  [96, 79],
  [175, 79],
];
const LOOK_RANGE = 17;

/** Where a pupil sits when its eye looks at `target`: further away pulls it closer to the rim. */
function lookFrom(eye: Point, target: Point): Point {
  const [dx, dy] = [target[0] - eye[0], target[1] - eye[1]];
  const distance = Math.hypot(dx, dy);
  if (distance < 0.01) return eye;
  const reach = LOOK_RANGE * (1 - Math.exp(-distance / 60));
  return [eye[0] + (dx / distance) * reach, eye[1] + (dy / distance) * reach];
}

/** Gentle overshoot so the knob lands with a little bounce, like a spring. */
const easeOutBack = (x: number) => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2;

export function EmotionDemo() {
  const [t, setT] = useState(0);
  const tRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef(0);
  const dragging = useRef(false);
  const [focused, setFocused] = useState(false);
  /**
   * Where the eyes look (card units) and how much (0 = mood's resting pupils, 1 = at the pointer).
   * Eased in JS and drawn with plain cx/cy — CSS transform transitions on SVG left smudgy repaint
   * trails ("dust") behind the pupils, especially under the page's CSS zoom.
   */
  const [gaze, setGaze] = useState<{ point: Point; blend: number }>({ point: EYES[0], blend: 0 });
  const gazeRef = useRef(gaze);
  const gazeTarget = useRef<Point | null>(null);
  const gazeFrame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(gazeFrame.current), []);

  function lookAt(point: Point | null) {
    gazeTarget.current = point;
    if (gazeFrame.current) return;
    let last = performance.now();
    const step = (now: number) => {
      const target = gazeTarget.current;
      // Fresh entry: aim straight at the pointer so the pupils don't sweep in from a stale spot.
      const current =
        target && gazeRef.current.blend < 0.01 ? { ...gazeRef.current, point: target } : gazeRef.current;
      // Frame-rate independent easing (~90ms time constant).
      const k = 1 - Math.exp(-(now - last) / 90);
      last = now;
      const goal = { point: target ?? current.point, blend: target ? 1 : 0 };
      const next = {
        point: lerpPoint(current.point, goal.point, k),
        blend: lerp(current.blend, goal.blend, k),
      };
      const settled =
        Math.hypot(goal.point[0] - next.point[0], goal.point[1] - next.point[1]) < 0.05 &&
        Math.abs(goal.blend - next.blend) < 0.002;
      gazeRef.current = settled ? goal : next;
      setGaze(gazeRef.current);
      gazeFrame.current = settled ? 0 : requestAnimationFrame(step);
    };
    gazeFrame.current = requestAnimationFrame(step);
  }

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  function show(next: number) {
    tRef.current = next;
    setT(next);
  }

  /** Springs to a mood; jumps straight there with reduced motion. */
  function settle(target: number) {
    cancelAnimationFrame(frameRef.current);
    const from = tRef.current;
    if (from === target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show(target);
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const x = Math.min(1, (now - start) / SETTLE_MS);
      show(lerp(from, target, easeOutBack(x)));
      if (x < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  }

  /** Client coordinates in card units — the SVG's screen matrix absorbs CSS zoom and scaling. */
  function toCard(clientX: number, clientY: number): Point | null {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    const { x, y } = new DOMPoint(clientX, clientY).matrixTransform(matrix.inverse());
    return [x, y];
  }

  function trackPosition(event: PointerEvent<SVGElement>) {
    const point = toCard(event.clientX, event.clientY);
    return point ? clamp((point[0] - TRACK_X) / STOP_GAP, 0, LAST) : tRef.current;
  }

  function onPointerDown(event: PointerEvent<SVGElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    cancelAnimationFrame(frameRef.current);
    dragging.current = true;
    show(trackPosition(event));
  }

  function onPointerMove(event: PointerEvent<SVGElement>) {
    if (dragging.current) show(trackPosition(event));
  }

  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    settle(Math.round(tRef.current));
  }

  function onKeyDown(event: KeyboardEvent<SVGElement>) {
    const current = Math.round(tRef.current);
    const next =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? current + 1
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? current - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? LAST
              : null;
    if (next === null) return;
    event.preventDefault();
    settle(clamp(next, 0, LAST));
  }

  const mood = moodAt(clamp(t, 0, LAST));
  const knobX = TRACK_X + clamp(t, -0.15, LAST + 0.15) * STOP_GAP;
  const active = Math.round(clamp(t, 0, LAST));

  return (
    <div
      onPointerMove={(event) => lookAt(toCard(event.clientX, event.clientY))}
      onPointerLeave={() => lookAt(null)}
      className="grid size-full place-items-center bg-paper"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 272 265"
        width={272}
        height={265}
        role="img"
        aria-label={`A face feeling ${MOODS[active].label}`}
        className="max-w-full select-none overflow-visible"
      >
        <defs>
          <linearGradient id="emotion-label" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0.6} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <clipPath id="emotion-card">
            <rect width={272} height={265} rx={4} />
          </clipPath>
        </defs>

        <g clipPath="url(#emotion-card)">
          <rect width={272} height={265} fill={mood.color} />

          {/* Mood label: each word fades and drifts as the slider passes its stop. */}
          {MOODS.map((m, i) => {
            const distance = t - i;
            return (
              <text
                key={m.label}
                x={136}
                y={36 - distance * 14}
                textAnchor="middle"
                fill="url(#emotion-label)"
                opacity={clamp(1 - Math.abs(distance) * 1.6, 0, 1)}
                className="font-sans text-[32px] font-extrabold"
              >
                {m.label}
              </text>
            );
          })}

          {/* Eyes */}
          <circle cx={96} cy={79} r={30} fill="#fff" />
          <circle cx={175} cy={79} r={30} fill="#fff" />
          {mood.pupils.map((rest, n) => {
            // Blend from where the mood puts the pupil toward the pointer; the glint rides along.
            const [x, y] = lerpPoint(rest, lookFrom(EYES[n], gaze.point), gaze.blend);
            const [gx, gy] = mood.glints[n];
            return (
              <g key={`eye${n}`}>
                <circle cx={x} cy={y} r={9} fill="#1a1a1a" />
                <circle cx={gx + x - rest[0]} cy={gy + y - rest[1]} r={3.5} fill="#fff" />
              </g>
            );
          })}

          <path d={mood.mouth} fill="none" stroke="#ff6f85" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />

          {/* Slider panel: white base with a bump that carries the knob. */}
          <rect y={190} width={272} height={75} fill="#fff" />
          <path
            transform={`translate(${knobX - 32.04} 170.48)`}
            d="M64.086 19.513H.488C.173 19.523 0 19.513 0 19.513h.488C2.377 19.452 9.357 18.656 14.5 10.513 20.5 1.013 26.92-.144 33 .013c7.36.19 12.5 3.5 17 11.5 4.5 8 14.086 8 14.086 8Z"
            fill="#fff"
          />
        </g>

        <g aria-hidden>
          {[0, 1, 2].map((i) => (
            <rect
              key={`stop${i}`}
              x={59 + i * STOP_GAP}
              y={215}
              width={6}
              height={23}
              rx={3}
              fill={i === active ? "#2b2b2b" : "#d9d9d9"}
              className="transition-[fill] duration-300"
            />
          ))}
          {[22, 40, 58, 96, 114, 132].map((cx) => (
            <circle key={`dot${cx}`} cx={59 + cx} cy={226.5} r={2} fill="#d9d9d9" />
          ))}
        </g>

        {/* The whole slider strip is the drag target; the knob is its visible thumb. */}
        <rect
          y={170}
          width={272}
          height={95}
          fill="transparent"
          role="slider"
          tabIndex={0}
          aria-label="Mood"
          aria-valuemin={0}
          aria-valuemax={LAST}
          aria-valuenow={active}
          aria-valuetext={MOODS[active].label}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          onFocus={(event) => setFocused(event.currentTarget.matches(":focus-visible"))}
          onBlur={() => setFocused(false)}
          className="cursor-grab touch-none outline-none active:cursor-grabbing"
        />
        <circle cx={knobX} cy={190} r={15} fill={mood.color} className="pointer-events-none" />
        {/* Keyboard focus ring (the slider rect itself has no visible outline). */}
        {focused && (
          <circle cx={knobX} cy={190} r={20} fill="none" stroke="#1a1a1a" strokeWidth={2} className="pointer-events-none" />
        )}
      </svg>
    </div>
  );
}
