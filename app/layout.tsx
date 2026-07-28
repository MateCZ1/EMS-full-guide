import type { Metadata, Viewport } from "next";
import "./globals.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => `${publicBasePath}${path}`;

export const metadata: Metadata = {
  title: "FIELD — Průvodce XABCDE",
  description:
    "Offline průvodce primárním vyšetřením dospělé osoby podle XABCDE s časovou osou, automatickým návrhem léčiv a závěrečným záznamem.",
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
