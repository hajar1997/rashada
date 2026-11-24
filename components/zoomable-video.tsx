"use client";

import { useEffect, useRef, useState } from "react";

const control =
  "grid size-9 place-items-center rounded-full bg-ink/80 text-paper backdrop-blur-sm transition-colors hover:bg-ink";

/** Safari on iPhone only lets the <video> itself go full screen, via this non-standard method. */
type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

/**
 * A screen recording that plays muted on a loop, framed at its own proportions, with play/pause
 * and a full-screen button (or double-click) so viewers can see the UI details large.
 */
export function ZoomableVideo({ src, label }: { src: string; label: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  // The frame takes the recording's own proportions once its size is known (752:480 until then).
  const [ratio, setRatio] = useState("752 / 480");

  function readRatio(video: HTMLVideoElement) {
    if (video.videoWidth && video.videoHeight) setRatio(`${video.videoWidth} / ${video.videoHeight}`);
  }

  useEffect(() => {
    // The size may already be known if the video loaded before hydration (its event fired too early).
    const video = videoRef.current;
    if (video && video.readyState >= 1) readRatio(video);

    const onChange = () => setFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

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

  function toggleFullscreen() {
    const frame = frameRef.current;
    const video = videoRef.current as IOSVideo | null;
    if (!frame || !video) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (frame.requestFullscreen) {
      void frame.requestFullscreen();
    } else {
      video.webkitEnterFullscreen?.();
    }
  }

  return (
    <figure>
      <div
        ref={frameRef}
        style={fullscreen ? undefined : { aspectRatio: ratio }}
        className={`relative w-full overflow-hidden ${
          fullscreen ? "grid place-items-center bg-black" : "rounded-2xl bg-surface sm:rounded-3xl"
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
          onDoubleClick={toggleFullscreen}
          className="size-full object-contain"
        />

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
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
            className={control}
          >
            <svg
              aria-hidden
              width={16}
              height={16}
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {fullscreen ? (
                <path d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4" />
              ) : (
                <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
