"use client";

import { ArrowRight, Dog, Cat, Utensils, Sparkles } from "lucide-react";
import { COLLECTIONS } from "@/data/products";
import { Category } from "@/data/products";

interface CollectionsProps {
  onSelectCategory: (cat: Category) => void;
}

export default function Collections({ onSelectCategory }: CollectionsProps) {
  const getCollectionVisual = (iconName: string) => {
    switch (iconName) {
      case "dog":
        return {
          icon: <Dog className="w-5 h-5 text-petou-green" />,
          emoji: "🐕",
          bg: "from-amber-100 to-amber-50",
        };
      case "cat":
        return {
          icon: <Cat className="w-5 h-5 text-petou-green" />,
          emoji: "🐈",
          bg: "from-emerald-100 to-emerald-50",
        };
      case "utensils":
        return {
          icon: <Utensils className="w-5 h-5 text-petou-green" />,
          emoji: "🥣",
          bg: "from-orange-100 to-orange-50",
        };
      case "sparkles":
      default:
        return {
          icon: <Sparkles className="w-5 h-5 text-petou-green" />,
          emoji: "🛁",
          bg: "from-teal-100 to-teal-50",
        };
    }
  };

  return (
    <section id="colecoes" className="py-16 sm:py-20 bg-petou-white border-t border-b border-petou-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-petou-green/70">
            Categorias em Destaque
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-petou-green tracking-tight mt-1">
            Coleções Petou
          </h2>
          <p className="text-sm sm:text-base text-petou-green/75 mt-1 max-w-xl">
            Tudo organizado com praticidade para encontrar exatamente o que o seu pet precisa.
          </p>
        </div>

        {/* 4 Collections Cards (Matching Referencia.jpeg layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLLECTIONS.map((col) => {
            const visual = getCollectionVisual(col.iconName);
            return (
              <div
                key={col.id}
                onClick={() => col.categoryFilter && onSelectCategory(col.categoryFilter as Category)}
                className="group cursor-pointer rounded-3xl bg-petou-cream/40 border border-petou-green/10 hover:border-petou-green/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Image / Placeholder Box */}
                <div className={`h-40 bg-gradient-to-tr ${visual.bg} flex items-center justify-center relative p-6`}>
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {visual.emoji}
                  </div>
                  <div className="absolute top-4 left-4 bg-petou-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-petou-green border border-petou-green/10">
                    {col.tag}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-petou-green group-hover:text-petou-green/90 transition">
                      {col.title}
                    </h3>
                    <p className="text-xs text-petou-green/75 mt-1.5 leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 text-xs font-black text-petou-green group-hover:text-petou-yellow transition">
                    <span>Explorar itens</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
