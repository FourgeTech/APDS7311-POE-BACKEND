const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Validation for creating a payment
const paymentValidation = [
  body("customerID")
  .notEmpty().withMessage("Customer ID is required."),

  body("recipientName")
  .notEmpty().withMessage("Recipient name is required.")
  .isAlpha().withMessage("Recipient name must contain only alphabetic characters."),

  body("recipientBank")
  .notEmpty().withMessage("Recipient bank is required.")
  .isAlpha().withMessage("Recipient bank must contain only alphabetic characters."),

  body("paymentAmount")
    .notEmpty().withMessage("Payment amount is required.")
    .isNumeric().withMessage("Payment amount must be a number."),

  body("currency")
  .notEmpty().withMessage("Currency is required."),

  body("provider")
  .notEmpty().withMessage("Provider is required."),

  body("payeeAccountNumber")
    .notEmpty().withMessage("Payee account number is required.")
    .isNumeric().withMessage("Payee account number must be a number.")
    .isLength({ min: 11, max: 11 }).withMessage("Payee account number must be exactly 11 digits long."),

    body('swiftCode').notEmpty().withMessage('SWIFT code is required.')
    .custom(value => {
        const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
        if (value === 'N/A' || swiftCodeRegex.test(value)) {
            return true;
        }
        throw new Error('Invalid SWIFT code format.');
    })
];


const depositValidation = [
  body("customerID")
  .notEmpty().withMessage("Customer ID is required."),
  body('amount')
    .notEmpty().withMessage('Amount is required.')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number.'),
  body('cardNumber')
    .notEmpty().withMessage('Card number is required.')
    .isLength({ min: 16, max: 16 }).withMessage('Card number must be 16 digits long.'),
  body('expiryDate')
    .notEmpty().withMessage('Expiry date is required.')
    .matches(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/).withMessage('Invalid expiry date format.'),
  body('cvv')
    .notEmpty().withMessage('CVV is required.')
    .isLength({ min: 3, max: 4 }).withMessage('CVV must be 3 or 4 digits long.')
];

// Create a new deposit
router.post("/deposit", depositValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  paymentController.createDeposit(req, res);
});


// Create a new payment
router.post("/new", paymentValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  paymentController.createPayment(req, res);
});

// Get payment details by ID
router.get("/:id", paymentController.getPaymentById);

router.get("/customer/:id", paymentController.getPaymentsByUserId);

// Update payment status
router.put("/:id", (req, res) => {
  paymentController.updatePaymentStatus(req, res);
});

router.get("/dashboard/:id", paymentController.getDashboardData);

// Delete a payment
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
