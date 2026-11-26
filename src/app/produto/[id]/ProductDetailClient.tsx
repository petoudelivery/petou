"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchProductById, fetchProducts } from "@/lib/storeService";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";
import {
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  Check,
  MessageCircle,
  Truck,
  ShieldCheck,
  Home as HomeIcon,
  Clock,
} from "lucide-react";

interface ProductDetailClientProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailClient({ params }: ProductDetailClientProps) {
  const resolved = use(params);
  const id = resolved.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  const { addToCart, openCart } = useCart();

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prod, all] = await Promise.all([
          fetchProductById(id),
          fetchProducts(),
        ]);
        setProduct(prod);
        if (prod) {
          const related = all.filter(
            (p) => p.id !== prod.id && p.category === prod.category
          );
          setRelatedProducts(related.slice(0, 3));
        }
      } catch (e) {
        console.error("Erro ao carregar detalhes do produto:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAdded(true);
    setLiveMessage(`${quantity}x ${product.name} adicionado ao carrinho com sucesso.`);
    setTimeout(() => {
      setIsAdded(false);
      openCart();
    }, 400);
  };

  const displayPrice =
    product?.price && product.price > 0
      ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
      : "Consulte o valor";

  const singleItemWhatsAppUrl = product
    ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
        `Olá, equipe PETOU! Gostaria de consultar a disponibilidade em estoque para o item: *${product.name}* (${product.size}) - ${displayPrice} para entrega em Barcarena.`
      )}`
    : "#";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
        <Header
          selectedCategory="Todos"
          onSelectCategory={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
        />
        <main className="flex-1 py-20 flex flex-col items-center justify-center">
          <div
            role="status"
            aria-label="Carregando produto"
            className="flex flex-col items-center space-y-3"
          >
            <div className="w-10 h-10 border-4 border-[#174C3C] border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <p className="text-xs font-bold text-[#66716A]">Carregando detalhes do produto...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F2]">
        <Header
          selectedCategory="Todos"
          onSelectCategory={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
        />
        <main className="flex-1 py-20 px-4">
          <div className="max-w-md mx-auto bg-[#FFFFFF] rounded-3xl p-10 text-center border border-[#E8EFE5] space-y-4">
            <span className="text-5xl" aria-hidden="true">📦</span>
            <h1 className="text-xl font-bold text-[#174C3C]">Produto não encontrado</h1>
            <p className="text-xs text-[#202C27]/85">
              O item solicitado não está mais disponível ou o link pode ter sido alterado.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 rounded-full bg-[#174C3C] text-[#FFFFFF] text-xs font-bold shadow-sm min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
            >
              Voltar ao catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#202C27] font-sans antialiased">
      <Header
        selectedCategory="Todos"
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
      />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Screen Reader Live Announcements */}
          <div role="status" aria-live="polite" className="sr-only">
            {liveMessage}
          </div>

          {/* Breadcrumbs */}
          <nav aria-label="Trilha de navegação" className="flex items-center gap-2 text-xs text-[#202C27]/80 flex-wrap">
            <Link href="/" className="hover:text-[#174C3C] flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
              <HomeIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Início</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-[#66716A]" aria-hidden="true" />
            <Link
              href={`/categoria/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-[#174C3C] focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3 text-[#66716A]" aria-hidden="true" />
            <span className="font-bold text-[#174C3C] truncate max-w-[200px] sm:max-w-none" aria-current="page">
              {product.name}
            </span>
          </nav>

          {/* Product Hero Layout */}
          <section aria-labelledby="product-title" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Product Image / Visual display */}
            <div className="lg:col-span-6 bg-[#FFFFFF] rounded-[2.5rem] p-8 sm:p-12 border border-[#E8EFE5] shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E8EFE5] text-[#174C3C] text-xs font-bold">
                  {product.brand}
                </span>
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-[#F47C49]/15 text-[#F47C49] text-xs font-bold">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Main Visual Slot */}
              <div
                className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl bg-[#FAF8F2] flex items-center justify-center text-7xl sm:text-8xl my-6 shadow-inner border border-[#E8EFE5]"
                role="img"
                aria-label={`Imagem ilustrativa do produto ${product.name}`}
              >
                {product.iconName === "dog-bowl" && "🍲"}
                {product.iconName === "cat-bowl" && "🐟"}
                {product.iconName === "bone" && "🦴"}
                {product.iconName === "toy" && "🎾"}
                {product.iconName === "shampoo" && "🧴"}
                {product.iconName === "collar" && "🦮"}
              </div>

              <div className="w-full pt-4 border-t border-[#E8EFE5] flex items-center justify-between text-xs text-[#202C27]/85">
                <span className="flex items-center gap-1.5 font-semibold text-[#174C3C]">
                  <Truck className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                  Entrega local em Barcarena
                </span>
                <span className="font-bold text-[#66716A]">Tamanho: {product.size}</span>
              </div>
            </div>

            {/* Right: Info, Price, Quantity and Checkout CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78916D]">
                  {product.category}
                </span>
                <h1 id="product-title" className="text-2xl sm:text-4xl font-black text-[#174C3C] tracking-tight mt-1 leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs text-[#202C27]/85 mt-1 font-semibold">
                  Marca: <span className="text-[#174C3C]">{product.brand}</span> | Embalagem: {product.size}
                </p>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8EFE5] shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#66716A] uppercase tracking-wider block">
                    Valor unitário
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#174C3C]">
                    {displayPrice}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8EFE5] text-[#174C3C] text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#78916D]" aria-hidden="true" />
                  <span>Disponibilidade sob consulta</span>
                </div>
              </div>

              {/* Description & Specifications */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#174C3C]">
                  Descrição & Detalhes
                </h2>
                <p className="text-sm text-[#202C27]/85 leading-relaxed">
                  {product.description ||
                    "Produto elaborado com ingredientes e matérias-primas de alta qualidade para proporcionar vitalidade, conforto e alegria ao seu animal de estimação."}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E8EFE5]">
                    <span className="text-[#66716A] block">Indicado para:</span>
                    <strong className="text-[#174C3C]">{product.category}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E8EFE5]">
                    <span className="text-[#66716A] block">Volume / Porte:</span>
                    <strong className="text-[#174C3C]">{product.size}</strong>
                  </div>
                </div>
              </div>

              {/* Quantity selector & Add to cart button */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span id="qty-label" className="text-xs font-bold text-[#174C3C]">Quantidade:</span>
                  <div className="inline-flex items-center bg-[#FFFFFF] rounded-2xl border border-[#E8EFE5] p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      aria-label={`Diminuir quantidade de ${product.name}`}
                      aria-labelledby="qty-label"
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-[#174C3C] hover:bg-[#E8EFE5] transition font-bold focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-[#174C3C]" aria-live="polite">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      aria-label={`Aumentar quantidade de ${product.name}`}
                      aria-labelledby="qty-label"
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-[#174C3C] hover:bg-[#E8EFE5] transition font-bold focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    aria-label={`Adicionar ${quantity} unidade(s) de ${product.name} ao carrinho`}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-sm transition-all shadow-md min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#174C3C] ${
                      isAdded
                        ? "bg-[#78916D] text-[#FFFFFF]"
                        : "bg-[#174C3C] hover:bg-[#174C3C]/90 text-[#FFFFFF] active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                        <span>Adicionado com sucesso!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                        <span>Adicionar ao carrinho</span>
                      </>
                    )}
                  </button>

                  <a
                    href={singleItemWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Consultar disponibilidade de ${product.name} via WhatsApp`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-[#FFFFFF] text-[#174C3C] border border-[#E8EFE5] font-bold text-sm hover:bg-[#E8EFE5] transition text-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                  >
                    <MessageCircle className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                    <span>Perguntar no WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Delivery Assurance */}
              <div className="p-4 rounded-2xl bg-[#E8EFE5]/50 border border-[#78916D]/20 space-y-2 text-xs text-[#174C3C]">
                <div className="flex items-center gap-2 font-bold">
                  <Clock className="w-4 h-4 text-[#78916D]" aria-hidden="true" />
                  <span>Entrega em Barcarena com conferência de estoque</span>
                </div>
                <p className="text-[11px] text-[#202C27]/80 leading-relaxed">
                  Os pedidos são confirmados com a nossa equipe pelo WhatsApp antes do envio. Pagamento facilitado via Pix na confirmação ou cartão/dinheiro na entrega.
                </p>
              </div>
            </div>
          </section>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <section aria-labelledby="related-heading" className="pt-12 border-t border-[#E8EFE5] space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78916D]">
                  Você também pode gostar
                </span>
                <h2 id="related-heading" className="text-2xl sm:text-3xl font-black text-[#174C3C] tracking-tight mt-0.5">
                  Produtos Relacionados
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/produto/${rel.id}`}
                    aria-label={`Ver detalhes de ${rel.name}`}
                    className="group bg-[#FFFFFF] rounded-3xl p-5 border border-[#E8EFE5] hover:border-[#78916D]/30 hover:shadow-lg transition-all flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                  >
                    <div>
                      <div className="h-36 rounded-2xl bg-[#FAF8F2] flex items-center justify-center text-4xl group-hover:scale-105 transition" aria-hidden="true">
                        {rel.iconName === "dog-bowl" && "🍲"}
                        {rel.iconName === "cat-bowl" && "🐟"}
                        {rel.iconName === "bone" && "🦴"}
                        {rel.iconName === "toy" && "🎾"}
                        {rel.iconName === "shampoo" && "🧴"}
                        {rel.iconName === "collar" && "🦮"}
                      </div>
                      <span className="text-[10px] uppercase font-bold text-[#78916D] block mt-3">
                        {rel.brand} • {rel.size}
                      </span>
                      <h3 className="text-sm font-bold text-[#174C3C] line-clamp-1 mt-0.5 group-hover:text-[#78916D]">
                        {rel.name}
                      </h3>
                    </div>

                    <div className="pt-3 mt-3 border-t border-[#E8EFE5] flex items-center justify-between">
                      <span className="text-sm font-black text-[#174C3C]">
                        {rel.formattedPrice}
                      </span>
                      <span className="text-xs font-bold text-[#174C3C] group-hover:translate-x-1 transition-transform">
                        Ver detalhes →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
