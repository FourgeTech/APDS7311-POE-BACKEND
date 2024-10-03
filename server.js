const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const https = require("https");
const fs = require("fs");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to secure the Express app
app.use(helmet());

// Rate limiter middleware to prevent brute-force attacks
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 6, // Each IP is allowed 6 requests per minute
  message: 'Too many requests from this IP, please try again later',
});

app.use(globalLimiter); // Apply Global Limiter to all requests

// Enable CORS for all routes and methods
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests only from this origin (Vite dev server)
  credentials: true,               // Allow credentials (cookies, authorization headers, etc.)
}));

// Middleware to parse URL-encoded data (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Test route (for verifying server is up and running)
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Customer International Payments Portal API is running" });
});

app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);

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