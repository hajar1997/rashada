"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

const MIN = 1;
const MAX = 3;
const STEP = 0.5;

type Pan = { x: number; y: number };

const control =
  "grid size-9 place-items-center rounded-full bg-ink/80 text-paper backdrop-blur-sm transition-colors hover:bg-ink disabled:opacity-40 disabled:hover:bg-ink/80";

/**
 * A screen recording that plays muted on a loop, with zoom (100–300%) and drag-to-pan so viewers
 * can read the small UI details. Controls sit in the bottom-right corner.
 */
export function ZoomableVideo({ src, label }: { src: string; label: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dragRef = useRef<{ x: number; y: number; pan: Pan } | null>(null);
  const [zoom, setZoom] = useState(MIN);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [playing, setPlaying] = useState(true);
  const [dragging, setDragging] = useState(false);
  // The frame takes the recording's own proportions once its size is known (752:480 until then).
  const [ratio, setRatio] = useState("752 / 480");

  function readRatio(video: HTMLVideoElement) {
    if (video.videoWidth && video.videoHeight) setRatio(`${video.videoWidth} / ${video.videoHeight}`);
  }

  // The size may already be known if the video loaded before hydration (its event fired too early).
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1) readRatio(video);
  }, []);

  /** Keep the zoomed video covering the frame: pan at most half the extra size each way. */
  function clamp(next: Pan, scale: number): Pan {
    const frame = frameRef.current;
    if (!frame) return next;
    const maxX = ((scale - 1) * frame.offsetWidth) / 2;
    const maxY = ((scale - 1) * frame.offsetHeight) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, next.x)),
      y: Math.min(maxY, Math.max(-maxY, next.y)),
    };
  }

  function zoomTo(next: number) {
    const scale = Math.min(MAX, Math.max(MIN, next));
    setZoom(scale);
    setPan((current) => clamp(current, scale));
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  /** Pointer deltas in the frame's layout px (the rect/offset ratio absorbs CSS zoom). */
  function layoutScale() {
    const frame = frameRef.current;
    return frame ? frame.offsetWidth / frame.getBoundingClientRect().width : 1;
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (zoom === MIN || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, pan };
    setDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const k = layoutScale();
    setPan(clamp({ x: drag.pan.x + (event.clientX - drag.x) * k, y: drag.pan.y + (event.clientY - drag.y) * k }, zoom));
  }

  function endDrag() {
    dragRef.current = null;
    setDragging(false);
  }

  return (
    <figure className="relative">
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ aspectRatio: ratio }}
        className={`relative w-full touch-none overflow-hidden rounded-2xl bg-surface sm:rounded-3xl ${
          zoom > MIN ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""
        }`}
      >
        <video
          ref={videoRef}
          src={src}
          aria-label={label}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={(event) => readRatio(event.currentTarget)}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          className={`size-full object-contain ${dragging ? "" : "transition-transform duration-300 ease-out-soft"}`}
        />
      </div>

      <figcaption className="sr-only">{label}</figcaption>

      <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"} className={control}>
          {playing ? (
            <svg aria-hidden width={14} height={14} viewBox="0 0 14 14" fill="currentColor">
              <rect x={3} y={2} width={3} height={10} rx={1} />
              <rect x={8} y={2} width={3} height={10} rx={1} />
            </svg>
          ) : (
            <svg aria-hidden width={14} height={14} viewBox="0 0 14 14" fill="currentColor">
              <path d="M4 2.5v9l7.5-4.5L4 2.5Z" />
            </svg>
          )}
        </button>
        <div className="flex items-center gap-1 rounded-full bg-ink/80 p-0.5 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => zoomTo(zoom - STEP)}
            disabled={zoom <= MIN}
            aria-label="Zoom out"
            className={control}
          >
            <svg aria-hidden width={14} height={14} viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
              <path d="M3 7h8" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => zoomTo(MIN)}
            aria-label="Reset zoom"
            className="min-w-12 text-center text-xs text-paper tabular-nums"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => zoomTo(zoom + STEP)}
            disabled={zoom >= MAX}
            aria-label="Zoom in"
            className={control}
          >
            <svg aria-hidden width={14} height={14} viewBox="0 0 14 14" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
              <path d="M3 7h8M7 3v8" />
            </svg>
          </button>
        </div>
      </div>

      {zoom > MIN && (
        <p aria-hidden className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1.5 text-xs text-paper">
          Drag to move
        </p>
      )}
    </figure>
  );
}
