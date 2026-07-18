'use client';
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/api-client';
import type { FsgCategory, NavCategoryTree } from '@/types';

export const categoryKeys = {
  all:         ['categories'] as const,
  list:        () => ['categories', 'list'] as const,
  navTree:     () => ['categories', 'navTree'] as const,
};

export function useCategories() {
  return useQuery<{ success: boolean; data: FsgCategory[] }, Error>({
    queryKey: categoryKeys.list(),
    queryFn:  () => request('/categories'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNavCategories() {
  return useQuery<{ success: boolean; data: NavCategoryTree }, Error>({
    queryKey: categoryKeys.navTree(),
    queryFn:  () => request('/nav-categories'),
    staleTime: 5 * 60 * 1000,
  });
}
