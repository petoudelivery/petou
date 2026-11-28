export interface Product {
  id: string;
  name: string;
  brand: string;
  size: string;
  price: number;
  formattedPrice: string;
  category: string;
  categoryId?: string;
  isDemo?: boolean;
  badge?: string;
  description?: string;
  iconName: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Neighborhood {
  id: string;
  name: string;
  fee: number | null; // null represents "a confirmar no atendimento"
}

export type PaymentMethod = "Pix" | "Dinheiro" | "Cartão";

export interface CheckoutFormData {
  fullName: string;
  streetAddress: string;
  neighborhoodId: string;
  paymentMethod: PaymentMethod;
  cashChangeFor?: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  description: string;
  categoryFilter?: string;
  tag: string;
  iconName: "dog" | "cat" | "utensils" | "sparkles";
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName: "zap" | "message-circle" | "truck" | "shield-check";
}
