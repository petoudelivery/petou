"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
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
  Check,
} from "lucide-react";

interface ProductWithImage extends Product {
  image?: string;
  image_url?: string;
}

const getProductImage = (product: Product): string => {
  const item = product as ProductWithImage;
  if (item.image) return item.image;
  if (item.image_url) return item.image_url;
  switch (product.iconName) {
    case "dog-bowl":
      return "/product-dog-food.jpg";
    case "cat-bowl":
      return "/category-food.jpg";
    case "bone":
      return "/category-food.jpg";
    case "toy":
      return "/category-toys.jpg";
    case "shampoo":
      return "/category-hygiene.jpg";
    case "collar":
      return "/category-accessories.jpg";
    default:
      return "/product-dog-food.jpg";
  }
};

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
    return filteredProducts;
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
            Photographic Split-Layout:
            - Left: Warm cream background (#FDF9F1), ~50% width with typography and CTAs
            - Right: Full-height editorial photograph of a Golden Retriever and tabby cat
            - Subtle organic curved transition between text and image
           ========================================================================= */}
        <section
          aria-labelledby="hero-heading"
          className="relative bg-[#FDF9F1] border-b border-[#08422E]/10 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row items-stretch min-h-[560px] lg:min-h-[620px] xl:min-h-[660px]">

            {/* Left side: ~50% width, warm cream background (#FDF9F1) */}
            <div className="w-full lg:w-1/2 flex items-center bg-[#FDF9F1] px-5 sm:px-10 lg:px-12 xl:px-16 py-12 sm:py-16 lg:py-20 z-10">
              <div className="max-w-xl mx-auto lg:mx-0 space-y-6 text-left">

                {/* Subtle reassurance badge with yellow accent */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08422E]/5 border border-[#08422E]/10 text-[#08422E] text-xs font-bold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-[#FAB31F]" aria-hidden="true" />
                  <span>Pet shop em Barcarena • Atendimento humanizado</span>
                </div>

                {/* Headline */}
                <h1
                  id="hero-heading"
                  className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-black text-[#08422E] tracking-tight leading-[1.12]"
                >
                  Tudo para cuidar melhor de quem faz parte da{" "}
                  <span className="relative inline-block">
                    família.
                    <span
                      className="absolute -bottom-1.5 left-0 w-full h-3 bg-[#FAB31F]/35 rounded-full -rotate-1 pointer-events-none"
                      aria-hidden="true"
                    />
                  </span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-[#202C27]/80 leading-relaxed max-w-lg">
                  Encontre alimentação, higiene e acessórios com atendimento próximo e entrega em Barcarena.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                  <a
                    href="#produtos"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#08422E] text-[#FFFFFF] font-bold text-sm hover:bg-[#08422E]/90 active:scale-95 transition-all shadow-lg shadow-[#08422E]/20 text-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#08422E]"
                  >
                    <span>Explorar produtos</span>
                    <ArrowRight className="w-4 h-4 text-[#FAB31F]" aria-hidden="true" />
                  </a>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-[#08422E] font-bold text-sm bg-[#FFFFFF] hover:bg-[#FFFFFF]/90 border border-[#08422E]/15 transition-all shadow-sm text-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#08422E]"
                  >
                    <span>Fale com a nossa equipe</span>
                    <ArrowRight className="w-4 h-4 text-[#08422E]" aria-hidden="true" />
                  </a>
                </div>

              </div>
            </div>

            {/* Right side: ~50% width, full-height photograph of Golden Retriever & tabby cat */}
            <div className="w-full lg:w-1/2 relative min-h-[360px] sm:min-h-[440px] lg:min-h-[620px] xl:min-h-[660px] bg-[#FDF9F1] overflow-hidden flex items-stretch">

              {/* Subtle organic curved transition (Desktop: left edge) */}
              <div
                className="hidden lg:block absolute inset-y-0 -left-1 w-16 xl:w-24 z-10 pointer-events-none"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 100 1000"
                  preserveAspectRatio="none"
                  className="w-full h-full text-[#FDF9F1] fill-current"
                >
                  <path d="M0 0 L100 0 C35 220 5 380 25 600 C45 800 15 920 100 1000 L0 1000 Z" />
                </svg>
              </div>

              {/* Subtle organic curved transition (Mobile: top edge) */}
              <div
                className="lg:hidden absolute -top-1 inset-x-0 h-10 sm:h-14 z-10 pointer-events-none"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                  className="w-full h-full text-[#FDF9F1] fill-current"
                >
                  <path d="M0 0 L1000 0 L1000 35 C750 95 250 5 0 65 Z" />
                </svg>
              </div>

              {/* Full-height Editorial Photograph */}
              <div className="relative w-full h-full min-h-[360px] sm:min-h-[440px] lg:min-h-full">
                <Image
                  src="/hero-pets.jpg"
                  alt="Fotografia de um cão Golden Retriever e um gato malhado juntos"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            4. BENEFITS STRIP
            Redesigned Compact, Elegant Horizontal Benefits Strip:
            - Official PETOU palette: #08422E, #FAB31F, #FDF9F1, #FFFFFF
            - 4 existing store benefits in a single horizontal row on desktop
            - Simple, consistent icons and short, easy-to-understand text
            - Balanced spacing and clean mobile responsiveness
           ========================================================================= */}
        <section
          aria-label="Benefícios e diferenciais da PETOU Store"
          className="bg-[#FFFFFF] border-b border-[#08422E]/10 py-5 sm:py-6"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-[#08422E]/10">

              {/* Benefit 1: Praticidade */}
              <div className="flex items-center gap-3.5 py-2 px-3 sm:px-4 lg:justify-center">
                <div
                  className="w-11 h-11 rounded-2xl bg-[#FDF9F1] border border-[#08422E]/10 text-[#08422E] flex items-center justify-center shrink-0 shadow-sm relative"
                  aria-hidden="true"
                >
                  <MessageCircle className="w-5 h-5 stroke-[1.8]" />
                  <span className="w-2 h-2 rounded-full bg-[#FAB31F] absolute top-1.5 right-1.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#08422E] tracking-tight">Praticidade total</h3>
                  <p className="text-xs text-[#202C27]/75">Peça em segundos pelo celular</p>
                </div>
              </div>

              {/* Benefit 2: Atendimento no WhatsApp */}
              <div className="flex items-center gap-3.5 py-2 px-3 sm:px-4 lg:justify-center">
                <div
                  className="w-11 h-11 rounded-2xl bg-[#FDF9F1] border border-[#08422E]/10 text-[#08422E] flex items-center justify-center shrink-0 shadow-sm relative"
                  aria-hidden="true"
                >
                  <HeartHandshake className="w-5 h-5 stroke-[1.8]" />
                  <span className="w-2 h-2 rounded-full bg-[#FAB31F] absolute top-1.5 right-1.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#08422E] tracking-tight">Atendimento próximo</h3>
                  <p className="text-xs text-[#202C27]/75">Suporte humanizado no WhatsApp</p>
                </div>
              </div>

              {/* Benefit 3: Entrega em Barcarena */}
              <div className="flex items-center gap-3.5 py-2 px-3 sm:px-4 lg:justify-center">
                <div
                  className="w-11 h-11 rounded-2xl bg-[#FDF9F1] border border-[#08422E]/10 text-[#08422E] flex items-center justify-center shrink-0 shadow-sm relative"
                  aria-hidden="true"
                >
                  <Truck className="w-5 h-5 stroke-[1.8]" />
                  <span className="w-2 h-2 rounded-full bg-[#FAB31F] absolute top-1.5 right-1.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#08422E] tracking-tight">Entrega em Barcarena</h3>
                  <p className="text-xs text-[#202C27]/75">Agilidade direto na sua porta</p>
                </div>
              </div>

              {/* Benefit 4: Estoque confirmado */}
              <div className="flex items-center gap-3.5 py-2 px-3 sm:px-4 lg:justify-center">
                <div
                  className="w-11 h-11 rounded-2xl bg-[#FDF9F1] border border-[#08422E]/10 text-[#08422E] flex items-center justify-center shrink-0 shadow-sm relative"
                  aria-hidden="true"
                >
                  <CheckCircle2 className="w-5 h-5 stroke-[1.8]" />
                  <span className="w-2 h-2 rounded-full bg-[#FAB31F] absolute top-1.5 right-1.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#08422E] tracking-tight">Estoque confirmado</h3>
                  <p className="text-xs text-[#202C27]/75">Itens validados antes do envio</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================================
            5. CATEGORIES GRID
            Redesigned Category Section:
            - 4 clean, premium category cards with realistic pet photography
            - Categories: Food & Nutrition, Hygiene & Care, Toys, Accessories
            - Official PETOU palette: #08422E, #FAB31F, #FDF9F1, #FFFFFF
           ========================================================================= */}
        <section id="categorias" aria-labelledby="categories-heading" className="py-16 sm:py-20 bg-[#FDF9F1] border-b border-[#08422E]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center sm:text-left mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08422E]/5 border border-[#08422E]/10 text-[#08422E] text-xs font-bold tracking-wide mb-3">
                <span className="w-2 h-2 rounded-full bg-[#FAB31F]" aria-hidden="true" />
                <span>Categorias Selecionadas</span>
              </div>
              <h2 id="categories-heading" className="text-3xl sm:text-4xl font-black text-[#08422E] tracking-tight">
                Encontre o que seu pet precisa
              </h2>
              <p className="text-sm sm:text-base text-[#202C27]/75 mt-2 max-w-xl">
                Navegue pelas principais categorias para encontrar alimentação de qualidade, higiene e acessórios com entrega em Barcarena.
              </p>
            </div>

            {/* 4 Clean Premium Category Cards with Realistic Photography */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Card 1: Food & Nutrition */}
              <Link
                href="/categoria/alimentacao"
                aria-label="Ver categoria Alimentação & Nutrição: Rações balanceadas e petiscos naturais"
                className="group rounded-3xl bg-[#FFFFFF] border border-[#08422E]/10 hover:border-[#08422E]/30 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-[#08422E]"
              >
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#FDF9F1]">
                  <Image
                    src="/category-food.jpg"
                    alt="Alimentação & Nutrição para cães e gatos"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#ffffff00] backdrop-blur-md text-[#08422E] text-[11px] font-bold shadow-sm flex items-center gap-1.5 border border-[#08422E]/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fab51f00]" aria-hidden="true" />
                    <span></span>
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-black text-[#08422E] tracking-tight group-hover:text-[#08422E]">
                      Alimentação & Nutrição
                    </h3>
                    <p className="text-xs sm:text-sm text-[#202C27]/75 mt-2 leading-relaxed">
                      Rações premium balanceadas, alimentos úmidos e petiscos naturais para todas as idades.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#08422E]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#08422E] group-hover:underline">
                      Explorar categoria
                    </span>
                    <span
                      className="w-9 h-9 rounded-full bg-[#FDF9F1] group-hover:bg-[#08422E] text-[#08422E] group-hover:text-[#FFFFFF] border border-[#08422E]/10 flex items-center justify-center transition-all duration-300 shadow-sm"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-4 h-4 text-[#FAB31F] group-hover:text-[#FAB31F] stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card 2: Hygiene & Care */}
              <Link
                href="/categoria/higiene"
                aria-label="Ver categoria Higiene & Cuidados: Shampoos suaves, escovação e bem-estar"
                className="group rounded-3xl bg-[#FFFFFF] border border-[#08422E]/10 hover:border-[#08422E]/30 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-[#08422E]"
              >
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#FDF9F1]">
                  <Image
                    src="/category-hygiene.jpg"
                    alt="Higiene & Cuidados para pets"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#ffffff00] backdrop-blur-md text-[#08422E] text-[11px] font-bold shadow-sm flex items-center gap-1.5 border border-[#08422E]/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fab51f00]" aria-hidden="true" />
                    {/*<span>Hygiene & Care</span>*/}
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-black text-[#08422E] tracking-tight group-hover:text-[#08422E]">
                      Higiene & Cuidados
                    </h3>
                    <p className="text-xs sm:text-sm text-[#202C27]/75 mt-2 leading-relaxed">
                      Shampoos suaves, toalhas, escovação e fórmulas seguras para o banho e saúde da pele.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#08422E]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#08422E] group-hover:underline">
                      Explorar categoria
                    </span>
                    <span
                      className="w-9 h-9 rounded-full bg-[#FDF9F1] group-hover:bg-[#08422E] text-[#08422E] group-hover:text-[#FFFFFF] border border-[#08422E]/10 flex items-center justify-center transition-all duration-300 shadow-sm"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-4 h-4 text-[#FAB31F] group-hover:text-[#FAB31F] stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card 3: Toys */}
              <Link
                href="/categoria/brinquedos"
                aria-label="Ver categoria Brinquedos: Mordedores resistentes e brinquedos interativos"
                className="group rounded-3xl bg-[#FFFFFF] border border-[#08422E]/10 hover:border-[#08422E]/30 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-[#08422E]"
              >
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#FDF9F1]">
                  <Image
                    src="/category-toys.jpg"
                    alt="Brinquedos e mordedores para pets"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#FFFFFF]/95 backdrop-blur-md text-[#08422E] text-[11px] font-bold shadow-sm flex items-center gap-1.5 border border-[#08422E]/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FAB31F]" aria-hidden="true" />
                    <span>Toys</span>
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-black text-[#08422E] tracking-tight group-hover:text-[#08422E]">
                      Brinquedos
                    </h3>
                    <p className="text-xs sm:text-sm text-[#202C27]/75 mt-2 leading-relaxed">
                      Mordedores atóxicos, bolinhas e brinquedos interativos para momentos de gasto de energia e alegria.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#08422E]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#08422E] group-hover:underline">
                      Explorar categoria
                    </span>
                    <span
                      className="w-9 h-9 rounded-full bg-[#FDF9F1] group-hover:bg-[#08422E] text-[#08422E] group-hover:text-[#FFFFFF] border border-[#08422E]/10 flex items-center justify-center transition-all duration-300 shadow-sm"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-4 h-4 text-[#FAB31F] group-hover:text-[#FAB31F] stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>

              {/* Card 4: Accessories */}
              <Link
                href="/categoria/acessorios"
                aria-label="Ver categoria Acessórios: Coleiras confortáveis, guias e peitorais"
                className="group rounded-3xl bg-[#FFFFFF] border border-[#08422E]/10 hover:border-[#08422E]/30 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-[#08422E]"
              >
                <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#FDF9F1]">
                  <Image
                    src="/category-accessories.jpg"
                    alt="Acessórios, coleiras e guias para pets"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#FFFFFF]/95 backdrop-blur-md text-[#08422E] text-[11px] font-bold shadow-sm flex items-center gap-1.5 border border-[#08422E]/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FAB31F]" aria-hidden="true" />
                    <span>Accessories</span>
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-black text-[#08422E] tracking-tight group-hover:text-[#08422E]">
                      Acessórios
                    </h3>
                    <p className="text-xs sm:text-sm text-[#202C27]/75 mt-2 leading-relaxed">
                      Coleiras em couro e tecido, guias reforçadas, peitorais e itens de passeio com ergonomia e segurança.
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#08422E]/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#08422E] group-hover:underline">
                      Explorar categoria
                    </span>
                    <span
                      className="w-9 h-9 rounded-full bg-[#FDF9F1] group-hover:bg-[#08422E] text-[#08422E] group-hover:text-[#FFFFFF] border border-[#08422E]/10 flex items-center justify-center transition-all duration-300 shadow-sm"
                      aria-hidden="true"
                    >
                      <ArrowRight className="w-4 h-4 text-[#FAB31F] group-hover:text-[#FAB31F] stroke-[2.5]" />
                    </span>
                  </div>
                </div>
              </Link>

            </div>

          </div>
        </section>

        {/* =========================================================================
            6. FEATURED PRODUCTS
            Redesigned E-Commerce Product Grid:
            - Official PETOU palette: #08422E, #FAB31F, #FDF9F1, #FFFFFF
            - Clean e-commerce cards with clear product photography
            - High-contrast readable typography and prices
            - Prominent "Adicionar ao carrinho" CTA button
            - Fully responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
           ========================================================================= */}
        <section id="produtos" aria-labelledby="products-heading" className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#08422E]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08422E]/5 border border-[#08422E]/10 text-[#08422E] text-xs font-bold tracking-wide mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#FAB31F]" aria-hidden="true" />
                  <span>Catálogo Selecionado</span>
                </div>
                <h2 id="products-heading" className="text-3xl sm:text-4xl font-black text-[#08422E] tracking-tight">
                  Escolhas para o dia a dia
                </h2>
                <p className="text-sm sm:text-base text-[#202C27]/75 mt-2 max-w-xl">
                  Produtos que aliam qualidade, nutrição balanceada e carinho para a rotina do seu animal de estimação em Barcarena.
                </p>
              </div>

              {/* Category Quick Filter */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap" role="group" aria-label="Filtro rápido por categoria">
                {(["Todos", "Rações para cães", "Rações para gatos", "Petiscos", "Brinquedos", "Higiene", "Acessórios"] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-4 py-2.5 rounded-full font-bold transition min-h-[42px] focus-visible:outline-2 focus-visible:outline-[#08422E] ${selectedCategory === cat
                      ? "bg-[#08422E] text-[#FFFFFF] shadow-sm"
                      : "bg-[#FDF9F1] text-[#202C27] hover:bg-[#FFFFFF] border border-[#08422E]/10"
                      }`}
                    aria-pressed={selectedCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Clean, Premium E-Commerce Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.map((product) => {
                const isItemAdded = addedProductId === product.id;
                const displayPrice =
                  product.price && product.price > 0
                    ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                    : "Consulte o valor";

                return (
                  <article
                    key={product.id}
                    className="group rounded-3xl bg-[#FFFFFF] border border-[#08422E]/10 hover:border-[#08422E]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-sm"
                  >
                    {/* Top Product Image Container */}
                    <div className="relative w-full aspect-[4/3] bg-[#FDF9F1] overflow-hidden flex items-center justify-center p-3 border-b border-[#08422E]/5">
                      {/* Product Image */}
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Brand & Size Badge */}
                      <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#FFFFFF]/95 backdrop-blur-md text-[#08422E] text-[11px] font-bold shadow-sm border border-[#08422E]/10 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FAB31F]" aria-hidden="true" />
                        <span>{product.brand} • {product.size}</span>
                      </span>

                      {/* Distinctive Product Badge (if available) */}
                      {product.badge && (
                        <span className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#FAB31F] text-[#08422E] text-[11px] font-black shadow-sm tracking-wide">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Middle Card Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                      <div>
                        {/* Category & Availability tag */}
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#08422E]/70 uppercase tracking-wider mb-2">
                          <span>{product.category}</span>
                          <span className="text-[10px] text-[#202C27]/60 bg-[#FDF9F1] px-2 py-0.5 rounded-full border border-[#08422E]/10 font-medium">
                            Entrega em Barcarena
                          </span>
                        </div>

                        {/* Product Title */}
                        <Link
                          href={`/produto/${product.id}`}
                          className="block group-hover:text-[#08422E] transition-colors focus-visible:outline-2 focus-visible:outline-[#08422E] rounded"
                        >
                          <h3 className="text-lg sm:text-xl font-black text-[#08422E] leading-snug line-clamp-2 min-h-[3.25rem]">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Product Description */}
                        <p className="text-xs sm:text-sm text-[#202C27]/75 mt-2 line-clamp-2 leading-relaxed">
                          {product.description || "Alimento com formulação completa para a saúde, bem-estar e vitalidade do seu pet."}
                        </p>
                      </div>

                      {/* Price Section */}
                      <div className="pt-4 border-t border-[#08422E]/10 flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#202C27]/50 tracking-wider block">
                            Valor
                          </span>
                          <span className="text-2xl font-black text-[#08422E] tracking-tight">
                            {displayPrice}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#08422E] bg-[#FDF9F1] px-2.5 py-1 rounded-full border border-[#08422E]/10">
                          Estoque confirmado
                        </span>
                      </div>

                      {/* Prominent Action Button */}
                      <div className="pt-2 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          aria-label={`Adicionar ${product.name} ao carrinho`}
                          className={`w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full font-bold text-sm transition-all shadow-md active:scale-95 min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#08422E] ${isItemAdded
                            ? "bg-[#FAB31F] text-[#08422E] shadow-sm"
                            : "bg-[#08422E] hover:bg-[#08422E]/90 text-[#FFFFFF] shadow-[#08422E]/20"
                            }`}
                        >
                          {isItemAdded ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
                              <span>Adicionado ao carrinho!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 text-[#FAB31F]" aria-hidden="true" />
                              <span>Adicionar ao carrinho</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/produto/${product.id}`}
                          className="w-full text-center text-xs font-bold text-[#08422E]/80 hover:text-[#08422E] hover:underline py-1.5 focus-visible:outline-2 focus-visible:outline-[#08422E] rounded flex items-center justify-center gap-1.5"
                        >
                          <span>Ver detalhes do produto</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#FAB31F]" aria-hidden="true" />
                        </Link>
                      </div>

                    </div>
                  </article>
                );
              })}
            </div>

            {/* Empty state if filtered category has 0 items */}
            {featuredProducts.length === 0 && (
              <div className="text-center py-16 px-4 bg-[#FDF9F1] rounded-3xl border border-[#08422E]/10 max-w-md mx-auto my-6 space-y-3">
                <span className="text-4xl" aria-hidden="true">📦</span>
                <h3 className="text-lg font-black text-[#08422E]">Nenhum produto nesta categoria</h3>
                <p className="text-xs text-[#202C27]/75">
                  Tente selecionar outra categoria ou visualizar todos os produtos.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="px-5 py-2.5 rounded-full bg-[#08422E] text-[#FFFFFF] text-xs font-bold hover:bg-[#08422E]/90 transition"
                >
                  Ver todos os produtos
                </button>
              </div>
            )}

            {/* If user filtered, display other matching products or clear button */}
            {selectedCategory !== "Todos" && featuredProducts.length > 0 && (
              <div className="mt-10 pt-6 border-t border-[#08422E]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#202C27]/75">
                <span>
                  Exibindo filtro por <strong className="text-[#08422E]">{selectedCategory}</strong> ({featuredProducts.length} {featuredProducts.length === 1 ? "item" : "itens"})
                </span>
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="text-[#08422E] font-bold underline hover:text-[#FAB31F] p-1 rounded focus-visible:outline-2 focus-visible:outline-[#08422E]"
                >
                  Limpar filtro e ver todo o catálogo
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
