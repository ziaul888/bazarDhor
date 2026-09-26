import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoints';
import type {
  ActivityTypeFilter,
  BackendApiResponse,
  CreateUserProductPayload,
  FavoriteItem,
  FavoriteType,
  UpdateProfilePayload,
  UserActivity,
  UserActivityPage,
  UserActivityStatistics,
  UserProduct,
  UserProfile,
  SubmitProductPricePayload,
  SubmitProductPriceResponse,
} from '../types';

/**
 * Why: `POST /users/update-profile` accepts an optional `image` file, which Laravel
 * only validates when the request is multipart. Plain JSON is used otherwise so the
 * API keeps its normal (non-File) code path.
 */
const toProfileRequestBody = (payload: UpdateProfilePayload): UpdateProfilePayload | FormData => {
  if (!payload.image) return payload;

  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof File !== 'undefined' && value instanceof File) {
      formData.append(key, value);
      return;
    }
    formData.append(key, String(value));
  });
  return formData;
};

export const userApi = {
  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<BackendApiResponse<UserProfile>>(API_ENDPOINTS.USER.PROFILE);
    return response.data.data;
  },

  // Update current user profile
  updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const response = await apiClient.post<BackendApiResponse<UserProfile>>(
      API_ENDPOINTS.USER.UPDATE_PROFILE,
      toProfileRequestBody(payload)
    );
    return response.data.data;
  },

  // Add a market or product to favorites
  addFavorite: async (type: FavoriteType, favoritableId: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.USER.ADD_FAVORITE, {
      type,
      favoritable_id: favoritableId,
    });
  },

  // Remove a market or product from favorites
  removeFavorite: async (type: FavoriteType, favoritableId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USER.REMOVE_FAVORITE, {
      data: { type, favoritable_id: favoritableId },
    });
  },

  // Get user's favorite markets/products
  getFavorites: async (params?: {
    type?: FavoriteType;
    limit?: number;
    offset?: number;
  }): Promise<FavoriteItem[]> => {
    const response = await apiClient.get<BackendApiResponse<FavoriteItem[]>>(
      API_ENDPOINTS.USER.FAVORITES,
      { params }
    );
    return response.data.data ?? [];
  },

  // Create a product for the current user
  createProduct: async (
    payload: CreateUserProductPayload | FormData
  ): Promise<BackendApiResponse<UserProduct>> => {
    const { data } = await apiClient.post<BackendApiResponse<UserProduct>>(
      '/products/create',
      payload
    );
    return data;
  },

  // Submit a product price update
  submitPrice: async (
    payload: SubmitProductPricePayload | FormData
  ): Promise<BackendApiResponse<SubmitProductPriceResponse>> => {
    const { data } = await apiClient.post<BackendApiResponse<SubmitProductPriceResponse>>(
      '/products/submit-price',
      payload
    );
    return data;
  },

  // Activity statistics — counters for the profile header and Activity tab tiles
  getActivityStatistics: async (): Promise<UserActivityStatistics> => {
    const response = await apiClient.get<BackendApiResponse<UserActivityStatistics>>(
      API_ENDPOINTS.USER.ACTIVITY_STATISTICS
    );
    return response.data.data;
  },

  // Paginated activity timeline. `type: 'all'` is intentionally not sent — the
  // backend treats an omitted `type` as "no filter".
  getActivities: async (params?: {
    page?: number;
    limit?: number;
    type?: ActivityTypeFilter;
  }): Promise<UserActivityPage> => {
    const { type, ...rest } = params ?? {};
    const response = await apiClient.get<BackendApiResponse<UserActivity[]>>(
      API_ENDPOINTS.USER.ACTIVITIES,
      { params: type && type !== 'all' ? { ...rest, type } : rest }
    );
    return {
      items: response.data.data ?? [],
      total: response.data.total_size ?? response.data.data?.length ?? 0,
    };
  },
};
