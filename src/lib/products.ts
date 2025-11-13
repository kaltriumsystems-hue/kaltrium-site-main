export type ProductKey = "refine_basic" | "refine_standard" | "refine_pro";

export interface Product {
  name: string;
  description: string;
  active: boolean;
  stripePriceEnv: string; // имя переменной окружения для Stripe price
}

export const PRODUCTS: Record<ProductKey, Product> = {
  refine_basic: {
    name: "Refine Editor – Basic",
    description: "One-time edit for a single text up to 1,500 words.",
    active: true,
    stripePriceEnv: "STRIPE_PRICE_REFINE_BASIC",
  },
  refine_standard: {
    name: "Refine Editor – Standard",
    description: "Edit for texts up to 3,000 words.",
    active: true,
    stripePriceEnv: "STRIPE_PRICE_REFINE_STANDARD",
  },
  refine_pro: {
    name: "Refine Editor – Pro",
    description: "Edit for texts up to 5,000 words.",
    active: true,
    stripePriceEnv: "STRIPE_PRICE_REFINE_PRO",
  },
};
