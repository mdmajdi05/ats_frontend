import type {
  Product, Category, Industry, Testimonial, User,
} from '@/types';

import productsJson from '@/data/products/products.json';
import categoriesJson from '@/data/categories/categories.json';
import industriesJson from '@/data/industries/industries.json';
import usersJson from '@/data/users/users.json';
import testimonialsJson from '@/data/testimonials/testimonials.json';

export const FALLBACK_PRODUCTS: Product[] = productsJson as Product[];

export const FALLBACK_CATEGORIES: Category[] = (categoriesJson as { fsgCategories?: Category[] }).fsgCategories as Category[];

export const FALLBACK_INDUSTRIES: Industry[] = industriesJson as Industry[];

export const FALLBACK_USERS: User[] = usersJson as unknown as User[];

export const FALLBACK_TESTIMONIALS: Testimonial[] = testimonialsJson as unknown as Testimonial[];
