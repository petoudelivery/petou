import { supabase, isSupabaseConfigured } from "./supabase";
import { DEMO_PRODUCTS, CATEGORIES } from "@/data/products";
import { BARCARENA_NEIGHBORHOODS } from "@/data/neighborhoods";
import { Product, Neighborhood } from "@/types/store";

export const CATEGORY_SLUG_MAP: Record<string, string> = {
  caes: "Rações para cães",
  gatos: "Rações para gatos",
  alimentacao: "Petiscos",
  brinquedos: "Brinquedos",
  higiene: "Higiene",
  acessorios: "Acessórios",
};

const STOREFRONT_PRODUCT_SELECT =
  "id, name, brand, size, price, category_id, image_url, is_demo, active, categories(name)";

interface DbProductRow {
  id: string;
  name: string;
  brand: string | null;
  size: string | null;
  price: number | string;
  category_id: string | null;
  image_url: string | null;
  is_demo: boolean | null;
  active: boolean | null;
  categories?: { name: string } | { name: string }[] | null;
}

function deriveIconName(categoryName: string): string {
  const normalized = categoryName.toLowerCase();
  if (normalized.includes("gato")) return "cat-bowl";
  if (normalized.includes("petisco")) return "bone";
  if (normalized.includes("brinquedo")) return "toy";
  if (normalized.includes("higiene")) return "shampoo";
  if (normalized.includes("acess")) return "collar";
  return "dog-bowl";
}

function extractCategoryName(
  categories: DbProductRow["categories"]
): string {
  if (!categories) return "Rações para cães";
  if (Array.isArray(categories)) {
    return categories[0]?.name || "Rações para cães";
  }
  return categories.name || "Rações para cães";
}

function mapDbProduct(item: DbProductRow): Product {
  const price = Number(item.price) || 0;
  const categoryName = extractCategoryName(item.categories);

  return {
    id: String(item.id),
    name: item.name || "Produto",
    brand: item.brand || "Petou",
    size: item.size || "1 un",
    price,
    formattedPrice: `R$ ${price.toFixed(2).replace(".", ",")}`,
    category: categoryName,
    categoryId: item.category_id || undefined,
    isDemo: Boolean(item.is_demo),
    iconName: deriveIconName(categoryName),
    imageUrl: item.image_url || undefined,
  };
}

export function slugToCategoryName(slug: string): string {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  if (CATEGORY_SLUG_MAP[normalized]) {
    return CATEGORY_SLUG_MAP[normalized];
  }
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
      .select(STOREFRONT_PRODUCT_SELECT)
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return DEMO_PRODUCTS;
    }

    return (data as unknown as DbProductRow[]).map(mapDbProduct);
  } catch (err) {
    console.error("Erro ao carregar produtos do Supabase:", err);
    return DEMO_PRODUCTS;
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(STOREFRONT_PRODUCT_SELECT)
        .eq("id", id)
        .eq("active", true)
        .maybeSingle();

      if (data && !error) {
        return mapDbProduct(data as unknown as DbProductRow);
      }
    } catch (e) {
      console.error("Erro ao buscar produto por ID:", e);
    }
  }

  return DEMO_PRODUCTS.find((p) => p.id === id) || null;
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
      .select("id, name, fee")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return BARCARENA_NEIGHBORHOODS;
    }

    const mapped = data.map((area) => ({
      id: String(area.id),
      name: String(area.name),
      fee: area.fee !== null && area.fee !== undefined ? Number(area.fee) : null,
    }));

    // Keep "Centro (Barcarena-Sede)" first and "Outro (...)" last
    return mapped.sort((a, b) => {
      const aIsOutro = a.name.toLowerCase().startsWith("outro");
      const bIsOutro = b.name.toLowerCase().startsWith("outro");
      if (aIsOutro !== bIsOutro) return aIsOutro ? 1 : -1;

      const aIsCentro = a.name.toLowerCase().startsWith("centro");
      const bIsCentro = b.name.toLowerCase().startsWith("centro");
      if (aIsCentro !== bIsCentro) return aIsCentro ? -1 : 1;

      return a.name.localeCompare(b.name, "pt-BR");
    });
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
