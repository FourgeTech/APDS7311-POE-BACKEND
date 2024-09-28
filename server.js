const express = require('express');

// Initialize Express app
const server = express();

// Test route (for verifying server is up and running)
server.get('/', (req, res) => {
    res.status(200).json({ message: 'Customer International Payments Portal API is running' });
});

// Start the server
if (require.main === module) {
    // Start the server only if this file is run directly (not in tests)
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}

// Export the server for testing
module.exports = server;