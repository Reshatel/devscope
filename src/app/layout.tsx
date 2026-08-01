import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Fraunces, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { CodeRevealOverlay } from "@/components/CodeRevealOverlay";

export const metadata: Metadata = {
  title: "DevScope — GitHub Profile Analyzer",
  description: "Аналізуй та порівнюй GitHub-профілі розробників за секунди",
};

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html
  lang="en"
  className={`${fraunces.variable} ${plexMono.variable} ${plexSans.variable} h-full antialiased`}
>
      <body className="min-h-full flex flex-col">
        <Providers>
      <CodeRevealOverlay />
      <div className="relative z-10">{children}</div>
      </Providers>
      </body>
    </html>
  );
}
