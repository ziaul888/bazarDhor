'use client';

import { useState } from 'react';
import { MultiStepForm, FormStep } from '@/components/ui/multi-step-form';
import type { ValidationResult } from '@/components/ui/multi-step-form.types';

// Define the form data type
interface UserRegistrationData {
    // Step 1: Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Step 2: Account Details
    username: string;
    password: string;
    confirmPassword: string;

    // Step 3: Preferences
    interests: string[];
    newsletter: boolean;
    notifications: boolean;
}

export default function MultiStepFormDemo() {
    const [submittedData, setSubmittedData] = useState<UserRegistrationData | null>(null);

    // Step 1 validation
    const validatePersonalInfo = (data: Partial<UserRegistrationData>): ValidationResult => {
        const errors: Record<string, string> = {};

        if (!data.firstName?.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!data.lastName?.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!data.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Invalid email format';
        }

        if (!data.phone?.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(data.phone)) {
            errors.phone = 'Invalid phone number format';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    };

    // Step 2 validation
    const validateAccountDetails = (data: Partial<UserRegistrationData>): ValidationResult => {
        const errors: Record<string, string> = {};

        if (!data.username?.trim()) {
            errors.username = 'Username is required';
        } else if (data.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        }

        if (!data.password?.trim()) {
            errors.password = 'Password is required';
        } else if (data.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (!data.confirmPassword?.trim()) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors,
        };
    };

    // Form submission handler
    const handleSubmit = async (data: UserRegistrationData) => {
        console.log('Form submitted with data:', data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setSubmittedData(data);
    };

    if (submittedData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="mx-auto max-w-2xl">
                    <div className="rounded-xl bg-white p-8 shadow-lg">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg
                                    className="h-8 w-8 text-green-600"
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
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
                            <p className="mt-2 text-gray-600">
                                Your account has been created successfully.
                            </p>
                        </div>

                        <div className="space-y-4 rounded-lg bg-gray-50 p-6">
                            <h3 className="font-semibold text-gray-900">Registration Details:</h3>

                            <div>
                                <p className="text-sm font-medium text-gray-700">Personal Information</p>
                                <p className="text-gray-600">
                                    {submittedData.firstName} {submittedData.lastName}
                                </p>
                                <p className="text-gray-600">{submittedData.email}</p>
                                <p className="text-gray-600">{submittedData.phone}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700">Account Details</p>
                                <p className="text-gray-600">Username: {submittedData.username}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700">Preferences</p>
                                <p className="text-gray-600">
                                    Interests: {submittedData.interests?.join(', ') || 'None selected'}
                                </p>
                                <p className="text-gray-600">
                                    Newsletter: {submittedData.newsletter ? 'Yes' : 'No'}
                                </p>
                                <p className="text-gray-600">
                                    Notifications: {submittedData.notifications ? 'Yes' : 'No'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSubmittedData(null)}
                            className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                        >
                            Create Another Account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-gray-900">Multistep Form Demo</h1>
                <p className="mt-2 text-lg text-gray-600">
                    User Registration with React Activity API
                </p>
                <p className="mt-1 text-sm text-gray-500">
                    Navigate between steps - your data will be preserved!
                </p>
            </div>

            <MultiStepForm<UserRegistrationData>
                initialData={{
                    interests: [],
                    newsletter: false,
                    notifications: true,
                }}
                onSubmit={handleSubmit}
                onStepChange={(step, stepId) => {
                    console.log(`Navigated to step ${step + 1}: ${stepId}`);
                }}
                onValidationError={(errors) => {
                    console.log('Validation errors:', errors);
                }}
                persistKey="user-registration-form"
                enableSessionStorage={true}
                showProgress={true}
                progressPosition="top"
            >
                {/* Step 1: Personal Information */}
                <FormStep
                    id="personal-info"
                    title="Personal Information"
                    description="Please provide your basic information"
                    validate={validatePersonalInfo}
                >
                    {({ data, setFieldValue, errors }) => (
                        <div className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={data.firstName || ''}
                                        onChange={(e) => setFieldValue('firstName', e.target.value)}
                                        className={`mt-1 block w-full rounded-lg border ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                                            } px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="John"
                                    />
                                    {errors.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={data.lastName || ''}
                                        onChange={(e) => setFieldValue('lastName', e.target.value)}
                                        className={`mt-1 block w-full rounded-lg border ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                                            } px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Doe"
                                    />
                                    {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email || ''}
                                    onChange={(e) => setFieldValue('email', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-300'
                                        } px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="john.doe@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={data.phone || ''}
                                    onChange={(e) => setFieldValue('phone', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border ${errors.phone ? 'border-red-300' : 'border-gray-300'
                                        } px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="+1 (555) 123-4567"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                            </div>
                        </div>
                    )}
                </FormStep>

                {/* Step 2: Account Details */}
                <FormStep
                    id="account-details"
                    title="Account Details"
                    description="Create your account credentials"
                    validate={validateAccountDetails}
                >
                    {({ data, setFieldValue, errors }) => (
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={data.username || ''}
                                    onChange={(e) => setFieldValue('username', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border ${errors.username ? 'border-red-300' : 'border-gray-300'
                                        } px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="johndoe123"
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password || ''}
                                    onChange={(e) => setFieldValue('password', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border ${errors.password ? 'border-red-300' : 'border-gray-300'
                                        } px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={data.confirmPassword || ''}
                                    onChange={(e) => setFieldValue('confirmPassword', e.target.value)}
                                    className={`mt-1 block w-full rounded-lg border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        } px-4 py-2.5 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="••••••••"
                                />
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                                <p className="font-medium">Password Requirements:</p>
                                <ul className="mt-2 list-inside list-disc space-y-1">
                                    <li>At least 8 characters long</li>
                                    <li>Mix of uppercase and lowercase letters recommended</li>
                                    <li>Include numbers and special characters for security</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </FormStep>

                {/* Step 3: Preferences */}
                <FormStep
                    id="preferences"
                    title="Preferences"
                    description="Customize your experience (optional)"
                    isOptional={true}
                >
                    {({ data, setFieldValue }) => (
                        <div className="space-y-6">
                            <div>
                                <label className="mb-3 block text-sm font-medium text-gray-700">
                                    Select Your Interests
                                </label>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {['Technology', 'Design', 'Marketing', 'Finance', 'Sports', 'Music'].map(
                                        (interest) => (
                                            <label
                                                key={interest}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 p-3 transition-all hover:border-blue-500 hover:bg-blue-50"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.interests?.includes(interest) || false}
                                                    onChange={(e) => {
                                                        const currentInterests = data.interests || [];
                                                        const newInterests = e.target.checked
                                                            ? [...currentInterests, interest]
                                                            : currentInterests.filter((i) => i !== interest);
                                                        setFieldValue('interests', newInterests);
                                                    }}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700">{interest}</span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-gray-200 p-4">
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.newsletter || false}
                                        onChange={(e) => setFieldValue('newsletter', e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Subscribe to Newsletter</span>
                                        <p className="text-sm text-gray-600">
                                            Receive weekly updates about new features and content
                                        </p>
                                    </div>
                                </label>

                                <label className="flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={data.notifications || false}
                                        onChange={(e) => setFieldValue('notifications', e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Enable Notifications</span>
                                        <p className="text-sm text-gray-600">
                                            Get notified about important account activities
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="mt-2 text-sm text-gray-600">
                                    You can update these preferences anytime from your account settings
                                </p>
                            </div>
                        </div>
                    )}
                </FormStep>
            </MultiStepForm>
        </div>
    );
}
