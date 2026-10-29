"use client";

import { useEffect, useRef } from "react";

const SPACING = 44; // grid cell size (CSS px)
const PINCH = 0.32; // how strongly points are drawn in toward the cursor (cells shrink near it)
const LENS = 80; // lens radius (gaussian sigma, CSS px)
const SPOTLIGHT = 170; // radius of the bright area around the cursor (CSS px)
const BASE = 0; // grid visibility away from the cursor (0 = only around the cursor, as in the reference)
const FOLLOW = 0.18; // cursor easing per frame
/** Brighter tints of the electric-blue accent (#0600e8 is too dark to read on the near-black page). */
const LINE = "#3d5cff";
const DOT = "#5c78ff";

/**
 * Page background grid, after the reference: the page stays solid; only the area around the cursor
 * reveals a thin electric-blue grid with small square markers, pinched in toward the cursor like a
 * lens. Works anywhere on the page; fixed to the viewport behind all content, and draws only while
 * the mouse is on the page or fading out after it leaves.
 */
export function PageGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame = 0;
    let hovering = false;
    let visibility = 0; // 0–1, eased toward hovering ? 1 : 0
    const target = { x: 0, y: 0 };
    const cursor = { x: 0, y: 0 };

    /** Canvas size in layout px; the bitmap is scaled to device pixels (absorbs DPR and CSS zoom). */
    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * devicePixelRatio);
      canvas.height = Math.round(rect.height * devicePixelRatio);
      ctx.setTransform(canvas.width / canvas.offsetWidth, 0, 0, canvas.height / canvas.offsetHeight, 0, 0);
    }

    /** Pointer position in the canvas's layout px. */
    function toLocal(event: PointerEvent) {
      if (!canvas) return target;
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) * canvas.offsetWidth) / rect.width,
        y: ((event.clientY - rect.top) * canvas.offsetHeight) / rect.height,
      };
    }

    function warp(x: number, y: number): [number, number] {
      if (still) return [x, y];
      const dx = x - cursor.x;
      const dy = y - cursor.y;
      const k = 1 - PINCH * Math.exp(-(dx * dx + dy * dy) / (2 * LENS * LENS));
      return [cursor.x + dx * k, cursor.y + dy * k];
    }

    function draw() {
      if (!canvas || !ctx) return;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);
      if (visibility < 0.01) return;

      // The whole viewport, one cell past each edge so warped lines never stop short.
      const x0 = -SPACING;
      const x1 = width + SPACING;
      const y0 = -SPACING;
      const y1 = height + SPACING;
      const step = SPACING / 4; // sub-steps so warped lines curve smoothly

      ctx.save();
      ctx.globalAlpha = visibility;
      ctx.strokeStyle = LINE;
      ctx.fillStyle = DOT;
      ctx.lineWidth = 0.5;

      ctx.beginPath();
      for (let x = x0; x <= x1; x += SPACING) {
        for (let y = y0; y <= y1; y += step) {
          const [px, py] = warp(x, y);
          if (y === y0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      for (let y = y0; y <= y1; y += SPACING) {
        for (let x = x0; x <= x1; x += step) {
          const [px, py] = warp(x, y);
          if (x === x0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      }
      ctx.globalAlpha = visibility * 0.6;
      ctx.stroke();

      ctx.globalAlpha = visibility;
      for (let x = x0; x <= x1; x += SPACING) {
        for (let y = y0; y <= y1; y += SPACING) {
          const [px, py] = warp(x, y);
          ctx.fillRect(px - 0.9, py - 0.9, 1.8, 1.8); // small square marker at each crossing
        }
      }

      // Bright near the cursor, fading to a faint BASE level across the rest of the page.
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-in";
      const light = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, SPOTLIGHT);
      light.addColorStop(0, "rgba(0,0,0,1)");
      light.addColorStop(0.55, "rgba(0,0,0,0.6)");
      light.addColorStop(1, `rgba(0,0,0,${BASE})`);
      ctx.fillStyle = light;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    function tick() {
      cursor.x += (target.x - cursor.x) * FOLLOW;
      cursor.y += (target.y - cursor.y) * FOLLOW;
      visibility += ((hovering ? 1 : 0) - visibility) * 0.12;
      draw();
      const settled =
        !hovering && visibility < 0.01 ? true : hovering && Math.hypot(target.x - cursor.x, target.y - cursor.y) < 0.3 && visibility > 0.99;
      frame = settled ? 0 : requestAnimationFrame(tick);
    }

    function run() {
      if (!frame) frame = requestAnimationFrame(tick);
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return; // hover effect: mouse only
      const point = toLocal(event);
      target.x = point.x;
      target.y = point.y;
      if (!hovering) {
        hovering = true;
        cursor.x = point.x; // start the lens under the pointer, not sweeping in
        cursor.y = point.y;
      }
      run();
    }

    function onLeave() {
      hovering = false;
      run();
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 size-full" />;
}
