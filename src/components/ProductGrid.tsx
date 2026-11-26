"use client";

import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/types/store";
import { CATEGORIES, Category } from "@/data/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onClearFilter: () => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearFilter,
  onAddToCart,
}: ProductGridProps) {
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCategory =
        selectedCategory === "Todos" || item.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <section id="produtos" className="py-16 sm:py-20 bg-petou-cream/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Matching Referencia.jpeg visual hierarchy) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-petou-yellow/20 text-petou-green text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-petou-yellow" />
              Catálogo Petou
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-petou-green tracking-tight">
              Produtos Populares
            </h2>
            <p className="text-sm sm:text-base text-petou-green/75 mt-1">
              Seleção cuidadosa de itens para a alimentação, higiene e lazer do seu pet.
            </p>
          </div>

          <div className="text-xs font-bold text-petou-green/70">
            Exibindo <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> itens demonstrativos
          </div>
        </div>

        {/* Category filter pills row */}
        <div className="flex items-center gap-2 pb-6 overflow-x-auto no-scrollbar">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-petou-green text-petou-white border-petou-green shadow-sm"
                    : "bg-petou-white text-petou-green hover:bg-petou-cream border-petou-green/15"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Active Search/Filter Pill */}
        {(searchQuery || selectedCategory !== "Todos") && (
          <div className="flex items-center gap-2 mb-6 text-xs text-petou-green">
            <span>Filtro ativo:</span>
            {selectedCategory !== "Todos" && (
              <span className="bg-petou-green/10 px-2.5 py-1 rounded-md font-bold">
                Categoria: {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="bg-petou-green/10 px-2.5 py-1 rounded-md font-bold">
                Busca: &ldquo;{searchQuery}&rdquo;
              </span>
            )}
            <button
              onClick={onClearFilter}
              className="text-petou-green underline font-bold hover:text-petou-yellow ml-2"
            >
              Limpar filtros
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-petou-white rounded-3xl p-12 text-center border border-petou-green/10 max-w-md mx-auto my-8 space-y-4">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-bold text-petou-green">Nenhum produto encontrado</h3>
            <p className="text-xs text-petou-green/70">
              Não encontramos itens para o filtro selecionado. Tente buscar por outros termos ou veja todas as categorias.
            </p>
            <button
              onClick={onClearFilter}
              className="px-5 py-2.5 rounded-xl bg-petou-green text-petou-white font-bold text-xs hover:opacity-90 transition"
            >
              Ver todos os 6 produtos demo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
