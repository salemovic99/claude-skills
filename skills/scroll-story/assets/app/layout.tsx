import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { GrainOverlay } from "@/components/layout/GrainOverlay";

/**
 * Server Component. Three faces, metadata, the skip link, the grain plate, and
 * the one client tree. Nothing interactive lives here.
 *
 * TEMPLATE — swap the fonts and copy for the project's brand.
 */

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_TITLE = "Brand — Tagline";
const SITE_DESCRIPTION = "One sentence that would make a stranger scroll.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: { title: SITE_TITLE, description: SITE_DESCRIPTION, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#fafaf9",
  // Pinned: this is an art-directed fixed palette, not a themeable app.
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full`}
    >
      <body className="relative min-h-full bg-background text-foreground">
        {/* First focusable element — skips the fixed wayfinding. */}
        <a
          href="#about"
          className="sr-only rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <GrainOverlay />
      </body>
    </html>
  );
}
