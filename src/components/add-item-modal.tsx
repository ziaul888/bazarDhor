"use client";

import React, { useState } from 'react';
import { Upload, MapPin, Camera, Sparkles, Tag, DollarSign, Package } from 'lucide-react';
import { useAddItem } from './add-item-context';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';

export function AddItemModal() {
  const { isAddDrawerOpen: isOpen, closeAddDrawer: onClose } = useAddItem();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    market: '',
    description: '',
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form data:', formData);
    alert('Item added successfully! (This is just a demo)');
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Prevent body scroll when sheet is open - Enhanced for all devices
  

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[95vh] sm:h-[90vh] max-w-none sm:max-w-lg bg-white/95 backdrop-blur-xl border-white/20 sm:rounded-t-3xl"
      >
        {/* Header */}
        <SheetHeader className="bg-primary -mx-6 -mt-6 mb-6 p-4 sm:p-6 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <SheetTitle className="text-lg sm:text-xl font-bold text-primary-foreground">
                Add New Item
              </SheetTitle>
              <SheetDescription className="text-primary-foreground/80 text-xs sm:text-sm">
                Share what you found!
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full">
          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto webkit-overflow-scrolling-touch prevent-overscroll -mx-6 px-6">
            <div className="space-y-4 sm:space-y-6 pb-6">
              {/* Image Upload */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                  <Camera className="h-4 w-4 text-primary" />
                  <span>Item Photo</span>
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="relative flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-primary/30 rounded-2xl cursor-pointer hover:border-primary/50 transition-all duration-300 bg-gradient-to-br from-accent/50 to-accent/30 group-hover:from-accent/70 group-hover:to-accent/50"
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
                      <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                        <div className="p-3 sm:p-4 bg-primary rounded-full">
                          <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                        </div>
                        <div className="text-center">
                          <span className="text-gray-700 font-medium text-sm sm:text-base">Upload a photo</span>
                          <p className="text-gray-500 text-xs mt-1">Tap to select from gallery</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Item Name */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Item Name *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base"
                  placeholder="e.g., Fresh Organic Tomatoes"
                />
              </div>

              {/* Price and Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Price */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                    <DollarSign className="h-4 w-4 text-success" />
                    <span>Price *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm sm:text-base"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                    <Tag className="h-4 w-4 text-secondary" />
                    <span>Category *</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none text-sm sm:text-base"
                  >
                    <option value="">Select</option>
                    <option value="fruits">🍎 Fruits</option>
                    <option value="vegetables">🥕 Vegetables</option>
                    <option value="dairy">🥛 Dairy</option>
                    <option value="meat">🥩 Meat</option>
                    <option value="bakery">🍞 Bakery</option>
                    <option value="beverages">🥤 Beverages</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>
              </div>

              {/* Market */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                  <MapPin className="h-4 w-4 text-destructive" />
                  <span>Market Location *</span>
                </label>
                <select
                  name="market"
                  value={formData.market}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none text-sm sm:text-base"
                >
                  <option value="">Choose market</option>
                  <option value="central-market">🏪 Central Market</option>
                  <option value="farmers-market">🌾 Farmer&apos;s Market</option>
                  <option value="downtown-market">🏢 Downtown Market</option>
                  <option value="riverside-market">🌊 Riverside Market</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                  <span>Description</span>
                  <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none text-sm sm:text-base"
                  placeholder="Any additional details about quality, freshness, etc..."
                />
              </div>

            </div>
          </div>

          {/* Action Buttons - Fixed Bottom */}
          <SheetFooter className="bg-white/95 backdrop-blur-sm border-t border-gray-100 -mx-6 -mb-6 mt-auto">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 sm:px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 sm:px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
              >
                Add Item ✨
              </button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}