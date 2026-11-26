"use client";

import { useState } from "react";
import { Heart, Plus, Check, AlertCircle, ShoppingBag } from "lucide-react";
import { Product } from "@/types/store";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  // Render category-specific visual placeholder
  const renderProductVisual = () => {
    switch (product.iconName) {
      case "dog-bowl":
        return (
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-petou-yellow/20 flex items-center justify-center text-4xl shadow-inner">
              🍲
            </div>
            <span className="mt-2 text-[11px] font-bold text-petou-green/70">
              Cães • Grãos Selecionados
            </span>
          </div>
        );
      case "cat-bowl":
        return (
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-petou-green/15 flex items-center justify-center text-4xl shadow-inner">
              🐟
            </div>
            <span className="mt-2 text-[11px] font-bold text-petou-green/70">
              Gatos • Nutrição Especial
            </span>
          </div>
        );
      case "bone":
        return (
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-petou-yellow/25 flex items-center justify-center text-4xl shadow-inner">
              🦴
            </div>
            <span className="mt-2 text-[11px] font-bold text-petou-green/70">
              Petisco Crocante
            </span>
          </div>
        );
      case "toy":
        return (
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-petou-green/10 flex items-center justify-center text-4xl shadow-inner">
              🎾
            </div>
            <span className="mt-2 text-[11px] font-bold text-petou-green/70">
              Mordedor Anti-estresse
            </span>
          </div>
        );
      case "shampoo":
        return (
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-petou-cream flex items-center justify-center text-4xl shadow-inner border border-petou-green/10">
              🧴
            </div>
            <span className="mt-2 text-[11px] font-bold text-petou-green/70">
              Banho & Cuidado Suave
            </span>
          </div>
        );
      case "collar":
        return (
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-petou-yellow/20 flex items-center justify-center text-4xl shadow-inner">
              🦮
            </div>
            <span className="mt-2 text-[11px] font-bold text-petou-green/70">
              Conforto & Segurança
            </span>
          </div>
        );
      default:
        return <div className="text-4xl">🐾</div>;
    }
  };

  return (
    <div className="group relative bg-petou-white rounded-3xl p-5 border border-petou-green/10 shadow-sm hover:shadow-xl hover:border-petou-green/20 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Bar: Demo Badge & Favorite Button */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-petou-green text-petou-white text-[10px] font-black uppercase tracking-wider">
              DEMO
            </span>
            {product.badge && (
              <span className="px-2.5 py-1 rounded-full bg-petou-yellow/20 text-petou-green text-[10px] font-bold">
                {product.badge}
              </span>
            )}
          </div>

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-8 h-8 rounded-full bg-petou-cream/80 hover:bg-petou-cream flex items-center justify-center transition border border-petou-green/10"
            aria-label="Adicionar aos favoritos"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isFavorite
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-petou-green/60 hover:text-petou-green"
              }`}
            />
          </button>
        </div>

        {/* Product Image / Visual Placeholder */}
        <div className="mt-4 mb-4 h-44 rounded-2xl bg-gradient-to-b from-petou-cream/60 to-petou-cream/20 flex items-center justify-center p-4 border border-petou-green/5 group-hover:scale-[1.02] transition-transform duration-300">
          {renderProductVisual()}
        </div>

        {/* Brand & Category Details */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-petou-green/70 font-semibold">
            <span>{product.brand}</span>
            <span>{product.size}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-petou-green leading-snug line-clamp-1 group-hover:text-petou-green transition">
            {product.name}
          </h3>

          <p className="text-xs text-petou-green/70 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Bottom Area: Stock notice, Price, Add Button */}
      <div className="pt-4 mt-3 border-t border-petou-green/10 space-y-3">
        {/* Required stock warning */}
        <div className="flex items-start gap-1.5 text-[11px] text-petou-green/75 leading-tight">
          <AlertCircle className="w-3.5 h-3.5 text-petou-yellow shrink-0 mt-0.5" />
          <span className="italic">Disponibilidade sujeita à confirmação no atendimento</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-[10px] font-medium text-petou-green/60 uppercase tracking-wider block">
              Preço estimado
            </span>
            <span className="text-xl font-black text-petou-green tracking-tight">
              {product.formattedPrice}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              isAdded
                ? "bg-petou-green text-petou-white scale-105"
                : "bg-petou-yellow hover:bg-petou-yellow/90 text-petou-green hover:scale-105 active:scale-95"
            }`}
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            {isAdded ? (
              <Check className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
