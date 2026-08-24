import type { Metadata } from "next";
import { Space_Grotesk, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jys1025.github.io"),
  title: {
    default: "JYS Blog",
    template: "%s | JYS Blog",
  },
  description: "A showcase of research in Generative Models, Neuroscience, and Philosophy by Yoonseong Jeong.",
  authors: [{ name: "Yoonseong Jeong", url: "https://jys1025.github.io" }],
  creator: "Yoonseong Jeong",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jys1025.github.io",
    siteName: "JYS Blog",
    title: "JYS Blog - Research & Thoughts",
    description: "A showcase of research in Generative Models, Neuroscience, and Philosophy by Yoonseong Jeong.",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "JYS Blog",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "JYS Blog",
    description: "A showcase of research in Generative Models, Neuroscience, and Philosophy by Yoonseong Jeong.",
    images: ["/icon.png"],
  },
  icons: {
    icon: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },
};

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body
        className={cn(
          sans.variable,
          display.variable,
          "antialiased min-h-screen bg-background font-sans flex flex-col"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
