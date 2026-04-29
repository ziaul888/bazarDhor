import Image from 'next/image';
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
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Know what your market
              <span className="block text-primary">actually charges</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Fresh Market Finder shows you community-submitted prices from local markets in your zone — so you can plan
              the trip, compare options, and shop with real numbers instead of guesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href="/markets">Explore markets</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/markets/compare">Compare two markets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why this exists */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Why we built this</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Prices at local markets shift constantly and rarely show up online. The same item can swing 20–30%
                  between two shops a few minutes apart, and the only way to know is to walk in and ask.
                </p>
                <p>
                  Fresh Market Finder turns that legwork into something the community shares. Shoppers submit what they
                  paid, our team verifies it, and the next person looking for the same item gets a real price instead of
                  a guess — without anyone having to make the trip blind.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=600&fit=crop"
                  alt="Local market stall"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the platform does */}
      <section className="py-10 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">What you can do here</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every feature maps to a real shopping decision — finding a market, knowing the price, picking between
              options, trusting the data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four steps from opening the app to acting on a verified price.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative bg-card rounded-xl p-6 border">
                <span className="text-xs font-mono font-semibold text-primary/70 tracking-wider">
                  STEP {item.step}
                </span>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mt-3 mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-2xl p-8 sm:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Start with the markets near you</h2>
            <p className="text-base opacity-90 mb-8 max-w-2xl mx-auto">
              Open the map, find what’s close, and check what people paid yesterday. Add a price the next time you shop
              and the data gets better for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/markets">Find markets in your zone</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/category">Browse by category</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
