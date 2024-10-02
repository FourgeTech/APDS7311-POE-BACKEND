const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Validation for creating a payment
const paymentValidation = [
  body("customerID")
  .notEmpty().withMessage("Customer ID is required."),

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

  body("swiftCode")
  .notEmpty().withMessage("SWIFT code is required.")
  .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/).withMessage("Invalid SWIFT code format."),
];

// Create a new payment
router.post("/create", paymentValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  paymentController.createPayment(req, res);
});

// Get payment details by ID
router.get("/:id", paymentController.getPaymentById);

// Update payment status
router.put("/:id", (req, res) => {
  paymentController.updatePaymentStatus(req, res);
});

// Delete a payment
router.delete("/:id", paymentController.deletePayment);

module.exports = router;
