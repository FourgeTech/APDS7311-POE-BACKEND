const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Initialize Express app
const server = express();

// Test route (for verifying server is up and running)
server.get('/', (req, res) => {
    res.status(200).json({ message: 'Customer International Payments Portal API is running' });
});

//Only runs if the module is run directly (not in tests)
if (require.main === module) {
  // Load environment variables from the .env file
  dotenv.config();
  // Connect to MongoDB
  connectDB();
  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the server for testing
module.exports = server;