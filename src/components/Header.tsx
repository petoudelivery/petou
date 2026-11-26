"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, ShoppingBag, Menu, X, MessageCircle } from "lucide-react";
import { CATEGORIES, Category } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  cartCount?: number;
  onOpenCart?: () => void;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function Header({
  cartCount,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, openCart } = useCart();
  const effectiveCartCount = cartCount ?? totalCount;
  const handleOpenCart = onOpenCart ?? openCart;

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  return (
    <header className="sticky top-0 z-40 w-full bg-petou-cream/95 backdrop-blur-md border-b border-petou-green/10 transition-all">
      {/* Top micro bar for Barcarena delivery info */}
      <div className="bg-petou-green text-petou-white text-xs py-1.5 px-4 text-center font-medium">
        <span>
          📍 Atendimento e entregas rápidas em toda a região de <strong>Barcarena</strong> | Estoque sob consulta
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <a href="#" className="flex items-center shrink-0">
            <div className="relative w-36 sm:w-44 h-12">
              <Image
                src="/petou-logo.png"
                alt="Petou Store"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </a>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar rações, petiscos, brinquedos..."
                className="w-full bg-petou-white text-petou-green placeholder-petou-green/50 text-sm rounded-full pl-11 pr-4 py-2.5 border border-petou-green/15 focus:outline-none focus:ring-2 focus:ring-petou-yellow focus:border-transparent transition shadow-sm"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-petou-green/60" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-2.5 text-petou-green/50 hover:text-petou-green text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-petou-green">
            <a href="#produtos" className="hover:text-petou-yellow transition">
              Produtos
            </a>
            <a href="#colecoes" className="hover:text-petou-yellow transition">
              Coleções
            </a>
            <a href="#vantagens" className="hover:text-petou-yellow transition">
              Vantagens
            </a>
            <a
              href={`https://wa.me/${cleanNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-petou-green hover:text-petou-yellow transition"
            >
              <MessageCircle className="w-4 h-4 text-petou-yellow" />
              WhatsApp
            </a>
          </nav>

          {/* Cart Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCart}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-petou-green text-petou-white hover:bg-petou-green/90 transition shadow-md shadow-petou-green/20"
              aria-label="Abrir carrinho de compras"
            >
              <ShoppingBag className="w-4 h-4 text-petou-yellow" />
              <span className="text-sm font-bold hidden sm:inline">Carrinho</span>
              <span className="w-6 h-6 rounded-full bg-petou-yellow text-petou-green text-xs font-black flex items-center justify-center">
                {effectiveCartCount}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-petou-green hover:bg-petou-green/10 transition"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar produtos ou categorias..."
              className="w-full bg-petou-white text-petou-green placeholder-petou-green/50 text-sm rounded-full pl-10 pr-4 py-2 border border-petou-green/15 focus:outline-none focus:ring-2 focus:ring-petou-yellow"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-petou-green/60" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-2 text-petou-green/50 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Links Subnav */}
        <div className="hidden sm:flex items-center gap-2 py-2.5 border-t border-petou-green/10 overflow-x-auto no-scrollbar text-xs font-medium text-petou-green/80">
          <span className="font-bold text-petou-green text-xs uppercase tracking-wider shrink-0 mr-1">
            Categorias:
          </span>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition ${
                selectedCategory === category
                  ? "bg-petou-green text-petou-white font-bold"
                  : "bg-petou-white/80 hover:bg-petou-white text-petou-green border border-petou-green/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-petou-cream border-t border-petou-green/10 p-6 space-y-4">
          <nav className="flex flex-col gap-3 font-semibold text-petou-green">
            <a
              href="#produtos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-petou-yellow transition"
            >
              Produtos em Destaque
            </a>
            <a
              href="#colecoes"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-petou-yellow transition"
            >
              Coleções Especiais
            </a>
            <a
              href="#vantagens"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-petou-yellow transition"
            >
              Vantagens Petou
            </a>
            <a
              href={`https://wa.me/${cleanNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1 flex items-center gap-2 text-petou-green hover:text-petou-yellow transition font-bold"
            >
              <MessageCircle className="w-4 h-4 text-petou-yellow" />
              Falar no WhatsApp
            </a>
          </nav>

          <div className="pt-3 border-t border-petou-green/10">
            <p className="text-xs font-bold text-petou-green uppercase mb-2">Filtrar por Categoria:</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-full ${
                    selectedCategory === cat
                      ? "bg-petou-green text-petou-white font-bold"
                      : "bg-petou-white text-petou-green border border-petou-green/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
