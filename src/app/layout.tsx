import type { Metadata } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://petou.com.br"
  ),
  title: "PETOU – Tudo para cuidar melhor de quem faz parte da família | Barcarena",
  description:
    "Encontre alimentação, higiene e acessórios com atendimento próximo e entrega em Barcarena. Rações premium para cães e gatos, petiscos e cuidados com confirmação via WhatsApp.",
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
    title: "PETOU – Tudo para cuidar melhor de quem faz parte da família",
    description:
      "Alimentação, higiene e acessórios com atendimento próximo e entrega em Barcarena. Pedidos confirmados via WhatsApp.",
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
    title: "PETOU – Tudo para seu pet em Barcarena",
    description:
      "Pet shop online com entrega em Barcarena e região. Rações, higiene e acessórios para seu pet.",
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
    <html lang="pt-BR" className={`${manrope.variable} ${dmSans.variable} font-sans`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#FAF8F2] text-[#202C27] antialiased overflow-x-hidden">
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
