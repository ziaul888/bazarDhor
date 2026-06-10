"use client";

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRandomMarkets } from '@/lib/api/hooks/useMarkets';

export function CompareStrip() {
  const t = useTranslations('compare');
  const router = useRouter();
  const { data: markets, isLoading } = useRandomMarkets();

  const [a, setA] = useState<string>('');
  const [b, setB] = useState<string>('');

  // Seed sensible defaults once data arrives.
  useEffect(() => {
    if (markets && markets.length >= 2) {
      setA((prev) => prev || markets[0].id);
      setB((prev) => prev || markets[1].id);
    }
  }, [markets]);

  const optionsA = useMemo(
    () => (markets || []).filter((m) => m.id !== b),
    [markets, b]
  );
  const optionsB = useMemo(
    () => (markets || []).filter((m) => m.id !== a),
    [markets, a]
  );

  const canCompare = Boolean(a && b && a !== b);

  const handleCompare = () => {
    if (!canCompare) return;
    const params = new URLSearchParams({ market_id_1: a, market_id_2: b });
    router.push(`/markets/compare?${params.toString()}` as never);
  };

  return (
    <section className="px-4 mt-8 lg:mt-0">
      <h2 className="text-sm font-semibold mb-2">{t('stripTitle')}</h2>
      <div className="rounded-lg border bg-card p-3 space-y-2">
        <Select value={a} onValueChange={setA} disabled={isLoading}>
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder={t('firstMarket')} />
          </SelectTrigger>
          <SelectContent>
            {optionsA.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={b} onValueChange={setB} disabled={isLoading}>
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder={t('secondMarket')} />
          </SelectTrigger>
          <SelectContent>
            {optionsB.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={handleCompare}
          disabled={!canCompare}
          className="w-full h-9 mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('stripCta')} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}
