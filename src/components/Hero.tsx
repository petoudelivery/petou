"use client";

import { Search, ArrowRight, Star, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { Category } from "@/data/products";

interface HeroProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
}

const POPULAR_CHIPS: Category[] = [
  "Rações para cães",
  "Rações para gatos",
  "Petiscos",
  "Brinquedos",
  "Higiene",
  "Acessórios",
];

export default function Hero({
  onSearch,
  searchQuery,
  selectedCategory,
  onSelectCategory,
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-petou-cream via-petou-cream/80 to-petou-white pt-8 pb-16 lg:py-20 border-b border-petou-green/10">
      {/* Soft decorative background circles */}
      <div className="absolute top-10 -left-20 w-80 h-80 rounded-full bg-petou-yellow/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-petou-green/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines, Search, Chips, Social Proof */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Location Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-petou-green/10 text-petou-green text-xs sm:text-sm font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-petou-yellow animate-pulse" />
              <span>Pet shop online oficial • Barcarena & Região</span>
            </div>

            {/* Main H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-petou-green tracking-tight leading-[1.1]">
              Tudo para seu pet, <br className="hidden sm:inline" />
              <span className="relative text-petou-green">
                na sua porta!
                <span className="absolute bottom-1.5 left-0 w-full h-3 bg-petou-yellow/40 -z-10 rounded-sm -rotate-1" />
              </span>
            </h1>

            {/* Delivery Subtitle for Barcarena */}
            <p className="text-base sm:text-lg text-petou-green/80 max-w-xl leading-relaxed">
              Rações selecionadas, petiscos saudáveis e os melhores acessórios para cães e gatos.
              Atendimento personalizado e <strong>entrega rápida em Barcarena</strong> com confirmação direta pelo WhatsApp.
            </p>

            {/* Search Bar in Hero */}
            <div className="max-w-xl">
              <div className="flex items-center bg-petou-white rounded-2xl p-2 border-2 border-petou-green/15 shadow-lg shadow-petou-green/5 focus-within:border-petou-green transition-all">
                <Search className="w-5 h-5 text-petou-green/50 ml-3 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="O que o seu pet precisa hoje?"
                  className="w-full bg-transparent text-sm sm:text-base text-petou-green placeholder-petou-green/45 focus:outline-none"
                />
                <a
                  href="#produtos"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-petou-green text-petou-white font-bold text-sm hover:bg-petou-green/90 transition shrink-0 shadow-md"
                >
                  <span>Ver produtos</span>
                  <ArrowRight className="w-4 h-4 text-petou-yellow" />
                </a>
              </div>
            </div>

            {/* Popular Categories filter chips */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-petou-green/70 block">
                Categorias populares:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_CHIPS.map((chip) => {
                  const isActive = selectedCategory === chip;
                  return (
                    <button
                      key={chip}
                      onClick={() => onSelectCategory(isActive ? "Todos" : chip)}
                      className={`text-xs sm:text-sm px-4 py-2 rounded-full font-semibold transition-all border ${
                        isActive
                          ? "bg-petou-green text-petou-white border-petou-green shadow-sm scale-105"
                          : "bg-petou-white hover:bg-petou-cream text-petou-green border-petou-green/15 hover:border-petou-green/30"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Social Proof (Reference Match) */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-petou-green/80">
              <div className="flex items-center gap-2 bg-petou-white/90 px-4 py-2 rounded-full border border-petou-green/10 shadow-sm">
                <div className="flex -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-petou-yellow flex items-center justify-center text-xs font-bold text-petou-green border-2 border-petou-white">
                    🐕
                  </span>
                  <span className="w-7 h-7 rounded-full bg-petou-green flex items-center justify-center text-xs font-bold text-petou-white border-2 border-petou-white">
                    🐈
                  </span>
                  <span className="w-7 h-7 rounded-full bg-[#FAB31F] flex items-center justify-center text-xs font-bold text-petou-green border-2 border-petou-white">
                    🐾
                  </span>
                </div>
                <div className="pl-1">
                  <div className="flex items-center text-petou-yellow">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-petou-yellow" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-petou-green">
                    +1.000 tutores atendidos em Barcarena
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Slot for Dog & Cat Illustration/Photo with floating cards */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/4.5] sm:aspect-[4/4] rounded-3xl bg-gradient-to-tr from-petou-green/10 via-petou-yellow/15 to-petou-cream p-6 flex flex-col justify-between border border-petou-green/10 shadow-xl overflow-hidden">
              
              {/* Pet Silhouette / Visual Composition Artwork */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full text-petou-green/15"
                  fill="currentColor"
                >
                  <circle cx="250" cy="250" r="180" className="text-petou-yellow/20" />
                  <path d="M190 290c-25 0-45-20-45-45s20-45 45-45 45 20 45 45-20 45-45 45zm120 0c-25 0-45-20-45-45s20-45 45-45 45 20 45 45-20 45-45 45zm-60 110c-50 0-90-30-90-70 0-15 15-25 35-25 15 0 25 10 55 10s40-10 55-10c20 0 35 10 35 25 0 40-40 70-90 70z" />
                  <ellipse cx="140" cy="140" rx="35" ry="50" className="text-petou-green/15" />
                  <ellipse cx="360" cy="140" rx="35" ry="50" className="text-petou-green/15" />
                </svg>
              </div>

              {/* Graphic Pet Hero Display */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-8">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-petou-green text-petou-yellow flex items-center justify-center shadow-lg border-4 border-petou-white transform rotate-3 hover:rotate-0 transition duration-300">
                  <span className="text-5xl sm:text-6xl">🐶🐱</span>
                </div>
                <h3 className="mt-4 text-xl sm:text-2xl font-black text-petou-green tracking-tight">
                  Cães e Gatos Felizes
                </h3>
                <p className="text-xs sm:text-sm text-petou-green/75 max-w-xs mt-1">
                  Produtos originais e estoque com conferência imediata no atendimento.
                </p>
              </div>

              {/* Floating Benefit Cards (Matches Reference Visual Style) */}
              <div className="relative z-10 space-y-2.5">
                <div className="bg-petou-white/95 backdrop-blur-md p-3 rounded-2xl border border-petou-green/10 shadow-md flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-petou-green/10 text-petou-green flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-petou-green" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-petou-green">Produtos Originais PETOU</h5>
                    <p className="text-[10px] text-petou-green/70">Qualidade comprovada para seu pet</p>
                  </div>
                </div>

                <div className="bg-petou-white/95 backdrop-blur-md p-3 rounded-2xl border border-petou-green/10 shadow-md flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-petou-yellow/30 text-petou-green flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-petou-green" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-petou-green">Entrega Rápida em Barcarena</h5>
                    <p className="text-[10px] text-petou-green/70">Direto na sua porta com comodidade</p>
                  </div>
                </div>

                <div className="bg-petou-white/95 backdrop-blur-md p-3 rounded-2xl border border-petou-green/10 shadow-md flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-petou-green text-petou-yellow flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-petou-green">Suporte via WhatsApp</h5>
                    <p className="text-[10px] text-petou-green/70">Confirmação de estoque e pedidos</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
