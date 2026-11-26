"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DEMO_PRODUCTS, Category } from "@/data/products";
import { fetchProducts } from "@/lib/storeService";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";
import {
  Truck,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Check,
} from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { addToCart, openCart } = useCart();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  useEffect(() => {
    async function loadData() {
      const data = await fetchProducts();
      setProducts(data);
    }
    loadData();
  }, []);

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategory(cat);
    const el = document.getElementById("produtos");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClearFilter = () => {
    setSelectedCategory("Todos");
    setSearchQuery("");
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
      openCart();
    }, 400);
  };

  // Filter products by category & search query
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat =
        selectedCategory === "Todos" || item.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  // Featured products for the "Escolhas para o dia a dia" section
  const featuredProducts = useMemo(() => {
    return filteredProducts.slice(0, 4);
  }, [filteredProducts]);

  const whatsappInquiryUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    "Olá! Gostaria de falar com a equipe PETOU sobre opções para meu pet e entregas em Barcarena."
  )}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#202C27] font-sans antialiased overflow-x-hidden">
      {/* 1. Announcement Bar & 2. Main Header */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* =========================================================================
            3. HERO SECTION
            Split layout on cream (#FAF8F2) with subtle paw watermarks on the left
            and organic curved transition to editorial photo (Golden Retriever + tabby cat)
           ========================================================================= */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden bg-[#FAF8F2] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E8EFE5]"
        >
          {/* Subtle paw watermarks on the left background */}
          <div aria-hidden="true" className="absolute top-12 left-6 pointer-events-none opacity-[0.06] select-none text-[#174C3C]">
            <svg width="220" height="220" viewBox="0 0 100 100" fill="currentColor">
              <ellipse cx="50" cy="62" rx="22" ry="17" />
              <circle cx="26" cy="38" r="9" />
              <circle cx="42" cy="27" r="9.5" />
              <circle cx="58" cy="27" r="9.5" />
              <circle cx="74" cy="38" r="9" />
            </svg>
          </div>
          <div aria-hidden="true" className="absolute bottom-8 left-1/3 pointer-events-none opacity-[0.04] select-none text-[#78916D]">
            <svg width="160" height="160" viewBox="0 0 100 100" fill="currentColor">
              <ellipse cx="50" cy="62" rx="22" ry="17" />
              <circle cx="26" cy="38" r="9" />
              <circle cx="42" cy="27" r="9.5" />
              <circle cx="58" cy="27" r="9.5" />
              <circle cx="74" cy="38" r="9" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headline, subcopy, CTA buttons */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Badge Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EFE5] text-[#174C3C] text-xs font-bold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#F47C49]" aria-hidden="true" />
                  <span>Pet shop especializado em Barcarena • Atendimento humanizado</span>
                </div>

                {/* Main Headline (H1) */}
                <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#174C3C] tracking-tight leading-[1.12]">
                  Tudo para cuidar melhor de quem faz parte da{" "}
                  <span className="relative inline-block text-[#F47C49]">
                    família.
                    <span className="absolute -bottom-1 left-0 w-full h-3 bg-[#F47C49]/25 rounded-full -rotate-1 pointer-events-none" aria-hidden="true" />
                  </span>
                </h1>

                {/* Subcopy */}
                <p className="text-base sm:text-lg text-[#66716A] max-w-xl leading-relaxed">
                  Encontre alimentação, higiene e acessórios com atendimento próximo e entrega em Barcarena.
                </p>

                {/* CTA Group: Primary button (#174C3C) + Secondary link */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <a
                    href="#produtos"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#174C3C] text-[#FFFFFF] font-bold text-sm hover:bg-[#174C3C]/90 active:scale-95 transition-all shadow-lg shadow-[#174C3C]/20 text-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                  >
                    <span>Explorar produtos</span>
                    <ArrowRight className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                  </a>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-[#174C3C] hover:text-[#174C3C]/80 font-bold text-sm hover:bg-[#E8EFE5]/50 transition-all text-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                  >
                    <span>Fale com a nossa equipe</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Right Column: Editorial photo composition */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/4.5] rounded-[2.5rem] bg-gradient-to-tr from-[#E8EFE5] via-[#FAF8F2] to-[#E8EFE5]/70 p-4 border border-[#78916D]/20 shadow-2xl overflow-hidden flex flex-col justify-between">
                  
                  {/* Organic curved shape background */}
                  <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#78916D]/15 blur-2xl pointer-events-none" aria-hidden="true" />
                  <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-[#F47C49]/10 blur-2xl pointer-events-none" aria-hidden="true" />

                  {/* Editorial Photo Composition */}
                  <div className="relative z-10 w-full flex-1 rounded-[2rem] overflow-hidden bg-[#FFFFFF] border border-[#E8EFE5] shadow-inner flex flex-col items-center justify-center p-6 text-center">
                    
                    {/* Visual Slot */}
                    <div
                      className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#FAF8F2] border-4 border-[#E8EFE5] shadow-md flex items-center justify-center overflow-hidden mb-4"
                      role="img"
                      aria-label="Ilustração editorial de um cachorro Golden Retriever e um gato companheiro"
                    >
                      <span className="text-6xl sm:text-7xl select-none transform hover:scale-110 transition duration-300">
                        🐕🐈
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8EFE5] text-[#174C3C] text-xs font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#F47C49]" aria-hidden="true" />
                      <span>Cães & Gatos</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-[#174C3C]">
                      Cuidado & Companheirismo
                    </h2>

                    <p className="text-xs text-[#66716A] max-w-xs mt-1 leading-relaxed">
                      Alimentos premium, petiscos e cuidados selecionados para o bem-estar do seu companheiro.
                    </p>
                  </div>

                  {/* Bottom reassurance micro-badge */}
                  <div className="relative z-10 mt-3 bg-[#FFFFFF]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E8EFE5] shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#78916D]" aria-hidden="true" />
                      <span className="text-xs font-bold text-[#174C3C]">Barcarena • Entrega Local</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#66716A]">Consulte estoque</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            4. TRUST STRIP
           ========================================================================= */}
        <section aria-label="Compromissos e diferenciais da PETOU Store" className="bg-[#FFFFFF] border-b border-[#E8EFE5] py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E8EFE5] gap-4 md:gap-0">
              
              {/* Item 1: Atendimento próximo */}
              <div className="flex items-center justify-center gap-3.5 py-3 md:py-2 px-4 text-center md:text-left">
                <div className="w-11 h-11 rounded-2xl bg-[#E8EFE5] text-[#174C3C] flex items-center justify-center shrink-0" aria-hidden="true">
                  <HeartHandshake className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#174C3C]">Atendimento próximo</h3>
                  <p className="text-xs text-[#66716A]">Suporte humanizado direto via WhatsApp</p>
                </div>
              </div>

              {/* Item 2: Estoque confirmado */}
              <div className="flex items-center justify-center gap-3.5 py-3 md:py-2 px-4 text-center md:text-left">
                <div className="w-11 h-11 rounded-2xl bg-[#E8EFE5] text-[#174C3C] flex items-center justify-center shrink-0" aria-hidden="true">
                  <CheckCircle2 className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#174C3C]">Estoque confirmado</h3>
                  <p className="text-xs text-[#66716A]">Itens checados antes de enviar seu pedido</p>
                </div>
              </div>

              {/* Item 3: Entrega local */}
              <div className="flex items-center justify-center gap-3.5 py-3 md:py-2 px-4 text-center md:text-left">
                <div className="w-11 h-11 rounded-2xl bg-[#E8EFE5] text-[#174C3C] flex items-center justify-center shrink-0" aria-hidden="true">
                  <Truck className="w-5 h-5 stroke-[1.8]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#174C3C]">Entrega local</h3>
                  <p className="text-xs text-[#66716A]">Agilidade na sua porta em Barcarena</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CATEGORIES GRID
           ========================================================================= */}
        <section id="categorias" aria-labelledby="categories-heading" className="py-16 sm:py-20 bg-[#FAF8F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center sm:text-left mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78916D]">
                Categorias Principais
              </span>
              <h2 id="categories-heading" className="text-3xl sm:text-4xl font-black text-[#174C3C] tracking-tight mt-1">
                Encontre o que seu pet precisa
              </h2>
              <p className="text-sm text-[#66716A] mt-1.5 max-w-xl">
                Navegue pelas principais categorias para encontrar a nutrição e o cuidado ideal.
              </p>
            </div>

            {/* 4 Large Split Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Cães */}
              <Link
                href="/categoria/caes"
                aria-label="Ver categoria Cães: Rações selecionadas, brinquedos e acessórios"
                className="group rounded-3xl bg-[#FFFFFF] border border-[#E8EFE5] hover:border-[#78916D]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-56 focus-visible:outline-2 focus-visible:outline-[#174C3C]"
              >
                <div className="sm:w-1/2 bg-gradient-to-tr from-[#E8EFE5] to-[#FAF8F2] flex flex-col items-center justify-center p-6 relative">
                  <span className="text-6xl group-hover:scale-110 transition duration-300 select-none" aria-hidden="true">
                    🐕
                  </span>
                  <span className="text-xs font-bold text-[#174C3C] mt-2">Mundo Canino</span>
                </div>
                <div className="sm:w-1/2 bg-[#174C3C] p-6 text-[#FFFFFF] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47C49]">
                      Categoria
                    </span>
                    <h3 className="text-2xl font-black text-[#FFFFFF] mt-1">Cães</h3>
                    <p className="text-xs text-[#FAF8F2]/80 mt-1 leading-relaxed">
                      Rações selecionadas, brinquedos e acessórios para todas as fases.
                    </p>
                  </div>
                  <div className="flex justify-end pt-3">
                    <span className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#174C3C] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F47C49] group-hover:text-[#FFFFFF] transition duration-200 shadow-md" aria-hidden="true">
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card 2: Gatos */}
              <Link
                href="/categoria/gatos"
                aria-label="Ver categoria Gatos: Alimentação saborosa, controle de bolas de pelo e bem-estar"
                className="group rounded-3xl bg-[#FFFFFF] border border-[#E8EFE5] hover:border-[#78916D]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-56 focus-visible:outline-2 focus-visible:outline-[#174C3C]"
              >
                <div className="sm:w-1/2 bg-gradient-to-tr from-[#E8EFE5] to-[#FAF8F2] flex flex-col items-center justify-center p-6 relative">
                  <span className="text-6xl group-hover:scale-110 transition duration-300 select-none" aria-hidden="true">
                    🐈
                  </span>
                  <span className="text-xs font-bold text-[#174C3C] mt-2">Mundo Felino</span>
                </div>
                <div className="sm:w-1/2 bg-[#174C3C] p-6 text-[#FFFFFF] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47C49]">
                      Categoria
                    </span>
                    <h3 className="text-2xl font-black text-[#FFFFFF] mt-1">Gatos</h3>
                    <p className="text-xs text-[#FAF8F2]/80 mt-1 leading-relaxed">
                      Alimentação saborosa, controle de bolas de pelo e bem-estar felino.
                    </p>
                  </div>
                  <div className="flex justify-end pt-3">
                    <span className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#174C3C] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F47C49] group-hover:text-[#FFFFFF] transition duration-200 shadow-md" aria-hidden="true">
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card 3: Alimentação */}
              <Link
                href="/categoria/alimentacao"
                aria-label="Ver categoria Alimentação: Rações premium balanceadas e petiscos naturais"
                className="group rounded-3xl bg-[#FFFFFF] border border-[#E8EFE5] hover:border-[#78916D]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-56 focus-visible:outline-2 focus-visible:outline-[#174C3C]"
              >
                <div className="sm:w-1/2 bg-gradient-to-tr from-[#E8EFE5] to-[#FAF8F2] flex flex-col items-center justify-center p-6 relative">
                  <span className="text-6xl group-hover:scale-110 transition duration-300 select-none" aria-hidden="true">
                    🥣
                  </span>
                  <span className="text-xs font-bold text-[#174C3C] mt-2">Nutrição Pet</span>
                </div>
                <div className="sm:w-1/2 bg-[#174C3C] p-6 text-[#FFFFFF] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47C49]">
                      Categoria
                    </span>
                    <h3 className="text-2xl font-black text-[#FFFFFF] mt-1">Alimentação</h3>
                    <p className="text-xs text-[#FAF8F2]/80 mt-1 leading-relaxed">
                      Rações premium balanceadas e petiscos naturais para recompensa.
                    </p>
                  </div>
                  <div className="flex justify-end pt-3">
                    <span className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#174C3C] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F47C49] group-hover:text-[#FFFFFF] transition duration-200 shadow-md" aria-hidden="true">
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card 4: Higiene e cuidados */}
              <Link
                href="/categoria/higiene"
                aria-label="Ver categoria Higiene e cuidados: Shampoos suaves, escovação e bem-estar"
                className="group rounded-3xl bg-[#FFFFFF] border border-[#E8EFE5] hover:border-[#78916D]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row h-auto sm:h-56 focus-visible:outline-2 focus-visible:outline-[#174C3C]"
              >
                <div className="sm:w-1/2 bg-gradient-to-tr from-[#E8EFE5] to-[#FAF8F2] flex flex-col items-center justify-center p-6 relative">
                  <span className="text-6xl group-hover:scale-110 transition duration-300 select-none" aria-hidden="true">
                    🧴
                  </span>
                  <span className="text-xs font-bold text-[#174C3C] mt-2">Saúde & Banho</span>
                </div>
                <div className="sm:w-1/2 bg-[#174C3C] p-6 text-[#FFFFFF] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F47C49]">
                      Categoria
                    </span>
                    <h3 className="text-2xl font-black text-[#FFFFFF] mt-1">Higiene e cuidados</h3>
                    <p className="text-xs text-[#FAF8F2]/80 mt-1 leading-relaxed">
                      Shampoos suaves, escovação e produtos de cuidado diário com carinho.
                    </p>
                  </div>
                  <div className="flex justify-end pt-3">
                    <span className="w-10 h-10 rounded-full bg-[#FFFFFF] text-[#174C3C] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F47C49] group-hover:text-[#FFFFFF] transition duration-200 shadow-md" aria-hidden="true">
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>

            </div>

          </div>
        </section>

        {/* =========================================================================
            6. FEATURED PRODUCTS
           ========================================================================= */}
        <section id="produtos" aria-labelledby="products-heading" className="py-16 sm:py-20 bg-[#FFFFFF] border-t border-b border-[#E8EFE5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78916D]">
                  Catálogo Selecionado
                </span>
                <h2 id="products-heading" className="text-3xl sm:text-4xl font-black text-[#174C3C] tracking-tight mt-1">
                  Escolhas para o dia a dia
                </h2>
                <p className="text-sm text-[#66716A] mt-1">
                  Produtos que aliam qualidade, praticidade e nutrição para a rotina do seu pet.
                </p>
              </div>

              {/* Category Quick Filter */}
              <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filtro rápido por categoria">
                <span className="text-xs font-bold text-[#66716A]">Filtrar:</span>
                {(["Todos", "Rações para cães", "Rações para gatos", "Petiscos", "Higiene"] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-3.5 py-2 rounded-full font-semibold transition min-h-[40px] focus-visible:outline-2 focus-visible:outline-[#174C3C] ${
                      selectedCategory === cat
                        ? "bg-[#174C3C] text-[#FFFFFF]"
                        : "bg-[#FAF8F2] text-[#202C27] hover:bg-[#E8EFE5] border border-[#E8EFE5]"
                    }`}
                    aria-pressed={selectedCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Horizontal Cards Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProducts.map((product) => {
                const isItemAdded = addedProductId === product.id;
                const displayPrice =
                  product.price && product.price > 0
                    ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                    : "Consulte o valor";

                return (
                  <article
                    key={product.id}
                    className="p-5 rounded-3xl bg-[#FAF8F2] border border-[#E8EFE5] hover:border-[#78916D]/30 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row items-center gap-5"
                  >
                    {/* Left Product Image / Visual */}
                    <div className="w-full sm:w-40 h-36 rounded-2xl bg-[#FFFFFF] border border-[#E8EFE5] flex flex-col items-center justify-center p-3 shrink-0" aria-hidden="true">
                      <span className="text-4xl select-none">
                        {product.iconName === "dog-bowl" && "🍲"}
                        {product.iconName === "cat-bowl" && "🐟"}
                        {product.iconName === "bone" && "🦴"}
                        {product.iconName === "toy" && "🎾"}
                        {product.iconName === "shampoo" && "🧴"}
                        {product.iconName === "collar" && "🦮"}
                      </span>
                      <span className="text-[10px] font-bold text-[#78916D] mt-2">
                        {product.brand} • {product.size}
                      </span>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-3 w-full">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#66716A]">
                          {product.category}
                        </span>
                        <Link
                          href={`/produto/${product.id}`}
                          className="hover:text-[#78916D] transition block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded"
                        >
                          <h3 className="text-base sm:text-lg font-bold text-[#174C3C] line-clamp-1 mt-0.5">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-[#66716A] line-clamp-2 mt-1 leading-relaxed">
                          {product.description || "Alimento com formulação completa para a saúde e energia do seu pet."}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E8EFE5]">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-[#66716A] block">
                            Preço
                          </span>
                          <span className="text-lg font-black text-[#174C3C]">
                            {displayPrice}
                          </span>
                        </div>

                        {/* CTA Group: Ver detalhes link & Adicionar cart button */}
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/produto/${product.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold bg-[#174C3C] hover:bg-[#174C3C]/90 text-[#FFFFFF] active:scale-95 transition shadow-sm min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                          >
                            <span>Ver detalhes</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#F47C49]" aria-hidden="true" />
                          </Link>
                          
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            aria-label={`Adicionar ${product.name} ao carrinho`}
                            className={`p-2.5 rounded-full border transition min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#174C3C] ${
                              isItemAdded
                                ? "bg-[#78916D] text-[#FFFFFF] border-[#78916D]"
                                : "bg-[#FFFFFF] text-[#174C3C] border-[#E8EFE5] hover:bg-[#E8EFE5]"
                            }`}
                          >
                            {isItemAdded ? (
                              <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* If user filtered, display other matching products or clear button */}
            {selectedCategory !== "Todos" && (
              <div className="mt-8 pt-6 border-t border-[#E8EFE5] flex items-center justify-between text-xs text-[#66716A]">
                <span>
                  Exibindo filtro por <strong>{selectedCategory}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="text-[#174C3C] font-bold underline hover:text-[#F47C49] p-1 rounded focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                >
                  Ver todos os produtos
                </button>
              </div>
            )}

          </div>
        </section>

        {/* =========================================================================
            7. ASSISTANCE BANNER
           ========================================================================= */}
        <section aria-labelledby="assistance-heading" className="py-14 sm:py-16 bg-[#FAF8F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2.5rem] bg-[#E8EFE5] border border-[#78916D]/30 p-8 sm:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
              
              {/* Left Side: Chat-paw icon + Vertical Divider + Copy */}
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                
                {/* Chat-Paw Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#174C3C] text-[#FAF8F2] flex items-center justify-center shrink-0 shadow-md" aria-hidden="true">
                  <div className="relative">
                    <MessageCircle className="w-8 h-8 stroke-[1.8]" />
                    <span className="absolute -top-1 -right-1 text-sm select-none">🐾</span>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block h-12 w-px bg-[#78916D]/30" aria-hidden="true" />

                {/* Copy */}
                <div>
                  <h2 id="assistance-heading" className="text-2xl sm:text-3xl font-black text-[#174C3C] tracking-tight">
                    Precisa de ajuda para escolher?
                  </h2>
                  <p className="text-sm sm:text-base text-[#66716A] mt-1 font-medium">
                    Nossa equipe está pronta para te atender!
                  </p>
                </div>
              </div>

              {/* Right Side: Dark green pill button "Converse com a PETOU" */}
              <div className="shrink-0 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                    "Olá, equipe PETOU! Preciso de ajuda para escolher o melhor produto para meu pet em Barcarena."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#174C3C] text-[#FFFFFF] font-bold text-sm hover:bg-[#174C3C]/90 active:scale-95 transition-all shadow-lg shadow-[#174C3C]/20 min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                >
                  <MessageCircle className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                  <span>Converse com a PETOU</span>
                </a>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
