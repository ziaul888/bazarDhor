"use client";

import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowRight, MapPin, GitCompare } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  image: string;
  productCount: number;
  icon: string;
  priceChange: string;
  markets: number;
}

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Convert category name to slug
  const slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
  
  return (
    <Link href={`/category/${slug}`}>
      <div className="group bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Category Image */}
      <div className="relative h-40 overflow-hidden">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

        {/* Price Trend Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-white text-xs font-bold rounded-full flex items-center space-x-1 ${
            category.priceChange === 'up' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {category.priceChange === 'up' ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
          </span>
        </div>

        {/* Mobile Action Icons */}
        <div className="absolute top-3 left-3 flex space-x-2 md:hidden">
          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <MapPin className="h-4 w-4 text-gray-700" />
          </button>
          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <GitCompare className="h-4 w-4 text-gray-700" />
          </button>
        </div>

        {/* Category Icon & Name Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xl shadow-sm">
              {category.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg group-hover:text-primary-foreground transition-colors">
                {category.name}
              </h3>
              <div className="flex items-center space-x-4 text-white/90 text-sm">
                <span>{category.productCount} items</span>
                <span>{category.markets} markets</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}