import Link from "next/link";
import { profile } from "@/lib/content";
import { CopyEmail } from "./copy-email";
import { WinkIcon } from "./icons";
import { RollText } from "./roll-text";

const links = [
  { href: "/about", label: "About me" },
  { href: "/projects", label: "Projects" },
  { href: "/playground", label: "Playground" },
] as const;

export function SiteHeader() {
  return (
    <header className="vt-chrome-header sticky top-5 z-50">
      <nav
        aria-label="Primary"
        className="flex items-center justify-between rounded-full bg-paper p-1.5 text-ink shadow-[0_8px_32px_-12px_rgb(0_0_0/0.6)] [&_:focus-visible]:outline-ink"
      >
        <Link
          href="/"
          aria-label={`${profile.name}, home`}
          className="group grid size-11 shrink-0 place-items-center rounded-full bg-ink text-base font-semibold text-paper sm:size-[60px] sm:text-xl"
        >
          <RollText hover={<WinkIcon className="size-6 sm:size-7" />}>{profile.initials}</RollText>
        </Link>

        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="group flex self-stretch items-center px-1.5 text-sm font-medium min-[380px]:px-2 sm:px-3 sm:text-base"
          >
            <RollText>{label}</RollText>
          </Link>
        ))}

        <CopyEmail email={profile.email} />
      </nav>
    </header>
  );
}
