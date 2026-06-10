import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HomeBento } from "./_components/home-bento";
import { PriceList } from "./_components/price-list";
import { CompareStrip } from "./_components/compare-strip";
import { NearbyMarketsCard } from "./_components/nearby-markets-card";

export default function Home() {
  const tHome = useTranslations("home");
  const tNav = useTranslations("nav");

  return (
    <div className="pb-24">
      <div className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 lg:mt-2">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
          <div className="lg:min-w-0">
            <HomeBento />
            <PriceList />
          </div>
          <aside className="lg:pt-6 lg:sticky lg:top-4 lg:self-start lg:space-y-4">
            <NearbyMarketsCard />
            <CompareStrip />
          </aside>
        </div>
      </div>

      <div className="lg:hidden container mx-auto max-w-3xl px-4 pt-8 text-center text-xs text-muted-foreground">
        <Link href="/markets" className="hover:text-foreground">
          {tHome("nearbyMarketsTitle")}
        </Link>
        <span className="mx-2">·</span>
        <Link href="/about" className="hover:text-foreground">
          {tNav("about")}
        </Link>
      </div>
    </div>
  );
}
