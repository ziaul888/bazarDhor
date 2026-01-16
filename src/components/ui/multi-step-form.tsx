'use client';

import React, { Children, isValidElement, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useMultiStepForm } from '@/hooks/use-multi-step-form';
import { FormProgress } from './form-progress';
import { FormNavigation } from './form-navigation';
import { FormStep, FormStepRenderer } from './form-step';
import type {
    MultiStepFormProps,
    FormStepProps,
    StepConfig,
    FormStepContext,
} from './multi-step-form.types';

/**
 * Main MultiStepForm component
 * Orchestrates the entire multistep form experience with Activity API integration
 */
export function MultiStepForm<T = any>({
    children,
    initialData,
    onSubmit,
    onStepChange,
    onValidationError,
    persistKey,
    className,
    enableSessionStorage = true,
    validateOnChange = false,
    showProgress = true,
    progressPosition = 'top',
}: MultiStepFormProps<T>) {
    // Extract step configurations from children
    const stepConfigs = useMemo(() => {
        const configs: StepConfig<T>[] = [];

        Children.forEach(children, (child) => {
            if (isValidElement(child) && child.type === FormStep) {
                const props = child.props as FormStepProps<T>;
                configs.push({
                    id: props.id,
                    title: props.title,
                    description: props.description,
                    validate: props.validate,
                    isOptional: props.isOptional,
                    shouldShow: props.shouldShow,
                });
            }
        });

        return configs;
    }, [children]);

    // Initialize form state with custom hook
    const {
        currentStep,
        totalSteps,
        formData,
        errors,
        isValidating,
        isSubmitting,
        isFirstStep,
        isLastStep,
        canGoNext,
        progress,
        completedSteps,
        goToNext,
        goToPrevious,
        goToStep,
        updateData,
        setFieldValue,
        submitForm,
    } = useMultiStepForm<T>({
        steps: stepConfigs,
        initialData,
        onSubmit,
        onStepChange,
        onValidationError,
        persistKey,
        enableSessionStorage,
    });

    // Prepare step renderers
    const stepElements = useMemo(() => {
        const elements: React.ReactElement[] = [];

        Children.forEach(children, (child) => {
            if (isValidElement(child) && child.type === FormStep) {
                elements.push(child as React.ReactElement);
            }
        });

        return elements;
    }, [children]);

    // Filter visible steps based on shouldShow condition
    const visibleStepElements = useMemo(() => {
        return stepElements.filter((element, index) => {
            const config = stepConfigs[index];
            if (!config?.shouldShow) return true;
            return config.shouldShow(formData);
        });
    }, [stepElements, stepConfigs, formData]);

    // Prepare progress steps
    const progressSteps = useMemo(() => {
        return stepConfigs.map((config, index) => ({
            id: config.id,
            title: config.title,
            completed: completedSteps.has(index),
        }));
    }, [stepConfigs, completedSteps]);

    // Create context for current step
    const currentStepContext: FormStepContext<T> = {
        data: formData,
        updateData,
        setFieldValue,
        errors,
        isValidating,
        currentStep,
        totalSteps,
    };

    const progressComponent = showProgress && (
        <FormProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={progressSteps}
            variant="numbered"
            showStepNumbers
            showStepTitles
            className="mb-8"
        />
    );

    return (
        <div className={cn('w-full max-w-3xl mx-auto', className)}>
            {/* Progress indicator at top */}
            {progressPosition === 'top' && progressComponent}

            {/* Form container */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                {/* Current step header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {stepConfigs[currentStep]?.title}
                    </h2>
                    {stepConfigs[currentStep]?.description && (
                        <p className="mt-2 text-sm text-gray-600">
                            {stepConfigs[currentStep].description}
                        </p>
                    )}
                </div>

                {/* Error display */}
                {errors._general && (
                    <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-800">
                        <div className="flex items-center gap-2">
                            <svg
                                className="h-5 w-5 text-red-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{errors._general}</span>
                        </div>
                    </div>
                )}

                {/* Step content with Activity API */}
                <div className="min-h-[300px]">
                    {visibleStepElements.map((element, index) => {
                        const props = element.props as FormStepProps<T>;
                        const isActive = index === currentStep;

                        return (
                            <FormStepRenderer
                                key={props.id}
                                isActive={isActive}
                                context={currentStepContext}
                            >
                                {props.children}
                            </FormStepRenderer>
                        );
                    })}
                </div>

                {/* Navigation controls */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <FormNavigation
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                        isFirstStep={isFirstStep}
                        isLastStep={isLastStep}
                        isValidating={isValidating}
                        isSubmitting={isSubmitting}
                        canGoNext={canGoNext}
                        onPrevious={goToPrevious}
                        onNext={goToNext}
                        onSubmit={submitForm}
                    />
                </div>
            </div>

            {/* Progress indicator at bottom */}
            {progressPosition === 'bottom' && <div className="mt-8">{progressComponent}</div>}
        </div>
    );
}

// Export child components for convenience
export { FormStep } from './form-step';
export { FormProgress } from './form-progress';
export { FormNavigation } from './form-navigation';
export * from './multi-step-form.types';
