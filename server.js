const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Test route (for verifying server is up and running)
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Customer International Payments Portal API is running" });
});

//Only runs if the module is run directly (not in tests)
if (require.main === module) {
  // Load environment variables from the .env file
  dotenv.config();
  // Connect to MongoDB
  connectDB();

  // Create an HTTPS server
  const server = https.createServer(
    {
      key: fs.readFileSync("./keys/privatekey.pem"),
      cert: fs.readFileSync("./keys/certificate.pem"),
    },
    app
  );

  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Export the server for production
  module.exports = server;
} else {
  // Export the server for testing
  const server = app;
  module.exports = server;
}
