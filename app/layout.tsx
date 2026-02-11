import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WriteStack Academy - Learn How to Use WriteStack",
    template: "%s | WriteStack Academy",
  },
  description:
    "Learn everything you need to know on how to use WriteStack to grow your Substack audience and turn your followers into actual leads! Master notes generation, activity center, analytics, and more.",
  keywords: [
    "WriteStack",
    "WriteStack Academy",
    "Substack marketing",
    "content creation",
    "social media",
    "Substack growth",
    "notes generation",
    "activity center",
    "analytics",
    "content strategy",
    "Substack automation",
  ],
  authors: [{ name: "WriteStack" }],
  creator: "WriteStack",
  publisher: "WriteStack",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://academy.writestack.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "WriteStack Academy",
    title: "WriteStack Academy - Learn How to Use WriteStack",
    description:
      "Learn everything you need to know on how to use WriteStack to grow your Substack audience and turn your followers into actual leads!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "WriteStack Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WriteStack Academy - Learn How to Use WriteStack",
    description:
      "Learn everything you need to know on how to use WriteStack to grow your Substack audience and turn your followers into actual leads!",
    images: ["/og-image.jpg"],
    creator: "@writestack",
  },
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
