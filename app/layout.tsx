import type { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import "./globals.css";
import ProfileHeader from "@/components/layout/ProfileHeader";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ThemeToggle />
          <ProfileHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
