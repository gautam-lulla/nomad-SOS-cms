import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { InlineEditorLoader } from "@/components/InlineEditorLoader";
import "./globals.css";

const sabon = localFont({
  src: [
    {
      path: "../../public/fonts/Sabon/Sabon.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sabon/SabonItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Sabon/SabonBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sabon/SabonBoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-sabon",
  display: "swap",
});

const gotham = localFont({
  src: [
    {
      path: "../../public/fonts/gotham/Gotham-Book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/gotham/Gotham-BookItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/gotham/Gotham-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/gotham/Gotham-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/gotham/Gotham-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gotham",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NoMad Wynwood",
  description: "NoMad Wynwood - The NoMad Bar in Miami",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sabon.variable} ${gotham.variable} antialiased`}>
        {children}
        <Suspense fallback={null}>
          <InlineEditorLoader
            orgSlug="spherical-hospitality"
            apiBase={process.env.NEXT_PUBLIC_CMS_URL || "https://cms.sphereos.dev"}
            adminBase={process.env.NEXT_PUBLIC_CMS_ADMIN_URL}
          />
        </Suspense>
      </body>
    </html>
  );
}
