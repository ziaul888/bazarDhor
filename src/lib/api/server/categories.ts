// Server-side API calls for categories (Next.js Server Components)

interface CategoryResponse {
  success: boolean;
  data: {
    data: Array<{
      id: number;
      name: string;
      slug: string;
      icon?: string;
      image?: string;
      description?: string;
      product_count?: number;
      market_count?: number;
      popular?: boolean;
    }>;
    pagination?: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    };
  };
  message?: string;
}

export async function getCategories(limit: number = 10, offset: number = 0) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bazardor.chhagolnaiyasportareana.xyz/api';
    const url = `${baseUrl}/categories/list?limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Revalidate every 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: CategoryResponse = await response.json();
    
    if (!data.success) {
      console.error('API returned unsuccessful response:', data.message);
      return null;
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bazardor.chhagolnaiyasportareana.xyz/api';
    const url = `${baseUrl}/categories/${slug}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}
