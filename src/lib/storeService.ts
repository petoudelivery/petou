import { supabase, isSupabaseConfigured } from "./supabase";
import { DEMO_PRODUCTS, CATEGORIES } from "@/data/products";
import { BARCARENA_NEIGHBORHOODS } from "@/data/neighborhoods";
import { Product, Neighborhood } from "@/types/store";

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return DEMO_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEMO_PRODUCTS;
    }

    return data.map((item) => ({
      id: String(item.id),
      name: item.name || "Produto",
      brand: item.brand || "PETOU",
      size: item.size || "1 un",
      price: Number(item.price) || 0,
      formattedPrice: `R$ ${Number(item.price || 0).toFixed(2).replace(".", ",")}`,
      category: item.category || "Rações para cães",
      isDemo: Boolean(item.is_demo),
      badge: item.badge || undefined,
      description: item.description || "",
      iconName: item.icon_name || "dog-bowl",
    }));
  } catch (err) {
    console.error("Erro ao carregar produtos do Supabase:", err);
    return DEMO_PRODUCTS;
  }
}

export async function fetchCategories(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [...CATEGORIES];
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return [...CATEGORIES];
    }

    const custom = data.map((c) => String(c.name));
    return ["Todos", ...custom];
  } catch (err) {
    console.error("Erro ao carregar categorias do Supabase:", err);
    return [...CATEGORIES];
  }
}

export async function fetchDeliveryAreas(): Promise<Neighborhood[]> {
  if (!isSupabaseConfigured || !supabase) {
    return BARCARENA_NEIGHBORHOODS;
  }

  try {
    const { data, error } = await supabase
      .from("delivery_areas")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return BARCARENA_NEIGHBORHOODS;
    }

    return data.map((area) => ({
      id: String(area.id),
      name: area.name,
      fee: area.fee !== null && area.fee !== undefined ? Number(area.fee) : null,
    }));
  } catch (err) {
    console.error("Erro ao carregar áreas de entrega do Supabase:", err);
    return BARCARENA_NEIGHBORHOODS;
  }
}

export async function fetchWhatsAppNumber(): Promise<string> {
  const defaultNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";

  if (!isSupabaseConfigured || !supabase) {
    return defaultNumber;
  }

  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("value")
      .eq("key", "whatsapp_number")
      .maybeSingle();

    if (error || !data?.value) {
      return defaultNumber;
    }

    return String(data.value);
  } catch (err) {
    console.error("Erro ao carregar número de WhatsApp do Supabase:", err);
    return defaultNumber;
  }
}
