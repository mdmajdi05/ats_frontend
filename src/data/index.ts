import type {
  Product, Category,
} from '@/types';

// ─── Single source of truth ─────────────────────────────────
// Ye barrel saare datasets ka ek hi import point hai. Har domain
// apne subfolder me rehta hai (products/, categories/, industries/,
// blog/, users/, testimonials/). Chhote files statically export hote
// hain; bade JSON (products/categories) lazy loaders ke through aate
// hain taaki initial bundle me inline na ho.

// ─── Static datasets (chhote, safe to bundle) ───────────────
export { default as siteCategoriesData } from './categories/site-categories.json';
export { default as industriesData } from './industries/industries.json';
export { default as blogPostsData } from './blog/posts.json';
export { default as blogCategoriesData } from './blog/categories.json';
export { default as blogTagsData } from './blog/tags.json';
export { default as usersData } from './users/users.json';
export { default as testimonialsData } from './testimonials/testimonials.json';

// ─── Lazy loaders (bade JSON — on-demand hi chahiye) ─────────
export async function loadProducts(): Promise<Product[]> {
  const mod = await import('./products/products.json');
  return mod.default as unknown as Product[];
}

export type CategoriesFile = {
  fsgCategories: Category[];
  productCategories?: Record<string, unknown>[];
  partCategories?: Record<string, unknown>[];
  industries?: Array<{ slug: string }>;
};

export async function loadCategories(): Promise<CategoriesFile> {
  const mod = await import('./categories/categories.json');
  return mod.default as CategoriesFile;
}

export type SiteCategory = {
  id: string;
  name: string;
  slug: string;
  group: string;
  description: string;
  partCount: number;
  image: string;
  icon: string;
  features?: string[];
};
