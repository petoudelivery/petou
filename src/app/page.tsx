"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Collections from "@/components/Collections";
import Benefits from "@/components/Benefits";
import NewsletterWhatsApp from "@/components/NewsletterWhatsApp";
import Footer from "@/components/Footer";
import { DEMO_PRODUCTS, Category } from "@/data/products";
import { fetchProducts } from "@/lib/storeService";
import { Product } from "@/types/store";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="min-h-screen flex flex-col bg-petou-cream text-petou-green font-sans">
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        <Hero
          onSearch={setSearchQuery}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        <ProductGrid
          products={products}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          onClearFilter={handleClearFilter}
        />

        <Collections onSelectCategory={handleSelectCategory} />

        <Benefits />

        <NewsletterWhatsApp />
      </main>

      <Footer />
    </div>
  );
}
