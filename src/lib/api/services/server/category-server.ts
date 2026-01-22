import { fetchClient } from '../../fetch-client';
import type { Category } from '../../types';

export const categoryServerApi = {
    getCategoryById: async (id: string, headers?: Record<string, string>): Promise<Category | null> => {
        try {
            const category = await fetchClient<Category>('/categories/get-category', {
                params: { category_id: id },
                headers,
                throwOnError: false,
                next: { revalidate: 3600 }
            });

            // Handle common error pattern if any (fetchClient already unwraps 'data')
            if (category && 'error' in (category as any)) {
                return null;
            }

            return category;
        } catch (error) {
            console.error('SERVER API Error [categoryServerApi.getCategoryById]:', error);
            return null;
        }
    },
};
