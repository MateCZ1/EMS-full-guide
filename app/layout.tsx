import type { Metadata, Viewport } from "next";
import "./globals.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => `${publicBasePath}${path}`;
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://field-ems-guide.matasekov.chatgpt.site";
const socialImageUrl = `${siteUrl.replace(/\/+$/, "")}/og.png`;
const title = "FIELD — Průvodce XABCDE";
const description =
  "Offline průvodce primárním vyšetřením dospělé osoby podle XABCDE s časovou osou, automatickým návrhem léčiv a závěrečným záznamem.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  manifest: publicAsset("/manifest.webmanifest"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FIELD",
  },
  icons: {
    icon: publicAsset("/favicon.svg"),
    shortcut: publicAsset("/favicon.svg"),
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description,
    images: [
      {
        url: socialImageUrl,
        width: 1732,
        height: 908,
        alt: "FIELD — Průvodce XABCDE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImageUrl],
  },
};

export const viewport: Viewport = {
  themeColor: "#071517",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
