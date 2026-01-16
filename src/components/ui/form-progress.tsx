'use client';

import { cn } from '@/lib/utils';
import type { FormProgressProps } from './multi-step-form.types';

/**
 * Progress indicator component for multistep forms
 * Displays current progress with multiple visual variants
 */
export function FormProgress({
    currentStep,
    totalSteps,
    steps,
    showStepNumbers = true,
    showStepTitles = true,
    variant = 'linear',
    className,
    onStepClick,
    allowStepNavigation = false,
}: FormProgressProps) {
    const progressPercentage = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

    if (variant === 'linear') {
        return (
            <div className={cn('w-full space-y-2', className)}>
                {/* Current step indicator */}
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                        Step {currentStep + 1} of {totalSteps}
                    </span>
                    <span className="text-gray-500">{Math.round(progressPercentage)}% complete</span>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Step titles */}
                {showStepTitles && (
                    <div className="flex items-center justify-between text-xs text-gray-600">
                        {steps.map((step, index) => (
                            <span
                                key={step.id}
                                className={cn(
                                    'transition-colors',
                                    index === currentStep && 'font-semibold text-blue-600',
                                    step.completed && 'text-green-600'
                                )}
                            >
                                {step.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'dots') {
        return (
            <div className={cn('flex items-center justify-center gap-2', className)}>
                {steps.map((step, index) => (
                    <button
                        key={step.id}
                        type="button"
                        onClick={() => allowStepNavigation && onStepClick?.(index)}
                        disabled={!allowStepNavigation}
                        className={cn(
                            'h-2.5 rounded-full transition-all duration-300',
                            index === currentStep && 'w-8 bg-blue-600',
                            index !== currentStep && 'w-2.5',
                            index < currentStep && 'bg-green-500',
                            index > currentStep && 'bg-gray-300',
                            allowStepNavigation && 'cursor-pointer hover:scale-110',
                            !allowStepNavigation && 'cursor-default'
                        )}
                        aria-label={`${step.title} - ${index === currentStep ? 'Current' : index < currentStep ? 'Completed' : 'Upcoming'
                            }`}
                    />
                ))}
            </div>
        );
    }

    if (variant === 'numbered') {
        return (
            <div className={cn('w-full', className)}>
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const isActive = index === currentStep;
                        const isCompleted = step.completed;
                        const isClickable = allowStepNavigation && (isCompleted || index <= currentStep);

                        return (
                            <div key={step.id} className="flex flex-1 items-center">
                                {/* Step circle */}
                                <div className="relative flex flex-col items-center">
                                    <button
                                        type="button"
                                        onClick={() => isClickable && onStepClick?.(index)}
                                        disabled={!isClickable}
                                        className={cn(
                                            'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                                            isActive &&
                                            'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200',
                                            isCompleted &&
                                            !isActive &&
                                            'border-green-500 bg-green-500 text-white',
                                            !isActive && !isCompleted && 'border-gray-300 bg-white text-gray-500',
                                            isClickable && 'cursor-pointer hover:scale-110',
                                            !isClickable && 'cursor-default'
                                        )}
                                        aria-label={step.title}
                                    >
                                        {isCompleted && !isActive ? (
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        ) : showStepNumbers ? (
                                            index + 1
                                        ) : null}
                                    </button>

                                    {/* Step title */}
                                    {showStepTitles && (
                                        <span
                                            className={cn(
                                                'mt-2 text-xs font-medium transition-colors',
                                                isActive && 'text-blue-600',
                                                isCompleted && !isActive && 'text-green-600',
                                                !isActive && !isCompleted && 'text-gray-500'
                                            )}
                                        >
                                            {step.title}
                                        </span>
                                    )}
                                </div>

                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div className="mx-2 h-0.5 flex-1 bg-gray-300">
                                        <div
                                            className={cn(
                                                'h-full transition-all duration-300',
                                                isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                            )}
                                            style={{ width: isCompleted ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
}
