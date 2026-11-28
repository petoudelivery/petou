"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import {
  Lock,
  Package,
  MapPin,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Save,
  X,
  Upload,
  LogOut,
  ExternalLink,
  Eye,
  EyeOff,
  ImageIcon,
  RefreshCw,
  Power,
  ShieldAlert,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Neighborhood } from "@/types/store";
import {
  CategoryRow,
  RawProduct,
  ProductInput,
  checkIsAdmin,
  adminFetchCategories,
  adminFetchAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  uploadProductImage,
  deleteProductImage,
  adminUpdateDeliveryFee,
  adminSaveWhatsApp,
} from "@/lib/adminService";
import { fetchDeliveryAreas, fetchWhatsAppNumber } from "@/lib/storeService";

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  brand: string;
  size: string;
  price: string;
  category_id: string;
  active: boolean;
  image_url: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  brand: "",
  size: "",
  price: "",
  category_id: "",
  active: true,
  image_url: "",
};

function productToForm(p: RawProduct): FormState {
  return {
    name: p.name,
    brand: p.brand || "",
    size: p.size || "",
    price: String(p.price),
    category_id: p.category_id || "",
    active: p.active,
    image_url: p.image_url || "",
  };
}

// ─── Shared input class ───────────────────────────────────────────────────────

