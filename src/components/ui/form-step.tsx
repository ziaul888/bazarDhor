'use client';

import React from 'react';
import type { FormStepProps, FormStepContext } from './multi-step-form.types';

// Try to import Activity API (experimental in React 19+)
// Fallback to a custom implementation if not available
let Activity: any;
try {
    // @ts-ignore - Activity is experimental
    Activity = React.Activity || React.unstable_Activity;
} catch (e) {
    Activity = null;
}

/**
 * Individual form step wrapper component
 * Uses React Activity API to preserve state when hidden (if available)
 * Falls back to CSS-based visibility if Activity API is not available
 */
export function FormStep<T = any>({
    id,
    title,
    description,
    validate,
    isOptional,
    shouldShow,
    children,
}: FormStepProps<T>) {
    // This component is primarily a configuration container
    // The actual rendering logic is handled by MultiStepForm
    // This component's props are used to configure each step

    return null;
}

// For internal use by MultiStepForm
export function FormStepRenderer<T = any>({
    isActive,
    context,
    children,
}: {
    isActive: boolean;
    context: FormStepContext<T>;
    children: (context: FormStepContext<T>) => React.ReactNode;
}) {
    // Use Activity API if available, otherwise use CSS-based visibility
    // Both approaches keep the component mounted to preserve state

    if (Activity) {
        // Use experimental Activity API for optimal performance
        return (
            <Activity mode={isActive ? 'visible' : 'hidden'}>
                <div className="w-full" aria-hidden={!isActive}>
                    {children(context)}
                </div>
            </Activity>
        );
    }

    // Fallback: Keep component mounted but control visibility with CSS
    // This achieves the same state preservation goal
    return (
        <div
            className="w-full"
            style={{
                display: isActive ? 'block' : 'none',
            }}
            aria-hidden={!isActive}
        >
            {children(context)}
        </div>
    );
}
