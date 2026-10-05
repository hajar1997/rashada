import type { ReactNode } from "react";

/**
 * Label that rolls up to a second line when its `group` parent is hovered or focused.
 * The second line repeats the label unless `hover` gives different text.
 */
export function RollText({ children, hover = children }: { children: string; hover?: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-out-soft group-hover:-translate-y-full group-focus-visible:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-full flex h-full items-center justify-center transition-transform duration-500 ease-out-soft group-hover:-translate-y-full group-focus-visible:-translate-y-full"
      >
        {hover}
      </span>
    </span>
  );
}
