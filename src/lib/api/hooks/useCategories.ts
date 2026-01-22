import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { categoriesApi } from '../services/categories';
import { Category } from '../types';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
  popular: () => [...categoryKeys.all, 'popular'] as const,
};

import { useZone } from '@/providers/zone-provider';

// Get all categories
export const useCategories = (): UseQueryResult<Category[], Error> => {
  const { zone } = useZone();

  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000,
    enabled: !!zone?.id,
  });
};

// Get category by slug
export const useCategory = (slug: string): UseQueryResult<Category | null, Error> => {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// Get popular categories
export const usePopularCategories = (limit = 10): UseQueryResult<Category[], Error> => {
  return useQuery({
    queryKey: [...categoryKeys.popular(), limit],
    queryFn: () => categoriesApi.getPopular(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};