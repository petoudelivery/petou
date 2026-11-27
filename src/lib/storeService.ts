import { supabase, isSupabaseConfigured } from "./supabase";
import { DEMO_PRODUCTS, CATEGORIES } from "@/data/products";
import { BARCARENA_NEIGHBORHOODS } from "@/data/neighborhoods";
import { Product, Neighborhood } from "@/types/store";

export const CATEGORY_SLUG_MAP: Record<string, string> = {
  caes: "Rações para cães",
  gatos: "Rações para gatos",
  alimentacao: "Petiscos",
  higiene: "Higiene",
  acessorios: "Acessórios",
};

export function slugToCategoryName(slug: string): string {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  if (CATEGORY_SLUG_MAP[normalized]) {
    return CATEGORY_SLUG_MAP[normalized];
  }
  // Try matching directly
  const found = CATEGORIES.find(
    (c) => c.toLowerCase().replace(/\s+/g, "-") === normalized
  );
  return found || decodeURIComponent(slug);
}

export function categoryNameToSlug(name: string): string {
  for (const [slug, catName] of Object.entries(CATEGORY_SLUG_MAP)) {
    if (catName.toLowerCase() === name.toLowerCase()) {
      return slug;
    }
  }
  return name.toLowerCase().replace(/\s+/g, "-");
}

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
      imageUrl: item.image_url || undefined,
    }));
  } catch (err) {
    console.error("Erro ao carregar produtos do Supabase:", err);
    return DEMO_PRODUCTS;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const allProducts = await fetchProducts();
  const found = allProducts.find((p) => p.id === id);
  if (found) return found;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (data && !error) {
        return {
          id: String(data.id),
          name: data.name || "Produto",
          brand: data.brand || "PETOU",
          size: data.size || "1 un",
          price: Number(data.price) || 0,
          formattedPrice: `R$ ${Number(data.price || 0).toFixed(2).replace(".", ",")}`,
          category: data.category || "Rações para cães",
          isDemo: Boolean(data.is_demo),
          badge: data.badge || undefined,
          description: data.description || "",
          iconName: data.icon_name || "dog-bowl",
          imageUrl: data.image_url || undefined,
        };
      }
    } catch (e) {
      console.error("Erro ao buscar produto por ID:", e);
    }
  }

  return null;
}

export async function fetchProductsByCategory(categoryNameOrSlug: string): Promise<Product[]> {
  const categoryName = slugToCategoryName(categoryNameOrSlug);
  const products = await fetchProducts();
  return products.filter(
    (p) =>
      p.category.toLowerCase() === categoryName.toLowerCase() ||
      categoryNameToSlug(p.category) === categoryNameOrSlug.toLowerCase()
  );
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
