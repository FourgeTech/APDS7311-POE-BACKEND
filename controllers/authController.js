const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

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

        // Send user data back as response (excluding password)
        res.status(200).json({
            message: 'Login successful',
            customerID: user._id,
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                // Do not send sensitive info like password
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

