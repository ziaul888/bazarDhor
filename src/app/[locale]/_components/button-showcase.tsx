"use client";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/colors";
import { Heart, Download, Settings, Trash2 } from "lucide-react";

export function ButtonShowcase() {
  return (
    <div className="space-y-8 p-6 bg-card rounded-xl border">
      <h3 className="text-2xl font-bold text-center mb-6">Rustic Potato Button Variants</h3>
      
      {/* Primary Buttons */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-primary">Primary Buttons</h4>
        <div className="flex flex-wrap gap-3">
          <Button className={buttonVariants.primary.default}>
            <Heart className="h-4 w-4 mr-2" />
            Default
          </Button>
          <Button variant="outline" className={buttonVariants.primary.outline}>
            <Download className="h-4 w-4 mr-2" />
            Outline
          </Button>
          <Button variant="ghost" className={buttonVariants.primary.ghost}>
            <Settings className="h-4 w-4 mr-2" />
            Ghost
          </Button>
          <Button className={buttonVariants.primary.soft}>
            Soft
          </Button>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Secondary Buttons</h4>
        <div className="flex flex-wrap gap-3">
          <Button className={buttonVariants.secondary.default}>
            Default
          </Button>
          <Button variant="outline" className={buttonVariants.secondary.outline}>
            Outline
          </Button>
          <Button variant="ghost" className={buttonVariants.secondary.ghost}>
            Ghost
          </Button>
          <Button className={buttonVariants.secondary.soft}>
            Soft
          </Button>
        </div>
      </div>

      {/* Success Buttons */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-success">Success Buttons</h4>
        <div className="flex flex-wrap gap-3">
          <Button className={buttonVariants.success.default}>
            Success
          </Button>
          <Button variant="outline" className={buttonVariants.success.outline}>
            Success Outline
          </Button>
          <Button variant="ghost" className={buttonVariants.success.ghost}>
            Success Ghost
          </Button>
          <Button className={buttonVariants.success.soft}>
            Success Soft
          </Button>
        </div>
      </div>

      {/* Destructive Buttons */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-destructive">Destructive Buttons</h4>
        <div className="flex flex-wrap gap-3">
          <Button className={buttonVariants.destructive.default}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline" className={buttonVariants.destructive.outline}>
            Delete Outline
          </Button>
          <Button variant="ghost" className={buttonVariants.destructive.ghost}>
            Delete Ghost
          </Button>
          <Button className={buttonVariants.destructive.soft}>
            Delete Soft
          </Button>
        </div>
      </div>

      {/* Size Variants */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-primary">Size Variants</h4>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" className={buttonVariants.primary.default}>
            Small
          </Button>
          <Button className={buttonVariants.primary.default}>
            Default
          </Button>
          <Button size="lg" className={buttonVariants.primary.default}>
            Large
          </Button>
          <Button size="icon" className={buttonVariants.primary.default}>
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}