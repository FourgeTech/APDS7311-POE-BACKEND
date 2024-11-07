const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to secure the Express app
app.use(helmet());

// Trust Vercel’s proxy and handle CORS
app.set('trust proxy', 1);
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-production-url.com'],
  credentials: true,
}));

// Rate limiter middleware
const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Each IP is allowed 30 requests per minute
  message: 'Too many requests from this IP, please try again later',
});
app.use(globalLimiter);

// Connect to MongoDB
dotenv.config();
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Customer International Payments Portal API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
