import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();


const authenticateToken = (req, res, next)=>{
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ensure this is set
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
}

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
    }
    next();
  };
  
export { authenticateToken, authorizeRoles };