"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchProducts } from "@/lib/storeService";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";
import {
  ChevronRight,
  Search,
  ArrowUpDown,
  ShoppingBag,
  Check,
  Home as HomeIcon,
} from "lucide-react";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [selectedCat, setSelectedCat] = useState("Todos");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const { addToCart, openCart } = useCart();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Erro ao carregar produtos na busca:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["Todos", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (selectedCat !== "Todos") {
      list = list.filter((p) => p.category === selectedCat);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, query, selectedCat, sortBy]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedId(product.id);
    setLiveMessage(`${product.name} adicionado ao carrinho.`);
    setTimeout(() => {
      setAddedId(null);
      openCart();
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#202C27] font-sans antialiased">
      <Header
        selectedCategory="Todos"
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Screen reader live region */}
          <div role="status" aria-live="polite" className="sr-only">
            {liveMessage}
          </div>

          {/* Breadcrumbs */}
          <nav aria-label="Trilha de navegação" className="flex items-center gap-2 text-xs text-[#202C27]/80">
            <Link href="/" className="hover:text-[#174C3C] flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
              <HomeIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Início</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-[#66716A]" aria-hidden="true" />
            <span className="font-bold text-[#174C3C]" aria-current="page">Busca de Produtos</span>
          </nav>

          {/* Search Header Bar */}
          <header className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#E8EFE5] shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#78916D]">
                Resultado da Pesquisa
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#174C3C] tracking-tight mt-1">
                {query.trim() ? (
                  <span>
                    Resultados para &ldquo;<span className="text-[#F47C49]">{query}</span>&rdquo;
                  </span>
                ) : (
                  <span>Todos os Produtos</span>
                )}
              </h1>
              <p className="text-xs sm:text-sm text-[#202C27]/85 mt-1">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
              </p>
            </div>

            {/* Input */}
            <div className="relative max-w-xl">
              <label htmlFor="search-page-filter-input" className="sr-only">
                Refinar termo de busca
              </label>
              <input
                id="search-page-filter-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite o nome, ração, marca ou categoria..."
                className="w-full bg-[#FAF8F2] text-[#202C27] placeholder-[#66716A]/75 text-sm pl-10 pr-8 py-3 rounded-2xl border border-[#E8EFE5] focus-visible:outline-2 focus-visible:outline-[#174C3C] min-h-[44px]"
              />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#66716A]" aria-hidden="true" />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpar termo de busca"
                  className="absolute right-3.5 top-3 text-[#66716A] hover:text-[#202C27] text-xs font-bold p-1 rounded focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                >
                  ✕
                </button>
              )}
            </div>
          </header>

          {/* Filter and Sort Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Filtro de busca por categoria">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCat(cat)}
                  className={`text-xs px-3.5 py-2 rounded-full font-semibold transition whitespace-nowrap min-h-[40px] focus-visible:outline-2 focus-visible:outline-[#174C3C] ${
                    selectedCat === cat
                      ? "bg-[#174C3C] text-[#FFFFFF]"
                      : "bg-[#FFFFFF] text-[#202C27] border border-[#E8EFE5] hover:bg-[#E8EFE5]"
                  }`}
                  aria-pressed={selectedCat === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <label htmlFor="search-sort-select" className="text-xs font-bold text-[#202C27] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#174C3C]" aria-hidden="true" />
                Ordenar por:
              </label>
              <select
                id="search-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FFFFFF] text-[#202C27] text-xs font-bold px-3 py-2.5 rounded-xl border border-[#E8EFE5] focus-visible:outline-2 focus-visible:outline-[#174C3C] min-h-[44px]"
              >
                <option value="featured">Relevância</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name">Nome (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div role="status" aria-label="Carregando produtos" className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#174C3C] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <p className="text-xs font-bold text-[#66716A]">Buscando produtos...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="bg-[#FFFFFF] rounded-3xl p-12 text-center border border-[#E8EFE5] max-w-md mx-auto space-y-4 shadow-sm">
              <span className="text-5xl" aria-hidden="true">🔎</span>
              <h2 className="text-lg font-bold text-[#174C3C]">Nenhum produto localizado</h2>
              <p className="text-xs text-[#202C27]/80 leading-relaxed">
                Não encontramos correspondências para &ldquo;{query}&rdquo;. Verifique a ortografia ou consulte todas as opções disponíveis.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSelectedCat("Todos");
                  }}
                  className="px-6 py-3 rounded-full bg-[#174C3C] text-[#FFFFFF] text-xs font-bold min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                >
                  Ver catálogo completo
                </button>
              </div>
            </div>
          )}

          {/* Grid */}
          {!loading && filteredProducts.length > 0 && (
            <section aria-label="Lista de produtos encontrados">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const isAdded = addedId === product.id;
                  const displayPrice =
                    product.price && product.price > 0
                      ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                      : "Consulte o valor";

                  return (
                    <article
                      key={product.id}
                      className="group bg-[#FFFFFF] rounded-3xl p-5 border border-[#E8EFE5] hover:border-[#78916D]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <Link
                        href={`/produto/${product.id}`}
                        className="block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded-2xl"
                        aria-label={`Ver detalhes de ${product.name}`}
                      >
                        {/* Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E8EFE5] text-[#174C3C] text-[10px] font-bold">
                            {product.brand}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-[#66716A]">
                            {product.size}
                          </span>
                        </div>

                        {/* Icon */}
                        <div className="mt-4 mb-4 h-40 rounded-2xl bg-[#FAF8F2] flex items-center justify-center text-5xl group-hover:scale-105 transition duration-300" aria-hidden="true">
                          {product.iconName === "dog-bowl" && "🍲"}
                          {product.iconName === "cat-bowl" && "🐟"}
                          {product.iconName === "bone" && "🦴"}
                          {product.iconName === "toy" && "🎾"}
                          {product.iconName === "shampoo" && "🧴"}
                          {product.iconName === "collar" && "🦮"}
                        </div>

                        {/* Info */}
                        <span className="text-[10px] uppercase font-bold text-[#78916D]">
                          {product.category}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#174C3C] line-clamp-2 mt-0.5 group-hover:text-[#78916D] transition">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#202C27]/75 line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      </Link>

                      {/* Bottom */}
                      <div className="pt-4 mt-4 border-t border-[#E8EFE5] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#66716A] block">Valor</span>
                          <span className="text-base sm:text-lg font-black text-[#174C3C]">
                            {displayPrice}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleAddToCart(product, e)}
                          aria-label={`Adicionar ${product.name} ao carrinho`}
                          className={`inline-flex items-center justify-center p-3 rounded-full transition shadow-sm min-w-[44px] min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C] ${
                            isAdded
                              ? "bg-[#78916D] text-[#FFFFFF]"
                              : "bg-[#174C3C] hover:bg-[#174C3C]/90 text-[#FFFFFF] active:scale-95"
                          }`}
                        >
                          {isAdded ? (
                            <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                          ) : (
                            <ShoppingBag className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
