"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Truck,
  Dog,
  Cat,
  Utensils,
  Sparkles,
  Tag,
  Search,
  ShoppingBag,
  Menu,
  X,
  MessageCircle,
} from "lucide-react";
import { Category } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  selectedCategory?: Category;
  onSelectCategory?: (cat: Category) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const NAV_CATEGORIES = [
  { name: "Cães", category: "Rações para cães" as Category, slug: "caes", icon: Dog },
  { name: "Gatos", category: "Rações para gatos" as Category, slug: "gatos", icon: Cat },
  { name: "Alimentação", category: "Petiscos" as Category, slug: "alimentacao", icon: Utensils },
  { name: "Higiene e cuidados", category: "Higiene" as Category, slug: "higiene", icon: Sparkles },
  { name: "Acessórios", category: "Acessórios" as Category, slug: "acessorios", icon: Tag },
];

export default function Header({
  cartCount,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  searchQuery: externalQuery,
  onSearchChange: externalChange,
}: HeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");

  const currentQuery = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = externalChange !== undefined ? externalChange : setInternalQuery;

  const { totalCount, openCart } = useCart();
  const effectiveCartCount = cartCount ?? totalCount;
  const handleOpenCart = onOpenCart ?? openCart;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  // WCAG 2.2: Esc key closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(currentQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleNavClick = (cat: Category, slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
    setMobileMenuOpen(false);
    router.push(`/categoria/${slug}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FDF9F1]/95 backdrop-blur-md border-b border-[#08422E]/10 transition-all">
      {/* Top Announcement Bar */}
      <aside aria-label="Aviso de entrega" className="bg-[#08422E] text-[#FDF9F1] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Truck className="w-3.5 h-3.5 text-[#FAB31F]" aria-hidden="true" />
        <span>
          Entrega local em Barcarena • <strong>Consulte disponibilidade</strong>
        </span>
      </aside>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Left: logo + Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              aria-label="Página inicial Petou Store"
              className="flex items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-[#08422E]"
            >
              <div className="relative w-32 sm:w-36 h-10">
                <Image
                  src="/petou-logo.png"
                  alt="PETOU - Logotipo oficial"
                  fill
                  priority
                  sizes="(max-width: 640px) 128px, 144px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <div className="hidden xl:block h-6 w-px bg-[#08422E]/15" aria-hidden="true" />
            <span className="hidden xl:block text-xs font-medium text-[#66716A]">
              Tudo para o seu pet pertinho de você.
            </span>
          </div>

          {/* Center: Desktop Navigation */}
          <nav aria-label="Navegação de categorias de produtos" className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_CATEGORIES.map((item) => {
              const Icon = item.icon;
              const isActive = selectedCategory === item.category;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleNavClick(item.category, item.slug)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs xl:text-sm font-semibold transition-all min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#08422E] ${isActive
                    ? "bg-[#08422E] text-[#FFFFFF] shadow-sm"
                    : "text-[#202C27] hover:text-[#08422E] hover:bg-[#08422E]/8"
                    }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4 stroke-[1.8]" aria-hidden="true" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Search + Cart */}
          <div className="flex items-center gap-3">
            {/* Search Pill - Desktop & Tablet */}
            <form onSubmit={handleSearchSubmit} role="search" className="hidden sm:flex relative w-48 md:w-56 lg:w-64">
              <label htmlFor="desktop-search-input" className="sr-only">
                Buscar produtos na Petou Store
              </label>
              <input
                id="desktop-search-input"
                type="search"
                value={currentQuery}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full bg-[#FFFFFF] text-[#202C27] placeholder-[#66716A]/75 text-xs sm:text-sm rounded-full pl-9 pr-7 py-2.5 border border-[#08422E]/15 focus-visible:outline-2 focus-visible:outline-[#08422E] transition shadow-sm min-h-[44px]"
              />
              <button
                type="submit"
                aria-label="Executar pesquisa de produtos"
                className="absolute left-3 top-3 text-[#66716A] hover:text-[#08422E] focus-visible:outline-2 focus-visible:outline-[#08422E] rounded"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
              </button>
              {currentQuery && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Limpar termo de busca"
                  className="absolute right-2.5 top-2.5 text-[#66716A] hover:text-[#202C27] text-xs font-bold p-1 rounded focus-visible:outline-2 focus-visible:outline-[#08422E]"
                >
                  ✕
                </button>
              )}
            </form>

            {/* Cart button */}
            <button
              type="button"
              onClick={handleOpenCart}
              aria-label={`Abrir carrinho com ${effectiveCartCount} ${effectiveCartCount === 1 ? "item" : "itens"
                }`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#08422E] text-[#FFFFFF] hover:bg-[#08422E]/90 active:scale-95 transition-all shadow-md shadow-[#08422E]/15 min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#08422E] focus-visible:outline-offset-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#FAB31F]" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-bold hidden md:inline">Carrinho</span>
              <span className="w-5 h-5 rounded-full bg-[#FAB31F] text-[#08422E] text-[11px] font-black flex items-center justify-center">
                {effectiveCartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu principal" : "Abrir menu principal"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
              className="lg:hidden p-2.5 rounded-2xl text-[#08422E] hover:bg-[#08422E]/8 min-w-[44px] min-h-[44px] flex items-center justify-center transition focus-visible:outline-2 focus-visible:outline-[#08422E]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input bar */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearchSubmit} role="search" className="relative w-full">
            <label htmlFor="mobile-search-input" className="sr-only">
              Buscar produtos na Petou Store
            </label>
            <input
              id="mobile-search-input"
              type="search"
              value={currentQuery}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="w-full bg-[#FFFFFF] text-[#202C27] placeholder-[#66716A]/75 text-xs rounded-full pl-9 pr-7 py-2.5 border border-[#08422E]/15 focus-visible:outline-2 focus-visible:outline-[#08422E] min-h-[44px]"
            />
            <button
              type="submit"
              aria-label="Executar pesquisa"
              className="absolute left-3 top-3 text-[#66716A] focus-visible:outline-2 focus-visible:outline-[#08422E]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </button>
            {currentQuery && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpar termo de busca"
                className="absolute right-2.5 top-2.5 text-[#66716A] text-xs p-1 focus-visible:outline-2 focus-visible:outline-[#08422E]"
              >
                ✕
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Clean Mobile Drawer Menu with zero horizontal overflow */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu principal de navegação"
          className="lg:hidden fixed inset-x-0 top-[116px] bottom-0 bg-[#FDF9F1] z-50 overflow-y-auto overflow-x-hidden border-t border-[#08422E]/10 p-6 shadow-2xl"
        >
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <p className="text-[11px] font-bold tracking-wider text-[#66716A] mb-3">
                Categorias principais
              </p>
              <nav aria-label="Menu móvel por categorias" className="grid grid-cols-1 gap-2">
                {NAV_CATEGORIES.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedCategory === item.category;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleNavClick(item.category, item.slug)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left text-sm font-semibold transition min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#08422E] ${isActive
                        ? "bg-[#08422E] text-[#FFFFFF]"
                        : "bg-[#FFFFFF] text-[#202C27] border border-[#08422E]/10 hover:bg-[#FDF9F1]"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? "bg-[#FFFFFF]/20 text-[#FFFFFF]" : "bg-[#FDF9F1] text-[#08422E]"
                            }`}
                          aria-hidden="true"
                        >
                          <Icon className="w-4 h-4 stroke-[2]" />
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-xs opacity-60" aria-hidden="true">→</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#08422E]/10 space-y-3">
              <a
                href={`https://wa.me/${cleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#08422E] text-[#FFFFFF] text-sm font-bold shadow-md min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#08422E]"
              >
                <MessageCircle className="w-4 h-4 text-[#FAB31F]" aria-hidden="true" />
                <span>Atendimento WhatsApp Barcarena</span>
              </a>

              <p className="text-center text-xs text-[#66716A]">
                Tudo para o seu pet pertinho de você • Barcarena - PA
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
