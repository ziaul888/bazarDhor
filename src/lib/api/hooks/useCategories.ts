import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { categoriesApi } from '../services/categories';
import { Category, CategoryListParams } from '../types';
import { useZone } from '@/providers/zone-provider';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: string) => [...categoryKeys.lists(), { filters }] as const,
  listByParams: (params: CategoryListParams) => [...categoryKeys.lists(), 'by-params', params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...categoryKeys.details(), slug] as const,
  popular: () => [...categoryKeys.all, 'popular'] as const,
};

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

// Get categories list with params (client-side only)
export const useCategoryList = (params: CategoryListParams): UseQueryResult<Category[], Error> => {
  const { zone } = useZone();

  return useQuery({
    queryKey: categoryKeys.listByParams(params),
    queryFn: () => categoriesApi.getAll(params),
    enabled: !!zone?.id,
    staleTime: 5 * 60 * 1000,
  });
};

// Get category by slug
export const useCategory = (slug: string): UseQueryResult<Category | null, Error> => {
  const { zone } = useZone();

  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!zone?.id && !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// Get popular categories
export const usePopularCategories = (limit = 10): UseQueryResult<Category[], Error> => {
  const { zone } = useZone();

  return useQuery({
    queryKey: [...categoryKeys.popular(), limit],
    queryFn: () => categoriesApi.getPopular(limit),
    enabled: !!zone?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
