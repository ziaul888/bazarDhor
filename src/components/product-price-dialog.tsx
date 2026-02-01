"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

type ProductPriceDialogItem = {
  id: number | string;
  name: string;
  marketName: string;
  marketId?: number | string;
  currentPrice: number;
  image: string;
};

interface ProductPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProductPriceDialogItem | null;
  newPrice: string;
  onNewPriceChange: (value: string) => void;
  onSave: () => void;
  onQuickAdjust?: (delta: number) => void;
  quickAdjustments?: number[];
  pricePrefix?: string;
  title?: string;
  confirmLabel?: string;
  disableSave?: boolean;
}

export function ProductPriceDialog({
  open,
  onOpenChange,
  item,
  newPrice,
  onNewPriceChange,
  onSave,
  onQuickAdjust,
  quickAdjustments = [-5, 5],
  pricePrefix = '৳',
  title = 'Update Price',
  confirmLabel = 'Update Price',
  disableSave = false,
}: ProductPriceDialogProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [item?.id, open]);

  if (!item) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSave} disabled>
              {confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="flex items-center space-x-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
              {item.image && !imageError ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary/20" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{item.name}</h3>
              {item.marketId ? (
                <Link
                  href={`/markets/${item.marketId}`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors block"
                >
                  @{item.marketName}
                </Link>
              ) : (
                <p className="text-xs text-muted-foreground">@{item.marketName}</p>
              )}
              <p className="text-xs font-bold text-primary">
                Current: {pricePrefix}
                {item.currentPrice}
              </p>
            </div>
          </div>

          {/* Quick Adjustment Buttons */}
          {onQuickAdjust ? (
            <div className="space-y-3">
              <label className="text-sm font-medium">Quick Adjustments</label>
              <div className="grid grid-cols-2 gap-2">
                {quickAdjustments.map((delta) => (
                  <Button
                    key={delta}
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickAdjust(delta)}
                    className="text-xs"
                  >
                    {delta > 0 ? '+' : ''}{pricePrefix}{Math.abs(delta)}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Price Input */}
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              New Price ({pricePrefix})
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={newPrice}
              onChange={(e) => onNewPriceChange(e.target.value)}
              placeholder="Enter new price"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={disableSave}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
