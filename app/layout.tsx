import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { PageGrid } from "@/components/page-grid";
import { ScreenHeight } from "@/components/screen-height";
import { SideRail } from "@/components/side-rail";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const description =
  "UX/UI designer based in Baku untangling complex SaaS, web, and mobile products into interfaces people can navigate without a manual.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description,
  authors: [{ name: profile.name }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: `${profile.name} — ${profile.role}`,
    description,
    url: "/",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} antialiased motion-safe:scroll-smooth`}>
      <body className="overflow-x-clip">
        <a
          href="#main"
          className="sr-only z-[60] rounded-full bg-paper px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <ScreenHeight />
        <PageGrid />
        <SideRail />
        <div className="relative z-10 mx-auto w-[min(800px,calc(100%-32px))] pb-24 pt-5 sm:pb-32">
          <SiteHeader />
          <main id="main" className="mt-16 sm:mt-[100px]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
