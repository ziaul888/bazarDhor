"use client";

import Image from 'next/image';
import { MapPin, Users, TrendingUp, Heart, Shield, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const stats = [
  { label: "Local Markets", value: "150+", icon: MapPin },
  { label: "Active Users", value: "25K+", icon: Users },
  { label: "Price Updates Daily", value: "500+", icon: TrendingUp },
  { label: "Community Members", value: "12K+", icon: Heart }
];

const features = [
  {
    icon: MapPin,
    title: "Find Nearest Markets",
    description: "Discover fresh produce markets within 5km of your location with real-time availability and pricing."
  },
  {
    icon: TrendingUp,
    title: "Real-time Price Updates",
    description: "Get the latest prices updated by our community of market visitors and vendors themselves."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of users who help keep market information accurate and up-to-date."
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Verified market information with user reviews and ratings to ensure reliability."
  }
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop",
    bio: "Former farmer's market vendor with 10+ years experience in local food systems."
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    bio: "Tech entrepreneur passionate about connecting communities through technology."
  },
  {
    name: "Emily Rodriguez",
    role: "Community Manager",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
    bio: "Local food advocate helping build stronger connections between markets and communities."
  },
  {
    name: "David Kim",
    role: "Product Manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    bio: "UX designer focused on creating intuitive experiences for market discovery."
  }
];

const values = [
  {
    icon: Heart,
    title: "Community First",
    description: "We believe in strengthening local communities by connecting people with their neighborhood markets."
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "Open and honest pricing information helps everyone make better shopping decisions."
  },
  {
    icon: Target,
    title: "Accessibility",
    description: "Making fresh, local produce accessible to everyone regardless of their location or budget."
  },
  {
    icon: Award,
    title: "Quality",
    description: "Supporting vendors who prioritize quality, freshness, and sustainable practices."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Connecting Communities with
              <span className="block text-primary">Local Markets</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We&apos;re building a platform that makes it easy to discover fresh produce, 
              compare prices, and support local vendors in your neighborhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/markets">
                  Explore Markets
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/markets/compare">
                  Compare Prices
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  MyMarket was born from a simple frustration: finding fresh, affordable produce 
                  in local markets shouldn&apos;t be a guessing game. As frequent market-goers ourselves, 
                  we noticed how prices varied between vendors and how difficult it was to know 
                  what was available before making the trip.
                </p>
                <p>
                  In 2023, we decided to solve this problem by creating a community-driven platform 
                  where market visitors could share real-time information about prices, availability, 
                  and quality. What started as a weekend project has grown into a thriving community 
                  of over 25,000 users across 150+ local markets.
                </p>
                <p>
                  Today, MyMarket helps thousands of families discover fresh produce, support local 
                  vendors, and make informed shopping decisions. We&apos;re proud to be part of the 
                  movement that strengthens local food systems and builds stronger communities.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=600&fit=crop"
                  alt="Local farmers market"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Do</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines technology with community knowledge to make local market 
              shopping easier, more transparent, and more rewarding for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do and shape how we build 
              our platform and serve our community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We&apos;re a passionate team of food enthusiasts, technologists, and community 
              builders working to make local markets more accessible to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-card rounded-xl p-6 border text-center hover:shadow-md transition-shadow">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 rounded-2xl p-8 sm:p-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Help us build a better way to discover and support local markets. 
              Start exploring fresh produce in your neighborhood today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/markets">
                  Find Markets Near You
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="mailto:hello@mymarket.com">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}