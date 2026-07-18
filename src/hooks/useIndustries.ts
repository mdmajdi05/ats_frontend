'use client';
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/api-client';
import type { Industry, ApiResponse } from '@/types';

export const industryKeys = {
  all:    ['industries'] as const,
  list:   () => ['industries', 'list'] as const,
  detail: (slug: string) => ['industries', 'detail', slug] as const,
};

export function useIndustries() {
  return useQuery<{ success: boolean; data: Industry[] }, Error>({
    queryKey: industryKeys.list(),
    queryFn:  () => request('/industries'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useIndustry(slug: string) {
  return useQuery<ApiResponse<Industry>, Error>({
    queryKey: industryKeys.detail(slug),
    queryFn:  () => request(`/industries/${slug}`),
    enabled:  !!slug,
  });
}
