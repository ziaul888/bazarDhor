import Link from 'next/link';
import { Plus } from 'lucide-react';

const categories = [
  {
    id: 1,
    name: "Vegetables",
    vendors: 85,
    markets: 42,
    totalItems: 1250,
    rating: 4.8,
    icon: "🥬",
    popular: true
  },
  {
    id: 2,
    name: "Fruits",
    vendors: 72,
    markets: 38,
    totalItems: 980,
    rating: 4.9,
    icon: "🍎",
    popular: true
  },
  {
    id: 3,
    name: "Meat",
    vendors: 45,
    markets: 25,
    totalItems: 650,
    rating: 4.7,
    icon: "🥩",
    popular: true
  },
  {
    id: 4,
    name: "Seafood",
    vendors: 28,
    markets: 18,
    totalItems: 420,
    rating: 4.6,
    icon: "🐟",
    popular: false
  },
  {
    id: 5,
    name: "Dairy",
    vendors: 35,
    markets: 22,
    totalItems: 580,
    rating: 4.5,
    icon: "🥛",
    popular: false
  },
  {
    id: 6,
    name: "Grains",
    vendors: 42,
    markets: 28,
    totalItems: 720,
    rating: 4.4,
    icon: "🌾",
    popular: false
  },
  {
    id: 7,
    name: "Spices",
    vendors: 38,
    markets: 24,
    totalItems: 890,
    rating: 4.7,
    icon: "🌿",
    popular: false
  },
  {
    id: 8,
    name: "Bakery",
    vendors: 25,
    markets: 15,
    totalItems: 340,
    rating: 4.6,
    icon: "🥖",
    popular: false
  },
  {
    id: 9,
    name: "Snacks",
    vendors: 31,
    markets: 20,
    totalItems: 520,
    rating: 4.3,
    icon: "🍿",
    popular: false
  },
  {
    id: 10,
    name: "Beverages",
    vendors: 29,
    markets: 19,
    totalItems: 480,
    rating: 4.4,
    icon: "🥤",
    popular: false
  }
];

export function CategorySection() {
  // Show first 9 categories on mobile, 10 on larger screens
  const displayCategories = categories.slice(0, 9);

  return (
    <section className="py-3 sm:py-6 lg:py-8">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">Shop by Category</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Fresh groceries from local markets</p>
          </div>

          {/* View All Link */}
          <Link 
            href="/category" 
            className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium transition-colors whitespace-nowrap"
          >
            View All
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 sm:gap-3 lg:gap-4">
          {displayCategories.map((category) => (
            <Link key={category.id} href="/category" className="group">
              <div className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl sm:rounded-3xl border-0 shadow-sm hover:shadow-lg sm:hover:shadow-xl hover:scale-105 transition-all duration-300 sm:duration-500 cursor-pointer overflow-hidden backdrop-blur-sm">
                {/* Popular Badge */}
                {category.popular && (
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 z-10">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-2 sm:p-3 text-center relative z-10">
                  {/* Category Icon with Floating Effect */}
                  <div className="relative mb-1.5 sm:mb-2">
                    <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg group-hover:shadow-lg sm:group-hover:shadow-xl group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1 transition-all duration-300 sm:duration-500 border border-gray-100">
                      <span className="text-sm xs:text-base sm:text-lg md:text-xl filter drop-shadow-sm">{category.icon}</span>
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto bg-primary/20 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500"></div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-xs xs:text-xs sm:text-sm font-bold text-foreground mb-1 sm:mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {category.name}
                  </h3>

                  {/* Category Stats with Icons - Hidden on very small screens */}
                  <div className="hidden xs:block space-y-0.5 sm:space-y-1">
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                      <span className="text-xs">📦</span>
                      <span className="font-medium text-xs">{category.totalItems > 999 ? `${Math.floor(category.totalItems/1000)}k` : category.totalItems}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                      <span className="text-xs">🏪</span>
                      <span className="font-medium text-xs">{category.markets}</span>
                    </div>
                  </div>

                  {/* Simplified stats for very small screens */}
                  <div className="xs:hidden">
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                      <span className="font-medium text-xs">{category.markets} markets</span>
                    </div>
                  </div>
                </div>

                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500"></div>
                
                {/* Subtle Border Glow */}
                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500"></div>
              </div>
            </Link>
          ))}

          {/* View All Button */}
          <Link href="/category" className="group">
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 rounded-2xl sm:rounded-3xl border-2 border-dashed border-primary/40 hover:border-primary/60 hover:scale-105 transition-all duration-300 sm:duration-500 cursor-pointer overflow-hidden">
              <div className="p-2 sm:p-3 text-center relative z-10">
                <div className="relative mb-1.5 sm:mb-2">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto bg-gradient-to-br from-primary/30 to-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md sm:shadow-lg group-hover:shadow-lg sm:group-hover:shadow-xl group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1 transition-all duration-300 sm:duration-500 border border-primary/30">
                    <Plus className="h-3 w-3 xs:h-4 xs:w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 text-primary group-hover:rotate-90 transition-transform duration-300 sm:duration-500" />
                  </div>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto bg-primary/30 rounded-xl sm:rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500"></div>
                </div>
                <h3 className="text-xs xs:text-xs sm:text-sm font-bold text-primary group-hover:text-primary/80 transition-colors mb-1 sm:mb-2 leading-tight">
                  View All
                </h3>
                
                {/* Stats for larger screens */}
                <div className="hidden xs:block space-y-0.5 sm:space-y-1">
                  <div className="flex items-center justify-center space-x-1 text-xs text-primary/70">
                    <span className="text-xs">✨</span>
                    <span className="font-medium text-xs">More</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-xs text-primary/70">
                    <span className="text-xs">🔍</span>
                    <span className="font-medium text-xs">Explore</span>
                  </div>
                </div>

                {/* Simplified for very small screens */}
                <div className="xs:hidden">
                  <div className="flex items-center justify-center space-x-1 text-xs text-primary/70">
                    <span className="font-medium text-xs">Explore</span>
                  </div>
                </div>
              </div>
              
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:duration-500"></div>
            </div>
          </Link>
        </div>
      </div>

      {/* Custom styles for xs breakpoint */}
      <style jsx global>{`
        /* Custom breakpoint for extra small screens */
        @media (min-width: 475px) {
          .xs\\:w-9 { width: 2.25rem; }
          .xs\\:h-9 { height: 2.25rem; }
          .xs\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .xs\\:text-base { font-size: 1rem; line-height: 1.5rem; }
          .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
          .xs\\:block { display: block; }
          .xs\\:hidden { display: none; }
        }
      `}</style>
    </section>
  );
}