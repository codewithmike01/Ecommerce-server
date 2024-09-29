const jwt = require('jsonwebtoken');
require('dotenv').config('./user-service');

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(405)
      .json({ message: 'Unauthorized user - Missing token' });
  }

  try {
    let tokenVal = token;
    if (token.startsWith('Bearer ')) {
      tokenVal = token.slice(7, token.length).trimLeft();
    }

    const decodedToken = jwt.verify(tokenVal, process.env.JWT_SECRET);

    // Checck if user exist

    // Send user to user req
    req.user = decodedToken;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token has expired
      return res
        .status(401)
        .json({ error: 'Unauthorized - Token expired', isExpired: true });
    }
    // Other JWT verification errors
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

module.exports = { isAuthenticated };
