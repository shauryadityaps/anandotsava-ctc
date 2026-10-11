import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const tasteBread = localFont({
  src: "../public/fonts/taste-bread.otf",
  variable: "--font-taste-bread",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Anandotsava 2026 | Inter-School Fest",
  description:
    "Welcome to Anandotsava — The premier inter-school cultural, academic, and innovation festival celebrating youth creativity and talent.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.png",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${tasteBread.variable} h-full antialiased`}
    >
      <body className="w-full h-full min-h-full flex flex-col bg-[#0f172a] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
