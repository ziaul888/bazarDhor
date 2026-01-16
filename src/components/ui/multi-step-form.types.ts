import { ReactNode } from 'react';

/**
 * Validation result from step or form validation
 */
export interface ValidationResult {
    isValid: boolean;
    errors?: Record<string, string>;
    message?: string;
}

/**
 * Configuration for a single form step
 */
export interface StepConfig<T = any> {
    id: string;
    title: string;
    description?: string;
    validate?: (data: Partial<T>) => ValidationResult | Promise<ValidationResult>;
    isOptional?: boolean;
    shouldShow?: (data: Partial<T>) => boolean;
}

/**
 * Props for individual form step component
 */
export interface FormStepProps<T = any> {
    id: string;
    title: string;
    description?: string;
    validate?: (data: Partial<T>) => ValidationResult | Promise<ValidationResult>;
    isOptional?: boolean;
    shouldShow?: (data: Partial<T>) => boolean;
    children: (context: FormStepContext<T>) => ReactNode;
}

/**
 * Context provided to form step children
 */
export interface FormStepContext<T = any> {
    data: Partial<T>;
    updateData: (updates: Partial<T>) => void;
    setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
    errors: Record<string, string>;
    isValidating: boolean;
    currentStep: number;
    totalSteps: number;
}

/**
 * Props for the main MultiStepForm component
 */
export interface MultiStepFormProps<T = any> {
    children: ReactNode;
    initialData?: Partial<T>;
    onSubmit: (data: T) => void | Promise<void>;
    onStepChange?: (step: number, stepId: string) => void;
    onValidationError?: (errors: Record<string, string>) => void;
    persistKey?: string; // Key for session storage persistence
    className?: string;
    enableSessionStorage?: boolean;
    validateOnChange?: boolean;
    showProgress?: boolean;
    progressPosition?: 'top' | 'bottom';
}

/**
 * Props for form navigation component
 */
export interface FormNavigationProps {
    currentStep: number;
    totalSteps: number;
    isFirstStep: boolean;
    isLastStep: boolean;
    isValidating: boolean;
    isSubmitting: boolean;
    canGoNext: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: () => void;
    previousLabel?: string;
    nextLabel?: string;
    submitLabel?: string;
    className?: string;
    previousButtonClassName?: string;
    nextButtonClassName?: string;
    submitButtonClassName?: string;
    hideNavigation?: boolean;
}

/**
 * Props for form progress indicator
 */
export interface FormProgressProps {
    currentStep: number;
    totalSteps: number;
    steps: Array<{ id: string; title: string; completed: boolean }>;
    showStepNumbers?: boolean;
    showStepTitles?: boolean;
    variant?: 'linear' | 'dots' | 'numbered';
    className?: string;
    onStepClick?: (stepIndex: number) => void;
    allowStepNavigation?: boolean;
}

/**
 * Internal state for the multistep form
 */
export interface MultiStepFormState<T = any> {
    currentStep: number;
    formData: Partial<T>;
    errors: Record<string, string>;
    visited: Set<number>;
    isValidating: boolean;
    isSubmitting: boolean;
    completedSteps: Set<number>;
}

/**
 * Return type for useMultiStepForm hook
 */
export interface UseMultiStepFormReturn<T = any> {
    currentStep: number;
    totalSteps: number;
    formData: Partial<T>;
    errors: Record<string, string>;
    isValidating: boolean;
    isSubmitting: boolean;
    isFirstStep: boolean;
    isLastStep: boolean;
    canGoNext: boolean;
    progress: number;
    visited: Set<number>;
    completedSteps: Set<number>;
    goToStep: (step: number) => void;
    goToNext: () => Promise<void>;
    goToPrevious: () => void;
    updateData: (updates: Partial<T>) => void;
    setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
    validateCurrentStep: () => Promise<boolean>;
    submitForm: () => Promise<void>;
    reset: () => void;
}
