"use client";

import { Mail, Users, Gift, Bell } from 'lucide-react';

export function NewsletterSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Newsletter Banner */}
        <div className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-center sm:text-left mb-6 sm:mb-0">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-3">
                <Mail className="h-6 w-6 text-accent-foreground" />
                <h3 className="text-xl sm:text-2xl font-bold text-accent-foreground">
                  Join Our Community
                </h3>
              </div>
              <p className="text-accent-foreground/80 mb-4">
                Get weekly updates on market prices, fresh produce availability, and local grocery deals
              </p>
              
              {/* Benefits */}
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-accent-foreground/70">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>15K+ subscribers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Gift className="h-4 w-4" />
                  <span>Exclusive deals</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Bell className="h-4 w-4" />
                  <span>Weekly updates</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors min-w-[280px]"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
          <span>✓ No spam, unsubscribe anytime</span>
          <span>✓ Weekly price updates</span>
          <span>✓ Fresh produce alerts</span>
          <span>✓ Market opening notifications</span>
        </div>
      </div>
    </section>
  );
}