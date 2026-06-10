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
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function AboutPage() {
  const t = useTranslations('about');

  const features = [
    { icon: Search, title: t('feature1Title'), description: t('feature1Desc') },
    { icon: TrendingUp, title: t('feature2Title'), description: t('feature2Desc') },
    { icon: GitCompare, title: t('feature3Title'), description: t('feature3Desc') },
    { icon: ShieldCheck, title: t('feature4Title'), description: t('feature4Desc') },
  ];

  const howItWorks = [
    { step: '01', icon: Compass, title: t('how1Title'), description: t('how1Desc') },
    { step: '02', icon: Tag, title: t('how2Title'), description: t('how2Desc') },
    { step: '03', icon: Camera, title: t('how3Title'), description: t('how3Desc') },
    { step: '04', icon: CheckCircle2, title: t('how4Title'), description: t('how4Desc') },
  ];

  return (
    <div className="pb-24">
      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-4 pt-4">
        <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">{t('heroTitle')}</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
          {t('heroLead')}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button size="sm" asChild>
            <Link href="/markets">{t('ctaExplore')}</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/markets/compare">{t('ctaCompare')}</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-8">
        <h2 className="px-4 lg:px-0 text-base font-semibold mb-2">{t('whyTitle')}</h2>
        <div className="border-y lg:border lg:rounded-xl bg-card px-4 py-4 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{t('whyParagraph1')}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{t('whyParagraph2')}</p>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl lg:max-w-6xl px-0 lg:px-4 mt-8">
        <h2 className="px-4 lg:px-0 text-base font-semibold mb-2">{t('featuresTitle')}</h2>
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
        <h2 className="px-4 lg:px-0 text-base font-semibold mb-2">{t('howTitle')}</h2>
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
          <h2 className="text-base font-semibold">{t('ctaTitle')}</h2>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t('ctaLead')}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <Button size="sm" asChild>
              <Link href="/markets">{t('ctaFind')}</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/items">{t('ctaBrowseItems')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
