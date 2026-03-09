import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// This tells Android what the app is called and links the Manifest!
export const metadata: Metadata = {
  title: "Holy Rosary App",
  description: "A complete Catholic prayer app with offline audio.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Holy Rosary",
  },
};

// This forces the app to act like a native app (no pinch-to-zoom, sets theme color)
export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: "#1a1a2e" }}>
        {children}
      </body>
    </html>
  );
}
