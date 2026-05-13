import type { Metadata } from "next";
import { Playfair_Display, Poppins, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/common/Providers";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Orby Jewels — Where Elegance Meets Artistry",
    template: "%s | Orby Jewels",
  },
  description:
    "Discover exquisite handcrafted jewellery at Orby Jewels. Premium diamonds, gold, and gemstone jewellery under Nera Groups. Shop rings, necklaces, earrings, and more.",
  keywords: [
    "luxury jewellery",
    "diamond jewellery",
    "gold jewellery",
    "handcrafted jewellery",
    "Orby Jewels",
    "Nera Groups",
    "fine jewellery India",
    "engagement rings",
    "wedding jewellery",
  ],
  authors: [{ name: "Orby Jewels" }],
  creator: "Orby Jewels",
  publisher: "Nera Groups",
  formatDetection: { telephone: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Orby Jewels",
    title: "Orby Jewels — Where Elegance Meets Artistry",
    description:
      "Discover exquisite handcrafted jewellery at Orby Jewels. Premium diamonds, gold, and gemstone jewellery.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Orby Jewels",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orby Jewels — Where Elegance Meets Artistry",
    description: "Discover exquisite handcrafted jewellery at Orby Jewels.",
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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${cormorant.variable} ${poppins.variable} ${inter.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#3D2314",
                color: "#F5E6D3",
                fontFamily: "var(--font-poppins)",
                fontSize: "14px",
                borderRadius: "4px",
                padding: "12px 20px",
              },
              success: {
                iconTheme: { primary: "#D4AF37", secondary: "#3D2314" },
              },
              error: {
                iconTheme: { primary: "#ef4444", secondary: "#fff" },
              },
            }}
          />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
