const Payment = require('../models/paymentModel');
const User = require('../models/userModel');

// Create a new payment
exports.createPayment = async (req, res) => {
    const { customerID, recipientName, recipientBank, paymentAmount, currency, provider, payeeAccountNumber, swiftCode } = req.body;

    if (!customerID || !recipientName || !recipientBank ||!paymentAmount || !currency || !provider || !payeeAccountNumber || !swiftCode) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newPayment = new Payment({
            customerID,
            recipientName,
            recipientBank,
            paymentAmount,
            currency,
            provider,
            payeeAccountNumber,
            swiftCode: swiftCode === "N/A" ? "XXXXXXXX" : swiftCode,
            createdAt: Date.now(),
        });

        await newPayment.save();

        // Update the user's balances and total sent
        const user = await User.findById(customerID);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.availableBalance -= paymentAmount;
        user.totalSent += paymentAmount;

        await user.save();

        res.status(201).json({
            message: 'Payment created successfully',
            payment: newPayment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get payment details by ID
exports.getPaymentById = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { paymentStatus, verifiedBy, submittedBy } = req.body;

    try {
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.paymentStatus = paymentStatus || payment.paymentStatus;
        payment.verifiedBy = verifiedBy || payment.verifiedBy;
        payment.submittedBy = submittedBy || payment.submittedBy;

        if (paymentStatus === 'Verified') {
            payment.verifiedAt = new Date();
        } else if (paymentStatus === 'Submitted') {
            payment.submittedToSWIFTAt = new Date();
            const user = await User.findById(payment.customerID);
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            user.latestBalance -= payment.paymentAmount;
            await user.save();
        }

        await payment.save();

        res.status(200).json({
            message: 'Payment status updated successfully',
            payment
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a payment
exports.deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        await payment.deleteOne();

        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get payments by User ID
exports.getPaymentsByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const payments = await Payment.find({ customerID: user.customerID });
        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this user' });
        }

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//Gets dashboard data
exports.getDashboardData = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Fetch user data using the document ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Prepare dashboard data
      const dashboardData = {
        accountNumber: user.accountNumber,
        availableBalance: user.availableBalance,
        latestBalance: user.latestBalance,
        totalSent: user.totalSent,
        totalReceived: user.totalReceived
      };
  
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };                      