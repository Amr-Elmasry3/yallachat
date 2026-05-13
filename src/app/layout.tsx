// Import Metadata
import type { Metadata } from "next";

// Import Fonts
import { Inter } from "next/font/google";

// Import Global Css
import "./globals.css";

// Import Shadcn Components
import { Toaster } from "@/components/shadcn/sonner";

// Import Providers
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "YallaChat",
  description: "Connect with your friends and your family instantly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Toaster />

          {children}
        </Providers>
      </body>
    </html>
  );
}
