"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PriceRow, type PriceRowItem } from '@/app/_components/price-row';
import { useRandomProducts } from '@/lib/api/hooks/useMarkets';
import { useCategories } from '@/lib/api/hooks/useCategories';

const PAGE_SIZE = 20;
const IMAGE_BASE_URL = 'https://bazardor.mainul.tech/storage/';

function resolveImage(value?: string | null) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `${IMAGE_BASE_URL}${trimmed}`;
}

function mapToRow(p: NonNullable<ReturnType<typeof useRandomProducts>['data']>[number]): PriceRowItem | null {
  const lowest = p.market_prices?.[0];
  if (!lowest) return null;
  const hasDiscount = lowest.discount_price && lowest.discount_price > 0;
  return {
    id: p.id,
    name: p.name,
    marketId: lowest.market?.id,
    marketName: lowest.market?.name || 'Local market',
    price: hasDiscount ? lowest.discount_price! : (lowest.price || 0),
    unit: p.unit?.symbol || p.unit?.name || undefined,
    image: resolveImage(p.image_path),
  };
}

export default function ItemsPage() {
  const { data: products, isLoading } = useRandomProducts();
  const { data: categories } = useCategories();
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const allRows = useMemo(() => {
    if (!products) return [];
    const filtered = activeCategory === 'all'
      ? products
      : products.filter((p) => String(p.category?.id) === activeCategory);

    const rows = filtered
      .map(mapToRow)
      .filter((r): r is PriceRowItem => r !== null);

    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter((r) =>
      r.name.toLowerCase().includes(q) ||
      r.marketName.toLowerCase().includes(q)
    );
  }, [products, activeCategory, searchQuery]);

  const rows = allRows.slice(0, visible);
  const hasMore = allRows.length > rows.length;

  return (
    <div className="pb-24">
      <div className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 lg:mt-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
          <div className="lg:min-w-0">
            <section>
              <h2 className="px-4 pt-6 text-base font-semibold">All items</h2>

              <div className="px-4 pt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setVisible(PAGE_SIZE);
                    }}
                    placeholder="Search items or markets"
                    className="w-full h-10 pl-9 pr-3 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="px-4 pt-3 pb-2 sticky top-0 z-10 bg-background">
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                  <Chip
                    label="All"
                    active={activeCategory === 'all'}
                    onClick={() => {
                      setActiveCategory('all');
                      setVisible(PAGE_SIZE);
                    }}
                  />
                  {categories?.map((c) => (
                    <Chip
                      key={c.id}
                      label={c.name}
                      active={activeCategory === String(c.id)}
                      onClick={() => {
                        setActiveCategory(String(c.id));
                        setVisible(PAGE_SIZE);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="divide-y border-y bg-card">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
                ) : rows.length === 0 ? (
                  <EmptyState />
                ) : (
                  rows.map((r) => <PriceRow key={`${r.id}-${r.marketId ?? 'na'}`} item={r} />)
                )}
              </div>

              {hasMore && (
                <div className="px-4 py-6 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((n) => n + PAGE_SIZE)}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Load more
                  </button>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:pt-6 lg:sticky lg:top-4 lg:self-start lg:space-y-4">
            <div className="hidden lg:block px-4 text-xs text-muted-foreground space-y-1.5">
              <Link className="block hover:text-foreground" href="/markets">Browse all markets →</Link>
              <Link className="block hover:text-foreground" href="/markets/compare">Compare two markets</Link>
              <Link className="block hover:text-foreground" href="/about">About BazarDhor</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-none px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-background text-muted-foreground border-border hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/5 bg-muted rounded" />
        <div className="h-2.5 w-1/3 bg-muted rounded" />
      </div>
      <div className="h-6 w-16 bg-muted rounded" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-4 py-16 text-center">
      <p className="text-sm font-medium">No items match your search.</p>
      <p className="text-xs text-muted-foreground mt-1">Try a different keyword or category.</p>
    </div>
  );
}
