"use client";

import { useEffect, useState } from "react";
import { CheckIcon, MailIcon } from "./icons";
import { RollText } from "./roll-text";

const RESET_MS = 2000;

/** Pill that copies the email address on click and confirms with a check mark. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context or denied permission): fall back to the mail client.
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${email} copied` : `Copy ${email}`}
      className="group flex h-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ink px-3 text-paper sm:h-[60px] sm:px-5"
    >
      {/* Labels share one grid cell; the invisible email keeps the pill width steady. */}
      <span className="hidden sm:grid">
        <span aria-hidden className="invisible [grid-area:1/1]">
          {email}
        </span>
        {copied ? (
          <span className="flex animate-fade-in items-center justify-center gap-1.5 [grid-area:1/1]">
            Copied
            <CheckIcon />
          </span>
        ) : (
          <span className="[grid-area:1/1]">
            <RollText hover="Copy this email">{email}</RollText>
          </span>
        )}
      </span>
      <span className="sm:hidden">{copied ? <CheckIcon className="animate-fade-in" /> : <MailIcon />}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email copied to clipboard" : ""}
      </span>
    </button>
  );
}
