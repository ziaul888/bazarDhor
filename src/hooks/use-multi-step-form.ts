'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type {
    UseMultiStepFormReturn,
    MultiStepFormState,
    StepConfig,
    ValidationResult,
} from '@/components/ui/multi-step-form.types';

interface UseMultiStepFormOptions<T> {
    steps: StepConfig<T>[];
    initialData?: Partial<T>;
    onSubmit: (data: T) => void | Promise<void>;
    onStepChange?: (step: number, stepId: string) => void;
    onValidationError?: (errors: Record<string, string>) => void;
    persistKey?: string;
    enableSessionStorage?: boolean;
}

/**
 * Custom hook for managing multistep form state and logic
 */
export function useMultiStepForm<T = any>(
    options: UseMultiStepFormOptions<T>
): UseMultiStepFormReturn<T> {
    const {
        steps,
        initialData = {},
        onSubmit,
        onStepChange,
        onValidationError,
        persistKey,
        enableSessionStorage = true,
    } = options;

    const storageKey = persistKey || 'multistep-form-data';
    const isInitialized = useRef(false);

    // Initialize form state with session storage if available
    const getInitialState = useCallback((): MultiStepFormState<T> => {
        if (enableSessionStorage && typeof window !== 'undefined') {
            try {
                const stored = sessionStorage.getItem(storageKey);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return {
                        ...parsed,
                        visited: new Set(parsed.visited || []),
                        completedSteps: new Set(parsed.completedSteps || []),
                        isValidating: false,
                        isSubmitting: false,
                    };
                }
            } catch (error) {
                console.warn('Failed to load form data from session storage:', error);
            }
        }

        return {
            currentStep: 0,
            formData: initialData,
            errors: {},
            visited: new Set([0]),
            isValidating: false,
            isSubmitting: false,
            completedSteps: new Set(),
        };
    }, [enableSessionStorage, storageKey, initialData]);

    const [state, setState] = useState<MultiStepFormState<T>>(getInitialState);

    // Persist to session storage when state changes
    useEffect(() => {
        if (!isInitialized.current) {
            isInitialized.current = true;
            return;
        }

        if (enableSessionStorage && typeof window !== 'undefined') {
            try {
                const toStore = {
                    currentStep: state.currentStep,
                    formData: state.formData,
                    errors: state.errors,
                    visited: Array.from(state.visited),
                    completedSteps: Array.from(state.completedSteps),
                };
                sessionStorage.setItem(storageKey, JSON.stringify(toStore));
            } catch (error) {
                console.warn('Failed to save form data to session storage:', error);
            }
        }
    }, [state, enableSessionStorage, storageKey]);

    // Filter steps based on shouldShow condition
    const visibleSteps = steps.filter((step) => {
        if (!step.shouldShow) return true;
        return step.shouldShow(state.formData);
    });

    const totalSteps = visibleSteps.length;
    const currentStepConfig = visibleSteps[state.currentStep];
    const isFirstStep = state.currentStep === 0;
    const isLastStep = state.currentStep === totalSteps - 1;

    // Calculate progress percentage
    const progress = totalSteps > 0 ? ((state.currentStep + 1) / totalSteps) * 100 : 0;

    // Update form data
    const updateData = useCallback((updates: Partial<T>) => {
        setState((prev) => ({
            ...prev,
            formData: { ...prev.formData, ...updates },
            errors: {}, // Clear errors when data changes
        }));
    }, []);

    // Set individual field value
    const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
        setState((prev) => ({
            ...prev,
            formData: { ...prev.formData, [field]: value },
            errors: { ...prev.errors, [field as string]: '' }, // Clear field error
        }));
    }, []);

    // Validate current step
    const validateCurrentStep = useCallback(async (): Promise<boolean> => {
        if (!currentStepConfig) return false;

        // Skip validation if step is optional and has no data
        if (currentStepConfig.isOptional) {
            return true;
        }

        if (!currentStepConfig.validate) {
            return true;
        }

        setState((prev) => ({ ...prev, isValidating: true }));

        try {
            const result: ValidationResult = await currentStepConfig.validate(state.formData);

            setState((prev) => ({
                ...prev,
                isValidating: false,
                errors: result.errors || {},
            }));

            if (!result.isValid && result.errors) {
                onValidationError?.(result.errors);
            }

            return result.isValid;
        } catch (error) {
            console.error('Validation error:', error);
            setState((prev) => ({
                ...prev,
                isValidating: false,
                errors: { _general: 'Validation failed' },
            }));
            return false;
        }
    }, [currentStepConfig, state.formData, onValidationError]);

    // Navigate to specific step
    const goToStep = useCallback(
        (step: number) => {
            if (step < 0 || step >= totalSteps) return;

            setState((prev) => ({
                ...prev,
                currentStep: step,
                visited: new Set([...prev.visited, step]),
                errors: {},
            }));

            const stepId = visibleSteps[step]?.id;
            if (stepId) {
                onStepChange?.(step, stepId);
            }
        },
        [totalSteps, visibleSteps, onStepChange]
    );

    // Go to next step
    const goToNext = useCallback(async () => {
        const isValid = await validateCurrentStep();

        if (isValid && !isLastStep) {
            setState((prev) => ({
                ...prev,
                completedSteps: new Set([...prev.completedSteps, state.currentStep]),
            }));
            goToStep(state.currentStep + 1);
        }
    }, [validateCurrentStep, isLastStep, goToStep, state.currentStep]);

    // Go to previous step
    const goToPrevious = useCallback(() => {
        if (!isFirstStep) {
            goToStep(state.currentStep - 1);
        }
    }, [isFirstStep, goToStep, state.currentStep]);

    // Submit form
    const submitForm = useCallback(async () => {
        const isValid = await validateCurrentStep();

        if (!isValid) return;

        setState((prev) => ({ ...prev, isSubmitting: true }));

        try {
            await onSubmit(state.formData as T);

            // Clear session storage on successful submit
            if (enableSessionStorage && typeof window !== 'undefined') {
                sessionStorage.removeItem(storageKey);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setState((prev) => ({
                ...prev,
                errors: { _general: 'Submission failed' },
            }));
        } finally {
            setState((prev) => ({ ...prev, isSubmitting: false }));
        }
    }, [validateCurrentStep, onSubmit, state.formData, enableSessionStorage, storageKey]);

    // Reset form
    const reset = useCallback(() => {
        setState({
            currentStep: 0,
            formData: initialData,
            errors: {},
            visited: new Set([0]),
            isValidating: false,
            isSubmitting: false,
            completedSteps: new Set(),
        });

        if (enableSessionStorage && typeof window !== 'undefined') {
            sessionStorage.removeItem(storageKey);
        }
    }, [initialData, enableSessionStorage, storageKey]);

    // Check if can proceed to next step
    const canGoNext = !state.isValidating && !state.isSubmitting;

    return {
        currentStep: state.currentStep,
        totalSteps,
        formData: state.formData,
        errors: state.errors,
        isValidating: state.isValidating,
        isSubmitting: state.isSubmitting,
        isFirstStep,
        isLastStep,
        canGoNext,
        progress,
        visited: state.visited,
        completedSteps: state.completedSteps,
        goToStep,
        goToNext,
        goToPrevious,
        updateData,
        setFieldValue,
        validateCurrentStep,
        submitForm,
        reset,
    };
}
