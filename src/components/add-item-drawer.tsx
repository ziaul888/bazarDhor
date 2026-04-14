"use client";

import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Upload, MapPin, Camera, Sparkles, Tag, DollarSign, Package } from 'lucide-react';
import { useAddItem } from './add-item-context';
import { useCreateUserProduct } from '@/lib/api/hooks';
import { useCategories } from '@/lib/api/hooks/useCategories';
import { useRandomMarkets } from '@/lib/api/hooks/useMarkets';

const addItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((value) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) && parsed >= 0;
    }, 'Price must be a valid number'),
  category: z.string().min(1, 'Category is required'),
  unit: z.string().min(1, 'Unit is required'),
  market: z.string().min(1, 'Market is required'),
  description: z.string().optional(),
  image: z.any().optional(),
});

type AddItemFormValues = z.infer<typeof addItemSchema>;

export function AddItemDrawer() {
  const { isAddDrawerOpen: isOpen, closeAddDrawer: onClose } = useAddItem();

  console.log('AddItemDrawer render - isOpen:', isOpen);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { mutateAsync, isPending, error } = useCreateUserProduct();
  const { data: categories = [], isLoading: isLoadingCategories, isError: hasCategoryError } = useCategories();
  const { data: markets = [], isLoading: isLoadingMarkets, isError: hasMarketError } = useRandomMarkets();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: '',
      price: '',
      category: '',
      unit: '',
      market: '',
      description: '',
    },
  });
  const isSubmitting = isPending || isFormSubmitting;
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        id: String(category.id),
        label: category.name,
      })),
    [categories]
  );
  const marketOptions = useMemo(
    () =>
      markets.map((market) => ({
        id: String(market.id),
        label: market.name,
      })),
    [markets]
  );

  const handleImageChange = (file?: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (values: AddItemFormValues) => {
    const basePrice = values.price ? Number.parseFloat(values.price) : undefined;

    const basePayload = {
      name: values.name,
      category_id: values.category || undefined,
      market_id: values.market || undefined,
      base_price: Number.isFinite(basePrice as number) ? (basePrice as number) : undefined,
      unit_id: "4823e3d0-1534-4fd6-9947-ea2a44cad339",
      description: values.description || undefined,
      status: "draft",
    };

    try {
      if (values.image) {
        const payload = new FormData();
        payload.append('name', basePayload.name);
        if (basePayload.category_id) payload.append('category_id', basePayload.category_id);
        if (basePayload.market_id) payload.append('market_id', basePayload.market_id);
        if (basePayload.base_price !== undefined) payload.append('base_price', String(basePayload.base_price));
        if (basePayload.unit_id) payload.append('unit_id', basePayload.unit_id);
        if (basePayload.description) payload.append('description', basePayload.description);
        if (basePayload.status) payload.append('status', basePayload.status);
        payload.append('image', values.image);
        await mutateAsync(payload);
      } else {
        await mutateAsync(basePayload);
      }

      reset();
      setImagePreview(null);
      onClose();
    } catch (submitError) {
      console.error('Failed to add item:', submitError);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Side Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New Item</h2>
              <p className="text-gray-600 text-sm">Share what you found!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-6">
            {/* Image Upload */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                <Camera className="h-4 w-4 text-primary" />
                <span>Item Photo</span>
              </label>
              <div className="relative group">
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0] ?? null;
                        field.onChange(file ?? undefined);
                        handleImageChange(file);
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                  )}
                />
                <label
                  htmlFor="image-upload"
                  className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-accent/50 to-accent/30 group-hover:from-accent/70 group-hover:to-accent/50"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-4 bg-primary rounded-full">
                        <Upload className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="text-center">
                        <span className="text-gray-700 font-medium">Upload a photo</span>
                        <p className="text-gray-500 text-xs mt-1">Tap to select from gallery</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Item Name */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                <Package className="h-4 w-4 text-primary" />
                <span>Item Name *</span>
              </label>
              <input
                type="text"
                {...register('name')}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                placeholder="e.g., Fresh Organic Tomatoes"
              />
              {errors.name ? (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            {/* Price, Category, and Unit */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Price */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                  <DollarSign className="h-4 w-4 text-success" />
                  <span>Price *</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    {...register('price')}
                    required
                    step="0.01"
                    min="0"
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    placeholder="0.00"
                  />
                </div>
                {errors.price ? (
                  <p className="text-xs text-destructive">{errors.price.message}</p>
                ) : null}
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                  <Tag className="h-4 w-4 text-secondary" />
                  <span>Category *</span>
                </label>
                <select
                  {...register('category')}
                  required
                  disabled={isLoadingCategories || categoryOptions.length === 0}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none"
                >
                  <option value="">
                    {isLoadingCategories
                      ? 'Loading categories...'
                      : categoryOptions.length > 0
                        ? 'Select'
                        : 'No categories available'}
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
                {errors.category ? (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                ) : hasCategoryError ? (
                  <p className="text-xs text-destructive">Could not load categories right now.</p>
                ) : null}
              </div>

              {/* Unit */}
              <div className="space-y-3 sm:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Unit *</span>
                </label>
                <input
                  type="text"
                  {...register('unit')}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="e.g., kg, liter, piece, dozen"
                />
                {errors.unit ? (
                  <p className="text-xs text-destructive">{errors.unit.message}</p>
                ) : null}
              </div>
            </div>

            {/* Market */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                <MapPin className="h-4 w-4 text-destructive" />
                <span>Market Location *</span>
              </label>
              <select
                {...register('market')}
                required
                disabled={isLoadingMarkets || marketOptions.length === 0}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none"
              >
                <option value="">
                  {isLoadingMarkets
                    ? 'Loading markets...'
                    : marketOptions.length > 0
                      ? 'Choose market'
                      : 'No markets available'}
                </option>
                {marketOptions.map((market) => (
                  <option key={market.id} value={market.id}>
                    {market.label}
                  </option>
                ))}
              </select>
              {errors.market ? (
                <p className="text-xs text-destructive">{errors.market.message}</p>
              ) : hasMarketError ? (
                <p className="text-xs text-destructive">Could not load markets right now.</p>
              ) : null}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                <span>Description</span>
                <span className="text-xs text-gray-500">(Optional)</span>
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                placeholder="Any additional details about quality, freshness, etc..."
              />
            </div>

          </div>

          {/* Action Buttons - Sticky Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Adding…' : 'Add Item ✨'}
              </button>
            </div>
            {error ? (
              <p className="mt-3 text-sm text-destructive">
                Failed to add item. Please try again.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}