const INPUT_CLS =
  "w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#08422E]/20 bg-[#FDF9F1]/40 text-[#08422E] placeholder-[#08422E]/40 focus:outline-none focus:ring-2 focus:ring-[#08422E]/30 min-h-[44px]";

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  // Auth
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"products" | "delivery" | "settings">("products");

  // Data
  const [products, setProducts] = useState<RawProduct[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [deliveryAreas, setDeliveryAreas] = useState<Neighborhood[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [dataLoading, setDataLoading] = useState(false);

  // Product form
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<RawProduct | null>(null);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pendingImageDelete, setPendingImageDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick toggle & delete
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Delivery
  const [deliveryFeeInputs, setDeliveryFeeInputs] = useState<Record<string, string>>({});
  const [deliverySaving, setDeliverySaving] = useState<string | null>(null);

  // Settings
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Global feedback
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // ── Auth listener ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setAuthLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) setIsAdmin(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Verify admin role & load data ───────────────────────────────────────────

  const showFeedback = useCallback((type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4500);
  }, []);

  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [prods, cats, areas, wa] = await Promise.all([
        adminFetchAllProducts(),
        adminFetchCategories(),
        fetchDeliveryAreas(),
        fetchWhatsAppNumber(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setDeliveryAreas(areas);
      setWhatsappNumber(wa);
      const feeMap: Record<string, string> = {};
      for (const a of areas) {
        feeMap[a.id] = a.fee !== null ? String(a.fee) : "";
      }
      setDeliveryFeeInputs(feeMap);
    } catch (err: unknown) {
      showFeedback(
        "error",
        err instanceof Error ? err.message : "Erro ao carregar dados do painel."
      );
    } finally {
      setDataLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    checkIsAdmin(session.user.id).then((allowed) => {
      if (cancelled) return;
      setIsAdmin(allowed);
      if (allowed) {
        void loadData();
      }
    });
    return () => {
      cancelled = true;
    };
  }, [session, loadData]);

  // ── Auth handlers ────────────────────────────────────────────────────────────

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setLoginError("Supabase não está configurado.");
      return;
    }
    setLoginError("");
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setLoginError("E-mail ou senha incorretos.");
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  // ── Form helpers ─────────────────────────────────────────────────────────────

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData({
      ...EMPTY_FORM,
      category_id: categories[0]?.id || "",
    });
    setImageFile(null);
    setImagePreview(null);
    setPendingImageDelete(null);
    setSaveError("");
    setShowForm(true);
  };

  const openEditForm = (p: RawProduct) => {
    setEditingProduct(p);
    setFormData(productToForm(p));
    setImageFile(null);
    setImagePreview(null);
    setPendingImageDelete(null);
    setSaveError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setPendingImageDelete(null);
    setSaveError("");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (formData.image_url) setPendingImageDelete(formData.image_url);
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProduct = async () => {
    setSaveError("");
    if (!formData.name.trim()) {
      setSaveError("O nome do produto é obrigatório.");
      return;
    }
    if (!formData.size.trim()) {
      setSaveError("A embalagem / tamanho é obrigatória.");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setSaveError("Informe um preço válido.");
      return;
    }
    if (!formData.category_id) {
      setSaveError("Selecione uma categoria.");
      return;
    }

    setIsSaving(true);
    try {
      let finalImageUrl: string | null = formData.image_url || null;

      const oldImageToDelete =
        imageFile && editingProduct?.image_url
          ? editingProduct.image_url
          : pendingImageDelete;

      if (imageFile) {
        finalImageUrl = await uploadProductImage(imageFile);
      }

      const input: ProductInput = {
        name: formData.name.trim(),
        brand: formData.brand.trim() || "PETOU",
        size: formData.size.trim(),
        price: Number(formData.price),
        category_id: formData.category_id || null,
        image_url: finalImageUrl,
        active: formData.active,
      };

      if (editingProduct) {
        const updated = await adminUpdateProduct(editingProduct.id, input);
        setProducts((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        showFeedback("success", `"${input.name}" atualizado com sucesso.`);
      } else {
        const created = await adminCreateProduct(input);
        setProducts((prev) => [created, ...prev]);
        showFeedback("success", `"${input.name}" criado com sucesso.`);
      }

      if (oldImageToDelete) {
        await deleteProductImage(oldImageToDelete);
      }

      closeForm();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Erro ao salvar produto.";
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (p: RawProduct) => {
    setTogglingId(p.id);
    try {
      const updated = await adminUpdateProduct(p.id, { active: !p.active });
      setProducts((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      showFeedback(
        "success",
        `"${p.name}" ${updated.active ? "ativado" : "desativado"}.`
      );
    } catch (err: unknown) {
      showFeedback(
        "error",
        err instanceof Error ? err.message : "Erro ao alterar status."
      );
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      const p = products.find((x) => x.id === deleteConfirmId);
      await adminDeleteProduct(deleteConfirmId);
      if (p?.image_url) await deleteProductImage(p.image_url);
      setProducts((prev) => prev.filter((item) => item.id !== deleteConfirmId));
      showFeedback("success", "Produto excluído.");
    } catch (err: unknown) {
      showFeedback(
        "error",
        err instanceof Error ? err.message : "Erro ao excluir produto."
      );
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleSaveDeliveryFee = async (id: string) => {
    const feeStr = deliveryFeeInputs[id] ?? "";
    const fee = feeStr.trim() === "" ? null : Number(feeStr);
    if (feeStr.trim() !== "" && isNaN(fee as number)) {
      showFeedback("error", "Valor inválido para a taxa.");
      return;
    }
    setDeliverySaving(id);
    try {
      await adminUpdateDeliveryFee(id, fee);
      setDeliveryAreas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, fee } : a))
      );
      showFeedback("success", "Taxa atualizada.");
    } catch (err: unknown) {
      showFeedback(
        "error",
        err instanceof Error ? err.message : "Erro ao salvar taxa."
      );
    } finally {
      setDeliverySaving(null);
    }
  };

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    try {
      await adminSaveWhatsApp(whatsappNumber.trim());
      showFeedback("success", "Número de WhatsApp salvo.");
    } catch (err: unknown) {
      showFeedback(
        "error",
        err instanceof Error ? err.message : "Erro ao salvar configurações."
      );
    } finally {
      setSettingsSaving(false);
    }
  };

  const getCategoryName = (p: RawProduct) =>
    p.categories?.name ||
    categories.find((c) => c.id === p.category_id)?.name ||
    "Sem categoria";

  // ── Render: Supabase not configured ─────────────────────────────────────────

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#FDF9F1] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-amber-500" size={48} />
          <h1 className="text-xl font-bold text-[#08422E] mb-2">
            Supabase não configurado
          </h1>
          <p className="text-sm text-[#08422E]/70 mb-4">
            Adicione as variáveis de ambiente{" "}
            <code className="bg-[#FDF9F1] px-1 rounded">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{" "}
            e{" "}
            <code className="bg-[#FDF9F1] px-1 rounded">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{" "}
            ao arquivo{" "}
            <code className="bg-[#FDF9F1] px-1 rounded">.env.local</code>.
          </p>
          <Link href="/" className="text-sm text-[#08422E] underline">
            ← Voltar à loja
          </Link>
        </div>
      </div>
    );
  }

  // ── Render: Loading ──────────────────────────────────────────────────────────

  if (authLoading || (session && isAdmin === null)) {
    return (
      <div className="min-h-screen bg-[#FDF9F1] flex items-center justify-center">
        <RefreshCw className="animate-spin text-[#08422E]" size={32} />
      </div>
    );
  }

  // ── Render: Login ────────────────────────────────────────────────────────────

  if (!session) {
    return (
      <div className="min-h-screen bg-[#FDF9F1] flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#08422E] rounded-2xl mb-4">
              <Package size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#08422E]">Petou Admin</h1>
            <p className="text-sm text-[#08422E]/60 mt-1">Acesso restrito</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white rounded-2xl shadow-sm border border-[#08422E]/10 p-7 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#08422E]/70 mb-1.5 uppercase tracking-wide">
                E-mail
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@seudominio.com"
                required
                autoComplete="username"
                className={INPUT_CLS}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#08422E]/70 mb-1.5 uppercase tracking-wide">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className={`${INPUT_CLS} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#08422E]/40 hover:text-[#08422E]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                <AlertCircle size={15} /> {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#08422E] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#08422E]/90 active:scale-[0.98] transition-all disabled:opacity-60 min-h-[44px]"
            >
              {loginLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Lock size={16} />
              )}
              {loginLoading ? "Entrando…" : "Entrar"}
            </button>

            <div className="text-center pt-1">
              <Link
                href="/"
                className="text-xs text-[#08422E]/50 hover:text-[#08422E] transition-colors"
              >
                ← Voltar à loja
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Render: Authenticated but not an authorized admin ───────────────────────

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-[#FDF9F1] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-[#08422E]/10">
          <ShieldAlert className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="text-xl font-bold text-[#08422E] mb-2">
            Acesso não autorizado
          </h1>
          <p className="text-sm text-[#08422E]/70 mb-6">
            A conta{" "}
            <span className="font-semibold text-[#08422E]">
              {session.user.email}
            </span>{" "}
            não possui permissão de administrador.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl border border-[#08422E]/20 text-sm font-medium text-[#08422E] hover:bg-[#FDF9F1]"
            >
              Voltar à loja
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#08422E] text-white text-sm font-semibold hover:bg-[#08422E]/90"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Admin Dashboard ──────────────────────────────────────────────────

  const displayImageSrc = imagePreview || formData.image_url || null;

  return (
    <div className="min-h-screen bg-[#FDF9F1]">
      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            feedback.type === "success"
              ? "bg-[#08422E] text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {feedback.msg}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-7 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <h2 className="text-base font-bold text-[#08422E]">
                Excluir produto?
              </h2>
            </div>
            <p className="text-sm text-[#08422E]/70 mb-6">
              Esta ação não pode ser desfeita. O produto e sua imagem serão
              removidos permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#08422E]/20 text-sm font-medium text-[#08422E] hover:bg-[#FDF9F1] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                {isDeleting ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#08422E] text-white px-5 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={15} />
          </Link>
          <div className="w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2">
            <Package size={18} className="text-[#FAB31F]" />
            <span className="font-bold text-base">Petou Admin</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs bg-green-500/25 text-green-200 px-2 py-0.5 rounded-full border border-green-500/30">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            Supabase conectado
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            <ExternalLink size={13} /> Ver loja
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Nav */}
        <nav className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-[#08422E]/10 mb-6 w-fit">
          {(["products", "delivery", "settings"] as const).map((tab) => {
            const labels = {
              products: "Produtos",
              delivery: "Bairros & Taxas",
              settings: "Configurações",
            };
            const icons = {
              products: <Package size={15} />,
              delivery: <MapPin size={15} />,
              settings: <Settings size={15} />,
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-[#08422E] text-white shadow-sm"
                    : "text-[#08422E]/60 hover:text-[#08422E] hover:bg-[#FDF9F1]"
                }`}
              >
                {icons[tab]} {labels[tab]}
              </button>
            );
          })}
        </nav>

        {/* ── Products Tab ────────────────────────────────────────────────────── */}
        {activeTab === "products" && (
          <div>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#08422E]">Produtos</h2>
                <p className="text-sm text-[#08422E]/60">
                  {products.length} produto{products.length !== 1 ? "s" : ""}{" "}
                  cadastrado{products.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  disabled={dataLoading}
                  className="flex items-center gap-1.5 text-sm text-[#08422E]/60 hover:text-[#08422E] px-3 py-2 rounded-lg hover:bg-[#08422E]/5 transition-colors disabled:opacity-40"
                >
                  <RefreshCw
                    size={14}
                    className={dataLoading ? "animate-spin" : ""}
                  />{" "}
                  Atualizar
                </button>
                <button
                  onClick={openAddForm}
                  className="flex items-center gap-2 bg-[#08422E] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#08422E]/90 transition-all active:scale-95"
                >
                  <Plus size={15} /> Novo produto
                </button>
              </div>
            </div>

            {/* Loading */}
            {dataLoading && (
              <div className="flex items-center justify-center py-20 text-[#08422E]/50">
                <RefreshCw size={24} className="animate-spin mr-3" />{" "}
                Carregando…
              </div>
            )}

            {/* Empty */}
            {!dataLoading && products.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#08422E]/10">
                <Package
                  size={48}
                  className="mx-auto text-[#08422E]/20 mb-4"
                />
                <p className="text-[#08422E]/50 text-sm">
                  Nenhum produto cadastrado ainda.
                </p>
                <button
                  onClick={openAddForm}
                  className="mt-4 text-sm text-[#08422E] font-medium underline underline-offset-2"
                >
                  Criar o primeiro produto
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!dataLoading && products.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-[#08422E]/10 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="relative h-44 bg-[#FDF9F1] flex items-center justify-center">
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <ImageIcon size={36} className="text-[#08422E]/20" />
                      )}
                      {/* Status badge */}
                      <div
                        className={`absolute top-2.5 right-2.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          p.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {p.active ? "Ativo" : "Inativo"}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-xs text-[#08422E]/50 mb-0.5">
                        {getCategoryName(p)}
                      </p>
                      <h3 className="font-semibold text-[#08422E] text-sm leading-tight mb-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-[#08422E]/60 mb-2">
                        {p.brand} · {p.size}
                      </p>
                      <p className="text-base font-bold text-[#08422E]">
                        R$ {Number(p.price).toFixed(2).replace(".", ",")}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex border-t border-[#08422E]/8">
                      <button
                        onClick={() => openEditForm(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm text-[#08422E]/70 hover:text-[#08422E] hover:bg-[#FDF9F1] transition-colors"
                      >
                        <Edit2 size={14} /> Editar
                      </button>
                      <div className="w-px bg-[#08422E]/8" />
                      <button
                        onClick={() => handleToggleActive(p)}
                        disabled={togglingId === p.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm text-[#08422E]/70 hover:text-[#08422E] hover:bg-[#FDF9F1] transition-colors disabled:opacity-50"
                      >
                        <Power size={14} />{" "}
                        {p.active ? "Desativar" : "Ativar"}
                      </button>
                      <div className="w-px bg-[#08422E]/8" />
                      <button
                        onClick={() => setDeleteConfirmId(p.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Delivery Tab ────────────────────────────────────────────────────── */}
        {activeTab === "delivery" && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#08422E]">
                Bairros & Taxas de Entrega
              </h2>
              <p className="text-sm text-[#08422E]/60">
                Deixe em branco para &quot;a confirmar no atendimento&quot;.
              </p>
            </div>

            {dataLoading ? (
              <div className="flex items-center justify-center py-20 text-[#08422E]/50">
                <RefreshCw size={24} className="animate-spin mr-3" />{" "}
                Carregando…
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#08422E]/10 divide-y divide-[#08422E]/8 overflow-hidden shadow-sm">
                {deliveryAreas.map((area) => (
                  <div
                    key={area.id}
                    className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-[#FDF9F1]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin
                        size={15}
                        className="text-[#08422E]/40 shrink-0"
                      />
                      <span className="text-sm font-medium text-[#08422E] truncate">
                        {area.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[#08422E]/50">R$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={deliveryFeeInputs[area.id] ?? ""}
                        onChange={(e) =>
                          setDeliveryFeeInputs((prev) => ({
                            ...prev,
                            [area.id]: e.target.value,
                          }))
                        }
                        placeholder="—"
                        className="w-24 text-sm px-2.5 py-1.5 rounded-lg border border-[#08422E]/20 bg-[#FDF9F1]/40 text-[#08422E] focus:outline-none focus:ring-2 focus:ring-[#08422E]/30 text-right"
                      />
                      <button
                        onClick={() => handleSaveDeliveryFee(area.id)}
                        disabled={deliverySaving === area.id}
                        className="text-xs font-semibold bg-[#08422E] text-white px-3 py-1.5 rounded-lg hover:bg-[#08422E]/90 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {deliverySaving === area.id ? (
                          <RefreshCw size={12} className="animate-spin" />
                        ) : (
                          <Save size={12} />
                        )}
                        Salvar
                      </button>
                    </div>
                  </div>
                ))}
                {deliveryAreas.length === 0 && (
                  <p className="text-center text-sm text-[#08422E]/50 py-10">
                    Nenhuma área de entrega encontrada.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Settings Tab ────────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#08422E]">Configurações</h2>
              <p className="text-sm text-[#08422E]/60">
                Ajustes gerais da loja.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#08422E]/10 shadow-sm p-6 max-w-md space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#08422E]/70 mb-1.5 uppercase tracking-wide">
                  Número de WhatsApp
                </label>
                <p className="text-xs text-[#08422E]/50 mb-2">
                  Somente dígitos, incluindo código do país e DDD. Ex.:
                  5591980762149
                </p>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="5591980762149"
                  className={INPUT_CLS}
                />
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                className="flex items-center gap-2 bg-[#08422E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#08422E]/90 transition-all active:scale-95 disabled:opacity-60"
              >
                {settingsSaving ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {settingsSaving ? "Salvando…" : "Salvar configurações"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Product Form Drawer ──────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-stretch">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={closeForm}
          />

          <div className="w-full max-w-md bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#08422E]/10">
              <h2 className="text-base font-bold text-[#08422E]">
                {editingProduct ? "Editar produto" : "Novo produto"}
              </h2>
              <button
                onClick={closeForm}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FDF9F1] text-[#08422E]/50 hover:text-[#08422E] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Image section */}
              <div>
                <label className="block text-xs font-semibold text-[#08422E]/70 mb-2 uppercase tracking-wide">
                  Imagem do produto
                </label>
                {displayImageSrc ? (
                  <div className="relative h-48 rounded-xl overflow-hidden bg-[#FDF9F1] mb-2">
                    <Image
                      src={displayImageSrc}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="400px"
                      unoptimized={!!imagePreview}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white shadow-sm transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 border-2 border-dashed border-[#08422E]/20 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#08422E]/40 hover:bg-[#FDF9F1]/60 transition-all mb-2"
                  >
                    <ImageIcon size={28} className="text-[#08422E]/30" />
                    <span className="text-xs text-[#08422E]/50">
                      Clique para selecionar imagem
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {!displayImageSrc && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-xs font-medium text-[#08422E] border border-[#08422E]/20 px-3 py-2 rounded-lg hover:bg-[#FDF9F1] transition-colors"
                  >
                    <Upload size={13} /> Selecionar arquivo
                  </button>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#08422E]/70 mb-1.5 uppercase tracking-wide">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Ex.: Ração Dog Chow Adulto"
                  className={INPUT_CLS}
                />
              </div>

              {/* Brand + Size */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#08422E]/70 mb-1.5 uppercase tracking-wide">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, brand: e.target.value }))
                    }
                    placeholder="Ex.: PETOU"
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#08422E]/70 mb-1.5 uppercase tracking-wide">
                    Embalagem *
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, size: e.target.value }))
                    }
                    placeholder="Ex.: 15 kg"
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-[#08422E]/70 mb-1.5 uppercase tracking-wide">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, price: e.target.value }))
                  }
                  placeholder="0,00"
                  className={INPUT_CLS}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-[#08422E]/70 mb-1.5 uppercase tracking-wide">
                  Categoria *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, category_id: e.target.value }))
                  }
                  className={INPUT_CLS}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#08422E]/10 bg-[#FDF9F1]/40">
                <div>
                  <p className="text-sm font-medium text-[#08422E]">
                    Produto ativo
                  </p>
                  <p className="text-xs text-[#08422E]/50">
                    Visível para clientes na loja
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, active: !p.active }))
                  }
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    formData.active ? "bg-[#08422E]" : "bg-[#08422E]/20"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      formData.active ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Error */}
              {saveError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
                  <AlertCircle size={15} className="shrink-0" /> {saveError}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-[#08422E]/10 bg-white">
              <button
                type="button"
                onClick={closeForm}
                className="flex-1 py-3 rounded-xl border border-[#08422E]/20 text-sm font-medium text-[#08422E] hover:bg-[#FDF9F1] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 bg-[#08422E] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#08422E]/90 disabled:opacity-60 transition-all active:scale-[0.98]"
              >
                {isSaving ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                {isSaving
                  ? "Salvando…"
                  : editingProduct
                    ? "Salvar alterações"
                    : "Criar produto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
