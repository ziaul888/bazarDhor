import {
  Search,
  TrendingUp,
  GitCompare,
  ShieldCheck,
  Compass,
  Tag,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
const features = [
  {
    icon: Search,
    title: 'Discover local markets',
    description:
      'Browse markets in your zone, filter by category, and see ratings, opening hours, and what each market is known for.',
  },
  {
    icon: TrendingUp,
    title: 'Community-submitted prices',
    description:
      'See what items actually cost — submitted by people who shopped there, not scraped from generic listings.',
  },
  {
    icon: GitCompare,
    title: 'Compare two markets',
    description:
      'Put any two markets side by side to weigh distance, services, product range, and prices before you head out.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified before published',
    description:
      'Every price submission goes through admin review, so the data you read is moderated rather than raw user input.',
  },
];

const howItWorks = [
  {
    step: '01',
    icon: Compass,
    title: 'Pick your zone',
    description:
      'On your first visit we detect your area automatically — every market, price, and search result is scoped to that zone.',
  },
  {
    step: '02',
    icon: Tag,
    title: 'Browse and search',
    description:
      'Look up markets by category or search by item. Each listing shows community-submitted prices for what it carries.',
  },
  {
    step: '03',
    icon: Camera,
    title: 'Submit what you find',
    description:
      'Spotted a price we don’t have? Add it through the in-app form with a photo as proof — it joins the moderation queue.',
  },
  {
    step: '04',
    icon: CheckCircle2,
    title: 'We verify, you benefit',
    description:
      'Admins review submissions and publish the verified ones, so the next person checking the app gets accurate info.',
  },
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-4 pt-4">
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
          Know what your market actually charges
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
          BazarDhor shows you community-submitted prices from local markets in your zone — so you
          can plan the trip, compare options, and shop with real numbers instead of guesses.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button size="sm" asChild>
            <Link href="/markets">Explore markets</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/markets/compare">Compare two markets</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-8">
        <h2 className="px-4 lg:px-0 text-base font-semibold mb-2">Why we built this</h2>
        <div className="border-y lg:border lg:rounded-xl bg-card px-4 py-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Prices at local markets shift constantly and rarely show up online. The same item can
            swing 20–30% between two shops a few minutes apart, and the only way to know is to walk
            in and ask.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            BazarDhor turns that legwork into something the community shares. Shoppers submit what
            they paid, our team verifies it, and the next person looking for the same item gets a
            real price instead of a guess.
          </p>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-8">
        <h2 className="px-4 lg:px-0 text-base font-semibold mb-2">What you can do here</h2>
        <div className="border-y lg:border lg:rounded-xl bg-card divide-y">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3 px-4 py-3">
              <span
                aria-hidden
                className="flex-none w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"
              >
                <feature.icon className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{feature.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-8">
        <h2 className="px-4 lg:px-0 text-base font-semibold mb-2">How it works</h2>
        <div className="border-y lg:border lg:rounded-xl bg-card divide-y">
          {howItWorks.map((item) => (
            <div key={item.step} className="flex items-start gap-3 px-4 py-3">
              <span
                aria-hidden
                className="flex-none w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs"
              >
                {item.step}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-primary/70" />
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-4 mt-8">
        <div className="rounded-xl border bg-primary/5 px-4 py-5 text-center">
          <h2 className="text-base font-semibold">Start with the markets near you</h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Open the map, find what’s close, and check what people paid yesterday. Add a price the
            next time you shop and the data gets better for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <Button size="sm" asChild>
              <Link href="/markets">Find markets in your zone</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/items">Browse all items</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
