import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import "./globals.css";
import ProfileHeader from "@/components/ProfileHeader";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "literally_sai | Portfolio",
  description: "Static Systems Engineering Portfolio",
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
          <ProfileHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
