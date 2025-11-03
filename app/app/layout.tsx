import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Learn Mahjong. Have Fun.",
  description: "Master American Mahjong in 15 minutes a day with interactive lessons and engaging challenges.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mahjong",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <div className="mobile-container">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
