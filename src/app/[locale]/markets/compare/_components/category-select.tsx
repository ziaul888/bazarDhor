"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Category } from '@/lib/api/types';

interface CategorySelectProps {
  categories: Category[];
  // Selected category id as a string — ids arrive as number or string
  // depending on the endpoint, so the parent keeps them normalized.
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}

// Searchable replacement for the plain Select: the category list keeps growing,
// so the dropdown carries its own filter box instead of an unscannable list.
export function CategorySelect({ categories, value, onChange, disabled = false }: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('compare');
  const tCommon = useTranslations('common');

  // Close on any pointer outside — same behavior as the market selector.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  const trimmedQuery = query.trim().toLowerCase();
  const visibleCategories = trimmedQuery
    ? categories.filter((category) => category.name.toLowerCase().includes(trimmedQuery))
    : categories;
  const selected = categories.find((category) => String(category.id) === value) ?? null;

  return (
    <div ref={wrapperRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => {
          setQuery('');
          setIsOpen(!isOpen);
        }}
        disabled={disabled || categories.length === 0}
        aria-expanded={isOpen}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 text-sm hover:bg-accent transition-colors disabled:opacity-50"
      >
        <span className="truncate">{selected?.name ?? t('selectCategory')}</span>
        <ChevronDown
          className={`h-4 w-4 flex-none text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-30 top-full mt-1.5 w-full bg-card border rounded-md shadow-lg">
          {/* Search: narrow the categories before picking */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('searchCategory')}
                aria-label={t('searchCategory')}
                autoFocus
                className="h-9 pl-8 pr-2 text-sm"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {visibleCategories.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                {tCommon('noResults')}
              </p>
            ) : (
              visibleCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onChange(String(category.id));
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                >
                  <Check
                    className={`h-3.5 w-3.5 flex-none ${
                      String(category.id) === value ? 'text-success' : 'opacity-0'
                    }`}
                  />
                  <span className="truncate">{category.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
