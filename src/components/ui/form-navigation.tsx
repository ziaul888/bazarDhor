'use client';

import { cn } from '@/lib/utils';
import type { FormNavigationProps } from './multi-step-form.types';

/**
 * Navigation controls for multistep forms
 * Handles Previous, Next, and Submit actions
 */
export function FormNavigation({
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    isValidating,
    isSubmitting,
    canGoNext,
    onPrevious,
    onNext,
    onSubmit,
    previousLabel = 'Previous',
    nextLabel = 'Next',
    submitLabel = 'Submit',
    className,
    previousButtonClassName,
    nextButtonClassName,
    submitButtonClassName,
    hideNavigation = false,
}: FormNavigationProps) {
    if (hideNavigation) return null;

    const baseButtonClass =
        'rounded-lg px-6 py-2.5 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const previousClass = cn(
        baseButtonClass,
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        previousButtonClassName
    );

    const nextClass = cn(
        baseButtonClass,
        'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus:ring-blue-500',
        nextButtonClassName
    );

    const submitClass = cn(
        baseButtonClass,
        'bg-green-600 text-white shadow-sm hover:bg-green-700 focus:ring-green-500',
        submitButtonClassName
    );

    return (
        <div className={cn('flex items-center justify-between gap-4', className)}>
            {/* Previous Button */}
            <button
                type="button"
                onClick={onPrevious}
                disabled={isFirstStep || isSubmitting}
                className={previousClass}
                aria-label="Go to previous step"
            >
                <span className="flex items-center gap-2">
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    {previousLabel}
                </span>
            </button>

            {/* Step indicator (mobile friendly) */}
            <div className="text-sm text-gray-600">
                <span className="font-medium">{currentStep + 1}</span>
                <span className="mx-1">/</span>
                <span>{totalSteps}</span>
            </div>

            {/* Next or Submit Button */}
            {isLastStep ? (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!canGoNext || isSubmitting}
                    className={submitClass}
                    aria-label="Submit form"
                >
                    <span className="flex items-center gap-2">
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            <>
                                {submitLabel}
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </>
                        )}
                    </span>
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoNext}
                    className={nextClass}
                    aria-label="Go to next step"
                >
                    <span className="flex items-center gap-2">
                        {isValidating ? (
                            <>
                                <svg
                                    className="h-4 w-4 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Validating...
                            </>
                        ) : (
                            <>
                                {nextLabel}
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </>
                        )}
                    </span>
                </button>
            )}
        </div>
    );
}
