const User = require('../models/userModel');

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