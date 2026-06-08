export type BadgeType = "hot" | "limited" | "new" | "flash" | "weekend" | "promo";

export interface Promotion {
  id: string;
  title: string;
  sale_price: number;
  original_price: number;
  discount_text?: string | null;
  badge_text?: string | null;
  badge_type?: BadgeType | null;
  valid_until: string;
  image_url?: string | null;
  destination_code?: string | null;
  destination_city?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromotionPayload {
  title: string;
  sale_price: number;
  original_price: number;
  discount_text?: string;
  badge_text?: string;
  badge_type?: BadgeType;
  valid_until: string;
  image_url?: string;
  destination_code?: string;
  destination_city?: string;
}