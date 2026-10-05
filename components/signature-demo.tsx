"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { CheckCircleIcon, CloseIcon, RefreshIcon, SignIcon } from "./icons";
import { smartAnimate, vtName } from "./view-transition";

type Step = "idle" | "signing" | "done";
type Point = { x: number; y: number };

const INK = "#1a1a1a";
const STROKE_WIDTH = 2.5;

const pill =
  "flex items-center justify-center gap-2 whitespace-nowrap rounded-full py-2 text-base transition duration-200 ease-out-soft active:scale-95";

/**
 * Playground "Animation 1" from Figma: a button opens a dashed signing pad you can draw in,
 * refresh clears it, and finishing closes the pad into a "Signing done" chip.
 */
export function SignatureDemo() {
  const [step, setStep] = useState<Step>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokeRef = useRef<Point[] | null>(null);

  // Match the canvas bitmap to its rendered size (and pixel density) each time the pad opens.
  // Layout effect so it's ready before the view transition captures the new state.
  useLayoutEffect(() => {
    if (step !== "signing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = INK;
    ctx.fillStyle = INK;
    ctx.lineWidth = STROKE_WIDTH * ratio;
  }, [step]);

  /**
   * Smart-animate between steps, in sequence: opening moves the pill first and then grows the
   * frame; closing shrinks the frame first and then morphs the pill (see `sign-open`/`sign-close` CSS).
   */
  function go(next: Step) {
    smartAnimate("sign", () => setStep(next), next === "signing" ? "sign-open" : "sign-close");
  }

  const open = () => go("signing");

  function clear() {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  }

  /** Pointer position in canvas pixels; the rect/bitmap ratio absorbs CSS zoom and pixel density. */
  function toCanvas(event: PointerEvent<HTMLCanvasElement>): Point {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function onPointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toCanvas(event);
    strokeRef.current = [point];
    // A tap leaves a dot.
    const ctx = event.currentTarget.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function onPointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const stroke = strokeRef.current;
    const ctx = event.currentTarget.getContext("2d");
    if (!stroke || !ctx) return;
    const point = toCanvas(event);
    stroke.push(point);
    if (stroke.length < 3) return;
    // Smooth the line by curving through midpoints of the last three samples.
    const [a, b, c] = stroke.slice(-3);
    ctx.beginPath();
    ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
    ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
    ctx.stroke();
  }

  function endStroke() {
    strokeRef.current = null;
  }

  return (
    <div className="grid size-full place-items-center bg-paper text-ink">
      {step === "idle" && (
        <button
          type="button"
          onClick={open}
          style={vtName("sign-pill")}
          className={`${pill} vt-pop vt-sign bg-lilac px-6 hover:brightness-95`}
        >
          <SignIcon />
          See more
        </button>
      )}

      {step === "signing" && (
        <div
          role="dialog"
          aria-label="Sign"
          style={vtName("sign-frame")}
          className="vt-pop vt-sign relative flex h-[250px] w-[240px] flex-col items-center justify-between rounded-2xl border-3 border-dashed border-dash p-4"
        >
          <canvas
            ref={canvasRef}
            aria-label="Signature pad. Draw with your mouse or finger."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            className="absolute inset-0 size-full cursor-crosshair touch-none rounded-[13px]"
          />

          <div className="pointer-events-none relative flex w-full items-center justify-between text-hint">
            <button
              type="button"
              onClick={clear}
              aria-label="Clear signature"
              className="pointer-events-auto rounded-full transition-transform duration-500 ease-out-soft hover:text-ink active:-rotate-180"
            >
              <RefreshIcon />
            </button>
            <span className="font-medium">Sign</span>
            <button
              type="button"
              onClick={() => go("idle")}
              aria-label="Close"
              className="pointer-events-auto rounded-full transition-colors hover:text-ink"
            >
              <CloseIcon />
            </button>
          </div>

          <button
            type="button"
            onClick={() => go("done")}
            style={vtName("sign-pill")}
            className={`${pill} vt-sign relative bg-lilac px-6 hover:brightness-95`}
          >
            <SignIcon />
            Finish Signing
          </button>
        </div>
      )}

      {step === "done" && (
        <div className="flex items-center gap-2">
          <p role="status" style={vtName("sign-pill")} className={`${pill} vt-pop vt-sign bg-ink px-3 text-lilac`}>
            <CheckCircleIcon />
            Signing done
          </p>
          <button
            type="button"
            onClick={open}
            aria-label="Sign again"
            style={vtName("sign-pen")}
            className={`${pill} vt-pop vt-sign size-10 bg-lilac hover:brightness-95`}
          >
            <SignIcon />
          </button>
        </div>
      )}
    </div>
  );
}
