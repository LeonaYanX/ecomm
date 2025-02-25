const {body} = require('express-validator');

const createUserRules = [
    body('username')
    .isString()
    .withMessage('Username must be a string')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ max: 50 })
    .withMessage('Username cannot exceed 50 characters'),
    body('email')
    .isEmail()
    .withMessage('Email must be valid')
    .notEmpty()
    .withMessage('Email is required'),
    body('password')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
    body('role')
    .isIn(['customer','admin'])
    .withMessage('Unknown role')
];

module.exports = createUserRules;    