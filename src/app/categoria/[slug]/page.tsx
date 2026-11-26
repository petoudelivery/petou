import type { Metadata } from "next";
import { Suspense } from "react";
import CategoryClient from "./CategoryClient";
import { slugToCategoryName } from "@/lib/storeService";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [
    { slug: "racoes-para-caes" },
    { slug: "racoes-para-gatos" },
    { slug: "petiscos" },
    { slug: "brinquedos" },
    { slug: "higiene" },
    { slug: "acessorios" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slugToCategoryName(slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://petou.com.br";

  return {
    title: `${categoryName} em Barcarena | PETOU Store`,
    description: `Compre ${categoryName} com entrega em Barcarena - PA. Produtos selecionados com atendimento humanizado e confirmação de estoque no WhatsApp.`,
    alternates: {
      canonical: `${baseUrl}/categoria/${slug}`,
    },
    openGraph: {
      title: `${categoryName} | PETOU Store Barcarena`,
      description: `Compre ${categoryName} com entrega rápida em Barcarena. Atendimento próximo e produtos de alta qualidade para seu pet.`,
      url: `${baseUrl}/categoria/${slug}`,
      siteName: "PETOU Store",
      locale: "pt_BR",
      type: "website",
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div role="status" aria-label="Carregando categoria" className="min-h-screen py-20 flex flex-col items-center justify-center bg-[#FAF8F2]">
          <div className="w-10 h-10 border-4 border-[#174C3C] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        </div>
      }
    >
      <CategoryClient params={params} />
    </Suspense>
  );
}
