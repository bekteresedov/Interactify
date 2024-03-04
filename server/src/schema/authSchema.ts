import Joi from 'joi';

export const loginSchema = Joi.object({
    username: Joi.string().trim().required().min(4).max(20).messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 4 characters long',
        'string.max': 'Username cannot exceed 20 characters',
        'any.required': 'Username is required'
    }),
    email: Joi.string().trim().email().required().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().trim().required().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
        'any.required': 'Password is required'
    }),
});


export const registerSchema = Joi.object({
    username: Joi.string().trim().required().min(4).max(20).messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 4 characters long',
        'string.max': 'Username cannot exceed 20 characters',
        'any.required': 'Username is required'
    }),
    email: Joi.string().trim().email().required().messages({
        'string.base': 'Email must be a string',
        'string.empty': 'Email is required',
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().trim().required().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')).messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
        'any.required': 'Password is required'
    }),
    birth: Joi.object({
        day: Joi.number().required().min(1).max(31).messages({
            'number.base': 'Day must be a number',
            'number.empty': 'Day is required',
            'number.min': 'Day must be at least 1',
            'number.max': 'Day cannot exceed 31',
            'any.required': 'Day is required'
        }),
        month: Joi.number().required().min(1).max(12).messages({
            'number.base': 'Month must be a number',
            'number.empty': 'Month is required',
            'number.min': 'Month must be at least 1',
            'number.max': 'Month cannot exceed 12',
            'any.required': 'Month is required'
        }),
        year: Joi.number().required().min(1000).max(2024).messages({
            'number.base': 'Year must be a number',
            'number.empty': 'Year is required',
            'number.min': 'Year must be at least 1000',
            'number.max': 'Year cannot exceed 2024',
            'any.required': 'Year is required'
        })
    }).required().messages({
        'object.base': 'Birth must be an object',
        'object.empty': 'Birth object cannot be empty',
        'any.required': 'Birth is required'
    }),
    name: Joi.string().trim().required().min(3).max(20).messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 20 characters',
        'any.required': 'Name is required'
    }),
    surname: Joi.string().trim().required().min(3).max(30).messages({
        'string.base': 'Surname must be a string',
        'string.empty': 'Surname is required',
        'string.min': 'Surname must be at least 3 characters long',
        'string.max': 'Surname cannot exceed 30 characters',
        'any.required': 'Surname is required'
    })
});

