import { HomeHeader } from "./_components/home-header";
import { PriceList } from "./_components/price-list";
import { NearestMarketSection } from "./_components/nearest-market-section";
import { CompareStrip } from "./_components/compare-strip";

export default function Home() {
  return (
    <div className="pb-24">
      <HomeHeader />
      

      <div className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 lg:mt-4">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
          <div className="lg:min-w-0">
            <PriceList />
          </div>
          <aside className="lg:pt-6 lg:sticky lg:top-4 lg:self-start lg:space-y-4">
            <CompareStrip />
            <div className="hidden lg:block px-4 text-xs text-muted-foreground space-y-1.5">
              <a className="block hover:text-foreground" href="/markets">All nearby markets →</a>
              <a className="block hover:text-foreground" href="/about">About BazarDhor</a>
            </div>
          </aside>
        </div>
      </div>
      <NearestMarketSection />

      <div className="lg:hidden container mx-auto max-w-3xl px-4 pt-8 text-center text-xs text-muted-foreground">
        <a href="/markets" className="hover:text-foreground">Nearby markets</a>
        <span className="mx-2">·</span>
        <a href="/about" className="hover:text-foreground">About</a>
      </div>
    </div>
  );
}
