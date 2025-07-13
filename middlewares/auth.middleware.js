const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  // Check if User model is available
  if (!User) {
    console.error("Auth middleware error: User model is not available");
    return res.status(500).json({ message: "Internal server error: User model not found." });
  }
  try {
    // Check if req and res are defined
    if (!req) {
      console.error("Auth middleware error: req is undefined");
      return res.status(500).json({ message: "Internal server error: Invalid request object." });
    }

    if (!res) {
      console.error("Auth middleware error: res is undefined");
      return;
    }

    // Debug: Log request details
    console.log("Auth middleware - Request headers:", req.headers);
    console.log("Auth middleware - Request body:", req.body);
    console.log("Auth middleware - Request query:", req.query);

    // Get user ID from headers, body, or query params (safe access)
    let userId = req.headers?.["User-Id"] 
      || req.headers?.["user-id"]
      || req.body?.userId 
      || req.query?.userId;

    console.log("Auth middleware - Extracted userId:", userId);

    // DEV ONLY: fallback to a default test user if not provided
    if (!userId && process.env.NODE_ENV !== 'production') {
      console.log("Auth middleware - No userId found, trying fallback...");
      try {
        // Try to find any user as a fallback
        const anyUser = await User.findOne();
        if (anyUser) {
          userId = anyUser._id;
          console.log("Auth middleware - Using fallback userId:", userId);
        } else {
          console.log("Auth middleware - No fallback user found in database");
        }
      } catch (fallbackError) {
        console.error("Auth middleware - Fallback user error:", fallbackError);
      }
    }

    if (!userId) {
      console.log("Auth middleware - No userId available, returning 401");
      return res.status(401).json({ message: "Access denied. User ID required. Please send 'User-Id' header or userId in body/query." });
    }

    try {
      const user = await User.findById(userId).select("-password");
      if (!user) {
        console.log("Auth middleware - User not found for userId:", userId);
        return res.status(401).json({ message: "Invalid user ID. User not found." });
      }

      if (user.isBlocked) {
        console.log("Auth middleware - User is blocked:", userId);
        return res.status(403).json({ message: "Account is blocked. Contact support." });
      }

      console.log("Auth middleware - User authenticated successfully:", user._id);
      req.user = user;
      next();
    } catch (dbError) {
      console.error("Auth middleware - Database error:", dbError);
      return res.status(500).json({ message: "Internal server error: Database operation failed." });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = authMiddleware; 