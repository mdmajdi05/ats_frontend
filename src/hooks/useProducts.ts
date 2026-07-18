'use client';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductById, type ProductFilters } from '@/services/productService';
import type { Product, PaginatedResponse, ApiResponse } from '@/types';

export const productKeys = {
  all:    ['products'] as const,
  lists:  (filters?: ProductFilters) => ['products', 'list', filters] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};

export function useProducts(filters?: ProductFilters) {
  return useQuery<PaginatedResponse<Product>, Error>({
    queryKey: productKeys.lists(filters),
    queryFn:  () => getProducts(filters),
  });
}

export function useProduct(id: string) {
  return useQuery<ApiResponse<Product>, Error>({
    queryKey: productKeys.detail(id),
    queryFn:  () => getProductById(id),
    enabled:  !!id,
  });
}
