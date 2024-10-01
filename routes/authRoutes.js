const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

//Validation for the login route
const loginValidation = [
    body('username')
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 6}).withMessage('Username must be at least 6 characters long.')
        .isLength({ max: 15}).withMessage('Username must be at most 15 characters long.'),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
    body('accountNumber')
        .notEmpty().withMessage('Account number is required.')
        .isNumeric().withMessage('Account number must be a number.')
        .isLength({ min: 11, max: 11 }).withMessage('Account number must be exactly 11 digits long.'),
];

//Validation for the register route
const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username is required.')
        .isLength({ min: 6}).withMessage('Username must be at least 6 characters long.')
        .isLength({ max: 15}).withMessage('Username must be at most 15 characters long.'),
    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
    body('accountNumber')
        .notEmpty().withMessage('Account number is required.')
        .isNumeric().withMessage('Account number must be a number.')
        .isLength({ min: 11, max: 11 }).withMessage('Account number must be exactly 11 digits long.'),
    body('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Email must be a valid email address.'),
    body('firstName')
        .notEmpty().withMessage('First mame is required.')
        .isAlpha().withMessage('First name must contain only alphabetic characters.'),
    body('lastName')
        .notEmpty().withMessage('Last name is required.')
        .isAlpha().withMessage('Last name must contain only alphabetic characters.'),
        body('IdNumber')
        .notEmpty().withMessage('ID Number is required.')
        .isNumeric().withMessage('ID Number must be a number.')
        .isLength({ min: 13, max: 13 }).withMessage('ID Number must be exactly 13 digits long.'),
];

//User register route
router.post('/register', registerValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    authController.register(req, res);
});

//User login route
router.post('/login', loginValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    authController.login(req, res);
});

// Define the POST /login route
// router.post('/login', authController.login);

// Define the POST /register route
//router.post('/register', authController.register);

module.exports = router;