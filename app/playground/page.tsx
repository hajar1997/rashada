import type { Metadata } from "next";
import { Playground } from "@/components/playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "No client, no brief — interactive animations, illustration, and visual experiments.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return (
    <>
      <h1 className="sr-only">Playground</h1>
      {/* Opens on the interactive animations, as in the Figma playground frame. */}
      <Playground initialCategory="Animation" />
    </>
  );
}
