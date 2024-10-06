const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header (Bearer Token)
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access Denied, Token missing' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach the decoded user data to the request object
    req.user = decoded;
    next();  // Proceed to the next middleware
  } catch (error) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;