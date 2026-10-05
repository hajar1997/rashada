import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center gap-6 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="text-[28px] font-medium sm:text-[32px]">This page wandered off.</h1>
      <p className="text-muted">The link may be broken, or the page may have moved.</p>
      <Link
        href="/"
        className="inline-flex h-[60px] items-center rounded-full bg-paper px-6 text-ink transition-colors duration-300 hover:bg-white"
      >
        Back home
      </Link>
    </section>
  );
}
