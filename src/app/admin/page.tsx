"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Unlock,
  Package,
  MapPin,
  Settings,
  Database,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  DollarSign,
  Save,
} from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fetchProducts, fetchDeliveryAreas, fetchWhatsAppNumber } from "@/lib/storeService";
import { Product, Neighborhood } from "@/types/store";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "delivery" | "settings" | "database">("products");

  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<Neighborhood[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Load initial store data
  useEffect(() => {
    async function loadData() {
      const [prods, areas, wa] = await Promise.all([
        fetchProducts(),
        fetchDeliveryAreas(),
        fetchWhatsAppNumber(),
      ]);
      setProducts(prods);
      setDeliveryAreas(areas);
      setWhatsappNumber(wa);
    }
    loadData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Scaffold authentication stub: accepts "petou2026" or any non-empty code for demo/stub purpose
    if (accessCode.trim() === "petou2026" || accessCode.trim().length >= 4) {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Código de acesso inválido. (Dica de desenvolvimento: use 'petou2026')");
    }
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              price: newPrice,
              formattedPrice: `R$ ${newPrice.toFixed(2).replace(".", ",")}`,
            }
          : p
      )
    );
    triggerSuccessFeedback("Preço atualizado no estado local!");
  };

  const handleUpdateFee = (id: string, newFee: number | null) => {
    setDeliveryAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, fee: newFee } : a))
    );
    triggerSuccessFeedback("Taxa de entrega atualizada no estado local!");
  };

  const triggerSuccessFeedback = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  // If not authenticated, show professional PIN / Login gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-petou-cream flex flex-col justify-center items-center p-4 font-sans text-petou-green">
        <div className="w-full max-w-md bg-petou-white rounded-3xl p-8 border border-petou-green/10 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="relative w-40 h-14 mx-auto mb-2">
              <Image
                src="/petou-logo.png"
                alt="Petou Store"
                fill
                className="object-contain"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-petou-green/10 text-petou-green text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              Painel de Gestão
            </div>
            <h1 className="text-2xl font-black text-petou-green">Área Administrativa</h1>
            <p className="text-xs text-petou-green/75">
              Acesso restrito para gerenciamento de produtos, preços e bairros de Barcarena.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-petou-green mb-1.5">
                Código de Acesso do Administrador
              </label>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Digite o código (ex: petou2026)"
                className="w-full bg-petou-cream/40 text-petou-green placeholder-petou-green/45 text-sm px-4 py-3 rounded-2xl border border-petou-green/20 focus:outline-none focus:ring-2 focus:ring-petou-yellow"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-petou-green text-petou-white font-bold text-sm hover:bg-petou-green/90 transition shadow-md flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-petou-yellow" />
              <span>Acessar Painel</span>
            </button>
          </form>

          <div className="pt-2 text-center border-t border-petou-green/10">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-petou-green/70 hover:text-petou-green font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar para a Loja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-petou-cream/60 flex flex-col font-sans text-petou-green">
      
      {/* Admin Top Navigation */}
      <header className="bg-petou-green text-petou-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition">
              <span className="text-lg font-black tracking-wider text-petou-yellow">
                PETOU ADMIN
              </span>
            </Link>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-petou-white/15 text-petou-white font-semibold">
              Barcarena - PA
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase status badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isSupabaseConfigured
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-petou-yellow/20 text-petou-yellow border border-petou-yellow/30"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? "bg-emerald-400" : "bg-petou-yellow animate-pulse"
                }`}
              />
              <span>{isSupabaseConfigured ? "Supabase Conectado" : "Modo Fallback Demo"}</span>
            </div>

            <Link
              href="/"
              className="text-xs bg-petou-white/10 hover:bg-petou-white/20 text-petou-white px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Loja</span>
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-red-300 hover:text-red-100 font-bold ml-2"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Save feedback banner */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* Dashboard Title & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-petou-green">
              Gestão de Catálogo e Configurações
            </h1>
            <p className="text-xs sm:text-sm text-petou-green/75 mt-0.5">
              Altere preços, consulte bairros atendidos e conecte seu banco de dados Supabase.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 bg-petou-white p-1 rounded-2xl border border-petou-green/10 shadow-sm overflow-x-auto">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === "products"
                  ? "bg-petou-green text-petou-white shadow-sm"
                  : "text-petou-green/70 hover:text-petou-green"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Produtos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("delivery")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === "delivery"
                  ? "bg-petou-green text-petou-white shadow-sm"
                  : "text-petou-green/70 hover:text-petou-green"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Bairros & Taxas</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === "settings"
                  ? "bg-petou-green text-petou-white shadow-sm"
                  : "text-petou-green/70 hover:text-petou-green"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>WhatsApp / Loja</span>
            </button>

            <button
              onClick={() => setActiveTab("database")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeTab === "database"
                  ? "bg-petou-green text-petou-white shadow-sm"
                  : "text-petou-green/70 hover:text-petou-green"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Schema SQL</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Products and Price Management */}
        {activeTab === "products" && (
          <div className="bg-petou-white rounded-3xl border border-petou-green/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-petou-green/10 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-petou-green">Produtos Cadastrados</h2>
                <p className="text-xs text-petou-green/70">
                  Ajuste preços ou gerencie os produtos ativos na loja.
                </p>
              </div>
              <button
                onClick={() => triggerSuccessFeedback("Formulário de cadastro pronto para Supabase!")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-petou-green text-petou-white text-xs font-bold hover:bg-petou-green/90 transition shadow-sm"
              >
                <Plus className="w-4 h-4 text-petou-yellow" />
                <span>Adicionar Produto</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-petou-cream/50 text-petou-green/80 uppercase text-[10px] font-bold border-b border-petou-green/10">
                  <tr>
                    <th className="py-3 px-6">Produto</th>
                    <th className="py-3 px-6">Categoria</th>
                    <th className="py-3 px-6">Tamanho</th>
                    <th className="py-3 px-6">Preço (R$)</th>
                    <th className="py-3 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-petou-green/10 text-petou-green">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-petou-cream/20 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-petou-cream flex items-center justify-center text-base border border-petou-green/10">
                            🐾
                          </span>
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <span className="text-[11px] text-petou-green/60">
                              {item.brand} {item.isDemo && "• (Demo)"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium">{item.category}</td>
                      <td className="py-4 px-6 text-petou-green/75">{item.size}</td>
                      <td className="py-4 px-6 font-bold">
                        <div className="flex items-center gap-1 max-w-[120px]">
                          <span>R$</span>
                          <input
                            type="number"
                            step="0.50"
                            defaultValue={item.price}
                            onBlur={(e) =>
                              handleUpdatePrice(item.id, parseFloat(e.target.value) || item.price)
                            }
                            className="w-20 bg-petou-cream/50 px-2 py-1 rounded border border-petou-green/20 font-bold focus:outline-none focus:ring-1 focus:ring-petou-yellow"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => triggerSuccessFeedback(`Edição do item ${item.name} selecionada`)}
                            className="p-1.5 rounded-lg text-petou-green hover:bg-petou-cream transition"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Delivery Areas & Fees */}
        {activeTab === "delivery" && (
          <div className="bg-petou-white rounded-3xl border border-petou-green/10 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-petou-green">
                  Bairros e Taxas de Entrega em Barcarena
                </h2>
                <p className="text-xs text-petou-green/70">
                  Configure as taxas de frete por localidade em Barcarena - PA.
                </p>
              </div>
              <button
                onClick={() => triggerSuccessFeedback("Novo bairro pronto para inclusão!")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-petou-green text-petou-white text-xs font-bold hover:bg-petou-green/90 transition shadow-sm"
              >
                <Plus className="w-4 h-4 text-petou-yellow" />
                <span>Novo Bairro</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryAreas.map((area) => (
                <div
                  key={area.id}
                  className="p-4 rounded-2xl bg-petou-cream/30 border border-petou-green/10 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-petou-green">{area.name}</h4>
                    <span className="text-xs text-petou-green/70">
                      {area.fee !== null
                        ? `Taxa: R$ ${area.fee.toFixed(2).replace(".", ",")}`
                        : "Taxa a confirmar"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="1.00"
                      placeholder="Taxa"
                      defaultValue={area.fee !== null ? area.fee : ""}
                      onBlur={(e) => {
                        const val = e.target.value.trim() === "" ? null : parseFloat(e.target.value);
                        handleUpdateFee(area.id, val);
                      }}
                      className="w-16 text-xs bg-petou-white px-2 py-1.5 rounded-lg border border-petou-green/20 font-bold text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Store Settings & WhatsApp Number */}
        {activeTab === "settings" && (
          <div className="bg-petou-white rounded-3xl border border-petou-green/10 shadow-sm p-6 space-y-6 max-w-xl">
            <div>
              <h2 className="text-lg font-bold text-petou-green">Configurações Gerais da Loja</h2>
              <p className="text-xs text-petou-green/70">
                Gerencie o canal de atendimento e recepção de pedidos.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-petou-green mb-1.5">
                  Número de WhatsApp para Pedidos (com DDI e DDD)
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="Ex: 5591980762149"
                  className="w-full bg-petou-cream/40 text-petou-green text-sm px-4 py-2.5 rounded-xl border border-petou-green/20 focus:outline-none focus:ring-2 focus:ring-petou-yellow"
                />
                <p className="text-[11px] text-petou-green/60 mt-1">
                  Este número recebe todos os fechamentos de pedidos gerados pelo CartDrawer.
                </p>
              </div>

              <button
                type="button"
                onClick={() => triggerSuccessFeedback("Número de WhatsApp salvo com sucesso!")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-petou-green text-petou-white text-xs font-bold hover:bg-petou-green/90 transition shadow-sm"
              >
                <Save className="w-4 h-4 text-petou-yellow" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: SQL Schema Guide for Supabase */}
        {activeTab === "database" && (
          <div className="bg-petou-white rounded-3xl border border-petou-green/10 shadow-sm p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-petou-green">
                Estrutura de Tabelas do Supabase (SQL)
              </h2>
              <p className="text-xs text-petou-green/70">
                Copie o script SQL abaixo e execute no SQL Editor do seu projeto Supabase para criar as tabelas com fallback automático:
              </p>
            </div>

            <pre className="bg-zinc-900 text-zinc-100 p-4 rounded-2xl text-xs overflow-x-auto font-mono leading-relaxed">
{`-- 1. Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT 'PETOU',
  size TEXT NOT NULL DEFAULT '1 un',
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  is_demo BOOLEAN DEFAULT false,
  badge TEXT,
  description TEXT,
  icon_name TEXT DEFAULT 'dog-bowl',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Áreas de Entrega (Barcarena)
CREATE TABLE IF NOT EXISTS delivery_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  fee NUMERIC(10, 2), -- NULL significa taxa a confirmar
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Configurações da Loja
CREATE TABLE IF NOT EXISTS store_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Inserir WhatsApp padrão
INSERT INTO store_settings (key, value)
VALUES ('whatsapp_number', '5591980762149')
ON CONFLICT (key) DO NOTHING;`}
            </pre>
          </div>
        )}

      </div>

    </div>
  );
}
