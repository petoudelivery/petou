import { supabase } from "./supabase";

export interface RawProduct {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  category: string;
  is_demo: boolean;
  badge: string | null;
  description: string | null;
  icon_name: string;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
}

export interface ProductInput {
  name: string;
  brand: string;
  size: string;
  price: number;
  category: string;
  description: string;
  badge: string | null;
  icon_name: string;
  is_active: boolean;
  image_url: string | null;
}

function requireClient() {
  if (!supabase) throw new Error("Supabase não configurado");
  return supabase;
}

export async function adminFetchAllProducts(): Promise<RawProduct[]> {
  const c = requireClient();
  const { data, error } = await c
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as RawProduct[]) || [];
}

export async function adminCreateProduct(input: ProductInput): Promise<RawProduct> {
  const c = requireClient();
  const { data, error } = await c
    .from("products")
    .insert([{ ...input, is_demo: false }])
    .select()
    .single();
  if (error) throw error;
  return data as RawProduct;
}

export async function adminUpdateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<RawProduct> {
  const c = requireClient();
  const { data, error } = await c
    .from("products")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as RawProduct;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const c = requireClient();
  const { error } = await c.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductImage(file: File): Promise<string> {
  const c = requireClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await c.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
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
  const { error } = await c.from("delivery_areas").update({ fee }).eq("id", id);
  if (error) throw error;
}

export async function adminSaveWhatsApp(number: string): Promise<void> {
  const c = requireClient();
  const { error } = await c
    .from("store_settings")
    .upsert(
      { key: "whatsapp_number", value: number, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
  if (error) throw error;
}
