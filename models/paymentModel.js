const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    customerID: {
        type: String,
        required: true,
        trim: true,
    },
    recipientName:{
        type: String,
        required: true,
        trim: true,
    },
    recipientBank: {
        type: String,
        required: true,
        trim: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
        trim: true,
    },
    currency: {
        type: String,
        enum: [
            'ZAR', 'USD', 'GBP', 'EUR', 'JPY', 'CHF', 'AUD', 'CNY', 'INR', 'BZR', 
            'SEK', 'HKD', 'CAD', 'NZD', 'SGD', 'NOK', 'MXN', 'BRL', 'RUB', 'KRW', 
            'TRY', 'IDR', 'PLN', 'THB', 'MYR', 'PHP', 'CZK', 'HUF', 'ILS', 'CLP', 
            'PKR', 'EGP', 'NGN', 'BDT', 'VND', 'COP', 'SAR', 'AED', 'QAR', 'KWD'
        ],
        required: true,
        default: 'ZAR',
    },
    provider: {
        type: String,
        enum: ['SWIFT', 'Other'],
        default: 'SWIFT',
        required: true,
        trim: true,
    },
    payeeAccountNumber: {
        type: String,
        required: true,
        trim: true,
    },
    swiftCode: {
        type: String,
        required: true,
        trim: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Submitted'],
        default: 'Pending',
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    verifiedAt: {
        type: Date,
    },
    verifiedBy:{
        type: String,
    },
    submittedToSWIFTAt: {
        type: Date,
    },
    submittedByEmployee: {
        type: String,
    },
});

module.exports = mongoose.model('Payment', paymentSchema);
