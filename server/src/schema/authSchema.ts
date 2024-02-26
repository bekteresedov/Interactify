import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    username: yup.string().required('Username is required').min(4, 'Username must be at least 4 characters').max(20, 'Username cannot exceed 20 characters'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string()
        .required('Password is required')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one digit')
        .min(8, 'Password must be at least 8 characters long')
});

