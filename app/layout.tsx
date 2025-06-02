import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/inter/900.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CBC Cultivar Explorer",
  description: "Premium strawberry genetics and cultivar information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased font-inter`}
      >
        {/* Fixed background image */}
        <div className="background-image"></div>
        {/* Background overlay for better readability - TEMPORARILY DISABLED */}
        {/* <div className="background-overlay"></div> */}
        {children}
      </body>
    </html>
  );
}
