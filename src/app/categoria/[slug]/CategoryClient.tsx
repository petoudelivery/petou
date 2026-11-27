"use client";

import { useEffect, useState, useMemo, use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchProducts, slugToCategoryName } from "@/lib/storeService";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";
import {
  ChevronRight,
  ArrowUpDown,
  Search,
  ShoppingBag,
  Check,
  AlertCircle,
  Home as HomeIcon,
} from "lucide-react";

interface CategoryClientProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryClient({ params }: CategoryClientProps) {
  const resolved = use(params);
  const slug = resolved.slug;
  const categoryName = slugToCategoryName(slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchFilter, setSearchFilter] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [liveMessage, setLiveMessage] = useState("");

  const { addToCart, openCart } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const all = await fetchProducts();
        const filtered = all.filter(
          (p) =>
            p.category.toLowerCase().trim() === categoryName.toLowerCase().trim() ||
            p.category.toLowerCase().includes(categoryName.toLowerCase()) ||
            categoryName.toLowerCase().includes(p.category.toLowerCase())
        );
        setProducts(filtered);
      } catch (err) {
        console.error("Erro ao carregar produtos da categoria:", err);
        setError("Não foi possível carregar os produtos desta categoria no momento.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [categoryName]);

  const sortedAndFiltered = useMemo(() => {
    let list = [...products];

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, searchFilter, sortBy]);

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

  const getCategoryDescription = () => {
    switch (categoryName.toLowerCase()) {
      case "rações para cães":
        return "Rações secas, úmidas e fórmulas completas para cães de todas as idades e portes em Barcarena.";
      case "rações para gatos":
        return "Alimentos balanceados, controle de bolas de pelo e nutrição de alta palatabilidade para felinos.";
      case "petiscos":
        return "Biscoitos crocantes, bifinhos e petiscos 100% naturais para adestramento e carinho diário.";
      case "higiene":
        return "Shampoos suaves, produtos de banho e cuidados com a pelagem e pele do seu pet.";
      case "acessórios":
        return "Coleiras confortáveis, guias, brinquedos e itens de passeio com segurança reforçada.";
      default:
        return "Seleção de itens para a nutrição, higiene e diversão do seu pet com entrega ágil em Barcarena.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#202C27] font-sans antialiased">
      <Header
        selectedCategory="Todos"
        onSelectCategory={() => { }}
        searchQuery=""
        onSearchChange={() => { }}
      />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Screen Reader Live Announcements */}
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
            <span className="text-[#66716A]">Categorias</span>
            <ChevronRight className="w-3 h-3 text-[#66716A]" aria-hidden="true" />
            <span className="font-bold text-[#174C3C]" aria-current="page">{categoryName}</span>
          </nav>

          {/* Category Header */}
          <header className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 border border-[#E8EFE5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78916D]">
                Categoria Selecionada
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#174C3C] tracking-tight">
                {categoryName}
              </h1>
              <p className="text-sm text-[#202C27]/85 leading-relaxed">
                {getCategoryDescription()}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-4 py-2.5 rounded-2xl bg-[#E8EFE5] text-[#174C3C] text-xs font-bold">
                {sortedAndFiltered.length}{" "}
                {sortedAndFiltered.length === 1 ? "produto disponível" : "produtos disponíveis"}
              </div>
            </div>
          </header>

          {/* Search, Filter & Sort Controls */}
          <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8EFE5] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Filter Input */}
            <div className="relative w-full sm:w-72">
              <label htmlFor="category-search-filter" className="sr-only">
                Filtrar produtos por termo em {categoryName}
              </label>
              <input
                id="category-search-filter"
                type="search"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={`Filtrar em ${categoryName}...`}
                className="w-full bg-[#FAF8F2] text-[#202C27] placeholder-[#66716A]/75 text-xs px-3.5 py-2.5 rounded-xl border border-[#E8EFE5] focus-visible:outline-2 focus-visible:outline-[#174C3C] min-h-[44px]"
              />
              <Search className="absolute right-3 top-3 w-4 h-4 text-[#66716A]" aria-hidden="true" />
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label htmlFor="category-sort-select" className="text-xs font-bold text-[#202C27] flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#174C3C]" aria-hidden="true" />
                Ordenar por:
              </label>
              <select
                id="category-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF8F2] text-[#202C27] text-xs font-bold px-3 py-2.5 rounded-xl border border-[#E8EFE5] focus-visible:outline-2 focus-visible:outline-[#174C3C] min-h-[44px]"
              >
                <option value="featured">Destaques</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name">Nome (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div role="status" aria-label="Carregando produtos" className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#174C3C] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              <p className="text-xs font-bold text-[#66716A]">Carregando produtos da categoria...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div role="alert" className="p-8 rounded-3xl bg-red-50 border border-red-200 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto" aria-hidden="true" />
              <h2 className="text-base font-bold text-red-900">{error}</h2>
              <p className="text-xs text-red-800">Por favor, tente recarregar ou consulte nosso atendimento.</p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#174C3C] text-[#FFFFFF] text-xs font-bold min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
              >
                Voltar à página inicial
              </Link>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && sortedAndFiltered.length === 0 && (
            <div className="bg-[#FFFFFF] rounded-3xl p-12 text-center border border-[#E8EFE5] max-w-md mx-auto space-y-4">
              <span className="text-5xl" aria-hidden="true">🔍</span>
              <h2 className="text-lg font-bold text-[#174C3C]">Nenhum produto encontrado</h2>
              <p className="text-xs text-[#202C27]/80 leading-relaxed">
                Não localizamos itens para os filtros aplicados nesta categoria. Tente remover o filtro de texto ou navegar por outras categorias.
              </p>
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter("")}
                  className="px-6 py-3 rounded-full bg-[#174C3C] text-[#FFFFFF] text-xs font-bold min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                >
                  Limpar filtro de busca
                </button>
              )}
            </div>
          )}

          {/* Responsive Product Grid */}
          {!loading && !error && sortedAndFiltered.length > 0 && (
            <section aria-label={`Lista de produtos em ${categoryName}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedAndFiltered.map((product) => {
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
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#E8EFE5] text-[#174C3C] text-[10px] font-bold">
                            {product.brand}
                          </span>
                          {product.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#F47C49]/15 text-[#F47C49] text-[10px] font-bold">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Visual Placeholder */}
                        <div className="mt-4 mb-4 h-40 rounded-2xl bg-[#FAF8F2] flex items-center justify-center text-5xl group-hover:scale-105 transition duration-300" aria-hidden="true">
                          {product.iconName === "dog-bowl" && "🍲"}
                          {product.iconName === "cat-bowl" && "🐟"}
                          {product.iconName === "bone" && "🦴"}
                          {product.iconName === "toy" && "🎾"}
                          {product.iconName === "shampoo" && "🧴"}
                          {product.iconName === "collar" && "🦮"}
                        </div>

                        {/* Titles & Specs */}
                        <span className="text-[10px] uppercase font-bold text-[#66716A]">
                          {product.size}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-[#174C3C] line-clamp-2 mt-0.5 group-hover:text-[#78916D] transition">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#202C27]/75 line-clamp-2 mt-1 leading-relaxed">
                          {product.description}
                        </p>
                      </Link>

                      {/* Bottom Area: Price & Add Button */}
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
                          className={`inline-flex items-center justify-center p-3 rounded-full transition shadow-sm min-w-[44px] min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C] ${isAdded
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
