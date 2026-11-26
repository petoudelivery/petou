import type { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Buscar Produtos | PETOU Store Barcarena",
  description:
    "Busque rações secas e úmidas, petiscos naturais, brinquedos, produtos de banho e acessórios para cães e gatos em Barcarena - PA.",
  openGraph: {
    title: "Buscar Produtos | PETOU Store Barcarena",
    description:
      "Busque rações, petiscos, brinquedos, produtos de higiene e acessórios com entrega em Barcarena.",
    siteName: "PETOU Store",
    locale: "pt_BR",
    type: "website",
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-label="Carregando pesquisa"
          className="min-h-screen py-20 flex flex-col items-center justify-center bg-[#FAF8F2]"
        >
          <div className="w-10 h-10 border-4 border-[#174C3C] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
