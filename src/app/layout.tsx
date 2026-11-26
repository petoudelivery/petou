import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://petou.com.br"
  ),
  title: "PETOU – Tudo para seu pet, na sua porta! | Delivery em Barcarena",
  description:
    "Pet shop online oficial em Barcarena - PA. Rações premium para cães e gatos, petiscos naturais, brinquedos, higiene e acessórios com entrega ágil na sua porta e confirmação via WhatsApp.",
  keywords: [
    "pet shop barcarena",
    "ração barcarena",
    "delivery pet barcarena",
    "petou store",
    "ração cães barcarena",
    "ração gatos barcarena",
    "petiscos barcarena",
    "vila dos cabanos pet shop",
    "pet shop pará",
  ],
  authors: [{ name: "PETOU Store" }],
  creator: "PETOU Store",
  publisher: "PETOU Store",
  formatDetection: {
    telephone: true,
    address: true,
  },
  openGraph: {
    title: "PETOU – Tudo para seu pet, na sua porta! | Delivery em Barcarena",
    description:
      "Alimentos balanceados, petiscos e cuidados para seu melhor amigo em Barcarena e região. Atendimento direto e confirmação via WhatsApp.",
    siteName: "PETOU Store",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/petou-logo.png",
        width: 800,
        height: 400,
        alt: "PETOU Store - Pet Shop em Barcarena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PETOU – Tudo para seu pet, na sua porta! | Delivery em Barcarena",
    description:
      "Pet shop online com delivery em Barcarena e região. Rações, petiscos e acessórios para seu pet.",
    images: ["/petou-logo.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} font-sans`}>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
