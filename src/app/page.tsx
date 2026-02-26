"use client";

import { LocationSection } from "./_components/location-section";
import { SearchSection } from "./_components/search-section";
import { TripleSlider } from "./_components/triple-slider";
import { CategorySection } from "./_components/category-section";
import { NearestMarketSection } from "./_components/nearest-market-section";
import { BannerSection } from "./_components/banner-section";
import { BestPriceSection } from "./_components/best-price-section";
import { CompareMarketsSection } from "./_components/compare-markets-section";
import { AppDownloadSection } from "./_components/app-download-section";
import { NewsletterSection } from "./_components/newsletter-section";
import { FloatingAddButton } from "@/components/floating-add-button";
import { useAddItem } from "@/components/add-item-context";

import { useSearch } from "./_components/search-context";

export default function Home() {
  const { isSearchVisible, hideSearch } = useSearch();
  const { openAddDrawer } = useAddItem();

  return (
    <div>
      {/* Location Section */}
      <LocationSection />

      {/* Search Section - Hidden by default, shows when search is clicked */}
      <SearchSection isVisible={isSearchVisible} onClose={hideSearch} />

      {/* Triple Slider Section */}
      {/* <div className={`transition-all duration-500 ease-in-out ${isSearchVisible ? 'transform translate-y-0' : 'transform translate-y-0'
        }`}>
        <TripleSlider />
      </div> */}
      <NearestMarketSection />
      {/* Category Section */}
     

      {/* Nearest Market Section */}
    <BestPriceSection />
     <CategorySection />

      {/* Banner Section */}
      <BannerSection />

      {/* Best Price Section */}
      

      {/* Compare Markets Section */}
      <CompareMarketsSection />

      {/* App Download Section */}
      {/* <AppDownloadSection /> */}

      {/* Newsletter Section */}
      {/* <NewsletterSection /> */}

      {/* Floating Add Button */}
      <FloatingAddButton onClick={openAddDrawer} />
    </div>
  );
}