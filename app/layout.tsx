import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "FinSight AI — Portfolio Dashboard",
  description:
    "Multi-tenant financial portfolio dashboard with live stock quotes and AI-generated insights.",
  icons: {
    icon: [
      { url: "/icons/finsight-mark-16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/icons/finsight-mark-32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/icons/finsight-mark-48.svg", sizes: "48x48", type: "image/svg+xml" },
    ],
    apple: { url: "/icons/finsight-mark-96.svg", sizes: "96x96", type: "image/svg+xml" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
