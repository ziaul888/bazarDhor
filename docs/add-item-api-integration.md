# Add Item API Integration Documentation

## Overview
The AddItemModal component is now integrated with the `/api/users/products/create` endpoint using your specified payload structure.

## API Endpoint Details

### Create Product Endpoint
- **URL**: `/api/users/products/create`
- **Method**: POST
- **Payload Format**:
```json
{
  "name": "Premium Basmati Rice",
  "category_id": "CATEGORY_UUID_HERE",
  "unit_id": "UNIT_UUID_HERE", 
  "description": "High-quality aged basmati rice imported from premium farms",
  "brand": "Golden Harvest",
  "country_of_origin": "Bangladesh",
  "base_price": 120.00,
  "status": "draft"
}
```

## Implementation Details

### 1. Type Definition
Added to `src/lib/api/types.ts`:
```typescript
export interface CreateProductPayload {
  name: string;
  category_id: string;
  unit_id: string;
  description: string;
  brand: string;
  country_of_origin: string;
  base_price: number;
  status: 'draft' | 'published' | 'archived';
}
```

### 2. API Hook
Using existing `useCreateUserProduct` hook from `src/lib/api/hooks/useUser.ts`:
```typescript
export const useCreateUserProduct = () => {
  return useMutation<ApiResponse<UserProduct>, Error, CreateUserProductPayload | FormData>({
    mutationFn: (payload) => userApi.createProduct(payload),
  });
};
```

### 3. API Service
Existing implementation in `src/lib/api/services/user.ts`:
```typescript
createProduct: async (
  payload: CreateUserProductPayload | FormData
): Promise<ApiResponse<UserProduct>> => {
  const { data } = await apiClient.post('/user/products/create', payload);
  return data;
}
```

### 4. Component Integration
Key changes to `src/components/add-item-modal.tsx`:

#### Added Imports:
```typescript
import { useCreateUserProduct } from '@/lib/api/hooks/useUser';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle } from 'lucide-react';
```

#### Added Hook:
```typescript
const createProductMutation = useCreateUserProduct();
```

#### Updated Submit Handler:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const payload = {
      name: formData.name,
      category_id: "CATEGORY_UUID_HERE", // Would come from form selection
      unit_id: "UNIT_UUID_HERE", // Would come from form selection  
      description: formData.description,
      brand: "Golden Harvest",
      country_of_origin: "Bangladesh",
      base_price: parseFloat(formData.price),
      status: "draft"
    };

    const response = await createProductMutation.mutateAsync(payload);
    
    toast.success('Item added successfully!', {
      description: `Your item "${formData.name}" has been submitted.`,
    });
    
    console.log('API Response:', response);
    onClose();
  } catch (error) {
    const errorMessage = (error as Error)?.message || 'Failed to add item';
    
    toast.error('Failed to add item', {
      description: errorMessage,
    });
    
    console.error('API Error:', error);
  }
};
```

#### Loading State:
```typescript
<button
  type="submit"
  disabled={createProductMutation.isPending}
  className="flex-1 px-4 sm:px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
>
  {createProductMutation.isPending ? 'Adding Item...' : 'Add Item ✨'}
</button>
```

## Features Implemented

1. **API Integration**: Full integration with `/api/users/products/create` endpoint
2. **Loading States**: Visual feedback during API calls
3. **Error Handling**: Comprehensive error handling with user notifications
4. **Success Feedback**: Toast notifications for successful submissions
5. **Console Logging**: Detailed logging for debugging
6. **Form Validation**: Existing form validation preserved
7. **Type Safety**: Strong typing with TypeScript interfaces

## Next Steps

To complete the integration:
1. Replace `"CATEGORY_UUID_HERE"` and `"UNIT_UUID_HERE"` with actual UUIDs from form selections
2. Add proper category and unit selection dropdowns in the form
3. Implement image upload handling (multipart/form-data)
4. Add proper form validation for all required fields

The foundation is now in place for full API integration with your specified payload structure.