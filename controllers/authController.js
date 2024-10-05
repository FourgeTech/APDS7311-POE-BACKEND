const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Example Secret (should store securely in an env variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register user method
exports.register = async (req, res) => {
    const { username, accountNumber, IDNumber, password, firstName, lastName, email } = req.body;

    if (!username || !accountNumber || !IDNumber || !password || !firstName || !lastName || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username, accountNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            username,
            accountNumber,
            IDNumber,
            password,
            firstName,
            lastName,
            email
        });

        // Save the user to the database
        await newUser.save();

        // Send success response
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                // Do not send sensitive info like password
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login user method
exports.login = async (req, res) => {
    const { username, accountNumber, password } = req.body;

    if (!username || !accountNumber || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ username, accountNumber });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or account number' });
        }

        // Compare the password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT payload (include user ID, email, and possibly other data)
        const payload = { userId: user._id, email: user.email, accountNumber: user.accountNumber };
        
         // Sign the JWT token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

        // Send user data back as response (excluding password)
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

