export type PromotionCategory = "flash" | "weekend" | "international" | "promo";

export interface Promotion {
  id: string;
  title: string;
  sale_price: number;
  original_price: number;
  category: PromotionCategory;
  valid_until: string;
  image_url?: string;
  destination_code: string;
  destination_city: string;
  created_at?: string;
}

export interface CreatePromotionPayload {
  title: string;
  sale_price: number;
  original_price: number;
  category: PromotionCategory;
  valid_until: string;
  image_url?: string;
  destination_code: string;
  destination_city: string;
}
