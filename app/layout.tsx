import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import "./globals.css";
import "./cultivar-themes.css";
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cultivars.cbcberry.com"),
  title: "CBC Cultivar Explorer - Premium Strawberry Genetics",
  description: "Compare strawberry varieties, analyze performance data, and find the perfect cultivar for your operation. Explore CBC's premium strawberry genetics with detailed insights on yield, size, disease resistance, and growing recommendations.",
  keywords: "strawberry cultivars, strawberry varieties, CBC, California Berry Cultivars, strawberry genetics, fruit breeding, agricultural technology, strawberry farming, cultivar comparison, berry production",
  authors: [{ name: "California Berry Cultivars" }],
  creator: "California Berry Cultivars",
  publisher: "California Berry Cultivars",
  
  // Open Graph / Facebook
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cultivars.cbcberry.com",
    siteName: "CBC Cultivar Explorer",
    title: "CBC Cultivar Explorer - Premium Strawberry Genetics",
    description: "Compare strawberry varieties, analyze performance data, and find the perfect cultivar for your operation.",
    images: [
      {
        url: "/images/icons/flavicon.png",
        width: 512,
        height: 512,
        alt: "CBC Cultivar Explorer",
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "CBC Cultivar Explorer - Premium Strawberry Genetics",
    description: "Compare strawberry varieties, analyze performance data, and find the perfect cultivar for your operation.",
    images: ["/images/icons/flavicon.png"],
    creator: "@CBCBerry",
  },
  
  // Icons
  icons: {
    icon: [
      { url: "/images/icons/flavicon.png", sizes: "512x512", type: "image/png" },
      { url: "/images/icons/flavicon.png", sizes: "192x192", type: "image/png" },
      { url: "/images/icons/flavicon.png", sizes: "32x32", type: "image/png" },
      { url: "/images/icons/flavicon.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/icons/flavicon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/images/icons/flavicon.png",
  },
  
  // Additional metadata
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  verification: {
    // Add these when you set up Google Search Console, Bing, etc.
    // google: "your-google-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#00ff88" />
        <link rel="canonical" href="https://cultivars.cbcberry.com" />
      </head>
      <body
        className={`${inter.variable} antialiased font-inter`}
      >
        {/* Fixed background image */}
        <div className="background-image"></div>
        {/* Background overlay for better readability - TEMPORARILY DISABLED */}
        {/* <div className="background-overlay"></div> */}
        {children}
        <Analytics />
      </body>
    </html>
  );
}
