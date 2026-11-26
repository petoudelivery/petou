import type { Metadata } from "next";
import { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";
import { DEMO_PRODUCTS } from "@/data/products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return DEMO_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const demoProduct = DEMO_PRODUCTS.find((p) => p.id === id);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://petou.com.br";

  if (demoProduct) {
    const priceText =
      demoProduct.price && demoProduct.price > 0
        ? ` por R$ ${demoProduct.price.toFixed(2).replace(".", ",")}`
        : "";

    return {
      title: `${demoProduct.name} (${demoProduct.size}) | PETOU Store Barcarena`,
      description: `Compre ${demoProduct.name} (${demoProduct.brand})${priceText} com entrega em Barcarena - PA. Confirmação imediata via WhatsApp.`,
      alternates: {
        canonical: `${baseUrl}/produto/${id}`,
      },
      openGraph: {
        title: `${demoProduct.name} | PETOU Store Barcarena`,
        description: `Compre ${demoProduct.name} (${demoProduct.brand})${priceText} com entrega em Barcarena. Confira disponibilidade e faça seu pedido.`,
        url: `${baseUrl}/produto/${id}`,
        siteName: "PETOU Store",
        locale: "pt_BR",
        type: "website",
        images: [
          {
            url: "/petou-logo.png",
            width: 800,
            height: 400,
            alt: `${demoProduct.name} - PETOU Store`,
          },
        ],
      },
    };
  }

  return {
    title: "Produto | PETOU Store Barcarena",
    description: "Confira detalhes do produto com entrega em Barcarena - PA.",
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div role="status" aria-label="Carregando produto" className="min-h-screen py-20 flex flex-col items-center justify-center bg-[#FAF8F2]">
          <div className="w-10 h-10 border-4 border-[#174C3C] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        </div>
      }
    >
      <ProductDetailClient params={params} />
    </Suspense>
  );
}
