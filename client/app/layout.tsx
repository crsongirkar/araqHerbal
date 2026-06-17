import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { WishlistProvider } from "@/context/WishlistContext";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

import fs from "fs/promises";
import path from "path";

export async function generateMetadata() {
  const filePath = path.join(process.cwd(), "data", "seo.json");
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const seo = JSON.parse(data);
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
    };
  } catch (error) {
    return {
      title: "ARAQ — A Herbal Elixir",
      description: "Handcrafted organic soaps and remedies.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${playfair.variable} antialiased flex flex-col min-h-screen`}
      >
        <ProductsProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </WishlistProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
