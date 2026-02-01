import { z } from 'zod';

// Bangladesh phone number validation (starts with 01, 11 digits)
const bangladeshPhoneRegex = /^01[0-9]{9}$/;

export const registrationSchema = z.object({
    first_name: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters'),

    last_name: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters'),

    email: z.string()
        .email('Please enter a valid email address'),

    dob: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();

            // Calculate exact age
            const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)
                ? age - 1
                : age;

            return exactAge >= 13;
        }, 'You must be at least 13 years old to register'),

    password: z.string()
        .min(1, 'Password is required'),

    password_confirmation: z.string(),

    city: z.string()
        .min(2, 'City name must be at least 2 characters')
        .max(50, 'City name must be less than 50 characters'),

    division: z.enum(
        ['Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'],
        { message: 'Please select a valid division' }
    ),

    gender: z.enum(
        ['male', 'female', 'other'],
        { message: 'Please select a valid gender' }
    ),

    phone: z.string()
        .regex(bangladeshPhoneRegex, 'Phone number must be 11 digits starting with 01'),

    image: z.any().optional().nullable(),

    referred_by: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
