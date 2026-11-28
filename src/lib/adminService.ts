import { supabase } from "./supabase";

export interface CategoryRow {
  id: string;
  name: string;
}

export interface RawProduct {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  category_id: string | null;
  image_url: string | null;
  is_demo: boolean;
  active: boolean;
  created_at: string;
  categories?: { id: string; name: string } | null;
}

export interface ProductInput {
  name: string;
  brand: string;
  size: string;
  price: number;
  category_id: string | null;
  image_url: string | null;
  active: boolean;
}

const PRODUCT_SELECT =
  "id, name, brand, size, price, category_id, image_url, is_demo, active, created_at, categories(id, name)";

function requireClient() {
  if (!supabase) throw new Error("Supabase não configurado");
  return supabase;
}

interface SupabaseErrorLike {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
  status?: number;
}

function toError(error: unknown, fallback: string, responseStatus?: number): Error {
  if (error instanceof Error) return error;
  if (typeof error === "object" && error !== null) {
    const err = error as SupabaseErrorLike;
    const status = err.status ?? responseStatus;
    const parts = [
      err.code ? `[${err.code}]` : null,
      status ? `(HTTP ${status})` : null,
      err.message || fallback,
      err.details ? `— ${err.details}` : null,
      err.hint ? `(Dica: ${err.hint})` : null,
    ].filter(Boolean);
    return new Error(parts.join(" "));
  }
  return new Error(fallback);
}

export async function checkIsAdmin(userId: string): Promise<boolean> {
  const c = requireClient();
  const { data, error } = await c
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return false;
  return Boolean(data?.user_id);
}

export async function adminFetchCategories(): Promise<CategoryRow[]> {
  const c = requireClient();
  const { data, error, status } = await c
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });
  if (error) throw toError(error, "Erro ao carregar categorias.", status);
  return (data as CategoryRow[]) || [];
}

export async function adminFetchAllProducts(): Promise<RawProduct[]> {
  const c = requireClient();
  const { data, error, status } = await c
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw toError(error, "Erro ao carregar produtos.", status);
  return (data as unknown as RawProduct[]) || [];
}

export async function adminCreateProduct(input: ProductInput): Promise<RawProduct> {
  const c = requireClient();
  const { data, error, status } = await c
    .from("products")
    .insert([{ ...input, is_demo: false }])
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw toError(error, "Erro ao criar produto.", status);
  return data as unknown as RawProduct;
}

export async function adminUpdateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<RawProduct> {
  const c = requireClient();
  const { data, error, status } = await c
    .from("products")
    .update(input)
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();
  if (error) throw toError(error, "Erro ao atualizar produto.", status);
  return data as unknown as RawProduct;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const c = requireClient();
  const { error, status } = await c.from("products").delete().eq("id", id);
  if (error) throw toError(error, "Erro ao excluir produto.", status);
}

export async function uploadProductImage(file: File): Promise<string> {
  const c = requireClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await c.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw toError(error, "Erro ao enviar imagem.");
  const { data } = c.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  try {
    const c = requireClient();
    const url = new URL(imageUrl);
    const marker = "/object/public/product-images/";
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return;
    const path = url.pathname.substring(idx + marker.length);
    await c.storage.from("product-images").remove([path]);
  } catch {
    // Non-critical — image cleanup failure should not break the UI
  }
}

export async function adminUpdateDeliveryFee(
  id: string,
  fee: number | null
): Promise<void> {
  const c = requireClient();
  const { error, status } = await c.from("delivery_areas").update({ fee }).eq("id", id);
  if (error) throw toError(error, "Erro ao atualizar taxa.", status);
}

export async function adminSaveWhatsApp(number: string): Promise<void> {
  const c = requireClient();
  const { error, status } = await c
    .from("store_settings")
    .upsert(
      { key: "whatsapp_number", value: number, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  if (error) throw toError(error, "Erro ao salvar WhatsApp.", status);
}
