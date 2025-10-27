"use client";

import { useState } from 'react';
import { X, Upload, MapPin, Camera, Sparkles, Tag, DollarSign, Package } from 'lucide-react';
import { useAddItem } from './add-item-context';

export function AddItemModal() {
  const { isAddModalOpen: isOpen, closeAddModal: onClose } = useAddItem();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    market: '',
    description: '',
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="relative bg-primary p-6">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary-foreground">Add New Item</h2>
                <p className="text-primary-foreground/80 text-sm">Share what you found!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <X className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Image Upload */}
          <div className="space-y-3">
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
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              placeholder="e.g., Fresh Organic Tomatoes"
            />
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-2 gap-4">
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
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
                <Tag className="h-4 w-4 text-secondary" />
                <span>Category *</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none"
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
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
              <MapPin className="h-4 w-4 text-destructive" />
              <span>Market Location *</span>
            </label>
            <select
              name="market"
              value={formData.market}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none"
            >
              <option value="">Choose market</option>
              <option value="central-market">🏪 Central Market</option>
              <option value="farmers-market">🌾 Farmer&apos;s Market</option>
              <option value="downtown-market">🏢 Downtown Market</option>
              <option value="riverside-market">🌊 Riverside Market</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-800">
              <span>Description</span>
              <span className="text-xs text-gray-500">(Optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
              placeholder="Any additional details about quality, freshness, etc..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Add Item ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}