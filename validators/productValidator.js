const {body} = require('express-validator');

const createProductRules = [
    body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min:3, max: 50 })
    .withMessage('Name cannot exceed 50 characters and be less than 3 characters'),
    body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({min:3, max:100})
    .withMessage('Description cannot exceed 100 characters and be less than 3 characters')
    .isString()
    .withMessage('Description must be a string'),
    body('price')
    .isDecimal()
    .withMessage('Price must be a decimal')
    .notEmpty()
    .withMessage('Price required'),
    body('stock')
    .notEmpty()
    .withMessage('Stock information is required')
    .isInt()
    .withMessage('Stock must be a number')
];

module.exports = createProductRules;    