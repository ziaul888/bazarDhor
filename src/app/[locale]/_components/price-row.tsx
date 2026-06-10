"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { RefreshCw, Package, Store, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { ProductPriceDialog } from '@/components/product-price-dialog';
import { useSubmitProductPrice } from '@/lib/api/hooks/useUser';
import { handleApiError } from '@/lib/api/client';
import { toast } from 'sonner';

export type PriceRowItem = {
  id: string | number;
  name: string;
  marketName: string;
  marketId?: string | number;
  price: number;
  unit?: string;
  image?: string;
  lastUpdate?: string;
  priceTrend?: 'up' | 'down' | 'stable';
};

interface PriceRowProps {
  item: PriceRowItem;
}

export function PriceRow({ item }: PriceRowProps) {
  const locale = useLocale();
  const tToasts = useTranslations('toasts');
  const tPriceRow = useTranslations('priceRow');
  // Why: render prices in the user's locale digits (Bengali in bn-BD).
  const taka = useMemo(() => new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-IN'), [locale]);
  const [open, setOpen] = useState(false);
  const [newPrice, setNewPrice] = useState(item.price.toString());
  const [imageError, setImageError] = useState(false);
  const submit = useSubmitProductPrice();

  const hasImage = Boolean(item.image && item.image.trim().length > 0) && !imageError;

  const handleOpen = () => {
    setNewPrice(item.price.toString());
    setOpen(true);
  };

  const handleSave = async () => {
    if (!item.marketId) {
      toast.error(tToasts('marketMissing'));
      return;
    }
    const parsed = Number.parseFloat(newPrice);
    if (Number.isNaN(parsed) || parsed <= 0) {
      toast.error(tToasts('invalidPrice'));
      return;
    }
    const payload = new FormData();
    payload.append('product_id', String(item.id));
    payload.append('market_id', String(item.marketId));
    payload.append('submitted_price', parsed.toFixed(2));
    payload.append('proof_image', 'null');
    try {
      await submit.mutateAsync(payload);
      toast.success(tToasts('priceSubmitted'));
      setOpen(false);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        <span
          aria-hidden
          className="relative flex-none w-10 h-10 rounded-lg overflow-hidden bg-primary/10 text-primary font-semibold flex items-center justify-center"
        >
          {hasImage ? (
            <Image
              src={item.image!}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <Package className="h-4 w-4" />
          )}
        </span>

        <span className="flex-1 min-w-0">
          <span className="block text-sm font-medium truncate">{item.name}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground truncate">
            <Store className="h-3 w-3 flex-none" />
            <span className="truncate">{item.marketName}</span>
          </span>
          {item.lastUpdate ? (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/80 truncate">
              <Clock className="h-2.5 w-2.5 flex-none" />
              <span className="truncate">{item.lastUpdate}</span>
            </span>
          ) : null}
        </span>

        <span className="flex-none flex items-center gap-2">
          <span className="text-right leading-tight">
            <span className="flex items-center justify-end gap-1 text-xl sm:text-2xl font-bold text-primary tabular-nums">
              {item.priceTrend === 'up' ? (
                <TrendingUp aria-label="Trending up" className="h-3.5 w-3.5 text-rose-500" />
              ) : item.priceTrend === 'down' ? (
                <TrendingDown aria-label="Trending down" className="h-3.5 w-3.5 text-emerald-500" />
              ) : null}
              <span>৳ {taka.format(item.price)}</span>
            </span>
            {item.unit ? (
              <span className="block text-[10px] text-muted-foreground">/ {item.unit}</span>
            ) : null}
          </span>
          <span className="group relative flex-none">
            <span
              aria-label={tPriceRow('updatePrice')}
              title={tPriceRow('updatePrice')}
              className="flex w-8 h-8 rounded-full bg-primary/10 text-primary items-center justify-center"
            >
              <RefreshCw className="h-4 w-4" />
            </span>
            <span
              role="tooltip"
              className="pointer-events-none absolute right-0 -top-8 whitespace-nowrap rounded-md bg-foreground text-background text-[11px] font-medium px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {tPriceRow('updatePrice')}
            </span>
          </span>
        </span>
      </button>

      <ProductPriceDialog
        open={open}
        onOpenChange={setOpen}
        item={{
          id: item.id,
          name: item.name,
          marketName: item.marketName,
          marketId: item.marketId,
          currentPrice: item.price,
          image: item.image ?? '',
        }}
        newPrice={newPrice}
        onNewPriceChange={setNewPrice}
        onSave={handleSave}
        confirmLabel={submit.isPending ? 'Submitting...' : 'Submit Price'}
        disableSave={!newPrice || Number.parseFloat(newPrice) <= 0 || !item.marketId}
        saving={submit.isPending}
      />
    </>
  );
}
