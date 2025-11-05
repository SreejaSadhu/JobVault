import express from "express";
import bcrypt from "bcrypt";
import { Admin } from "../models/admin.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";


const adminRouter = express.Router();

// Admin verification middleware
const verifyAdmin = async (req, res, next) => {
  try {
    console.log("Verifying admin token...");
    console.log("All cookies:", req.cookies);
    
    const token = req.cookies.token;
    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ status: false, message: "No Token" });
    }
    
    console.log("Token found, verifying...");
    const decoded = jwt.verify(token, process.env.KEY);
    
    // Check if user is admin
    if (!decoded.isAdmin) {
      console.log("User is not admin");
      return res.status(403).json({ status: false, message: "Admin access required" });
    }
    
    console.log("Admin token verified successfully for user:", decoded._id);
    req.admin = decoded; // Add decoded admin info to request
    next();
  } catch (err) {
    console.error("Admin token verification error:", err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ status: false, message: "Token Expired" });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ status: false, message: "Invalid Token" });
    } else {
      return res.status(401).json({ status: false, message: "Token Verification Failed" });
    }
  }
};

// Admin verification endpoint
adminRouter.get("/verify", verifyAdmin, (req, res) => {
  return res.json({ status: true, message: "Admin Authorized" });
});

// Admin current user endpoint
adminRouter.get("/currentAdmin", verifyAdmin, async (req, res) => {
  try {
    const adminId = req.admin._id;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ status: false, message: "Admin not found" });
    }
    return res.json({ status: true, admin });
  } catch (error) {
    console.error("Error fetching current admin:", error);
    return res.status(500).json({ status: false, message: "Error fetching admin data" });
  }
});

// Admin Registration API
adminRouter.post("/register", async (req, res) => {
  const { name, email, password, adminCode } = req.body;

  if (!name || !email || !password || !adminCode) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (adminCode !== "ADMIN_SECRET") {
    return res.status(400).json({ message: "Invalid admin code" });
  }

  const existingUser = await Admin.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const hashpassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      email,
      password: hashpassword,
      adminCode
    });

    await newAdmin.save();
    return res.json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Admin login attempt for email:", email);
    
    const user = await Admin.findOne({ email });
    console.log("Found admin user:", user ? "Yes" : "No");

    if (!user) {
      console.log("Invalid Admin User - User not found");
      return res.status(401).json({ message: "Invalid User" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password validation:", validPassword ? "Success" : "Failed");
    
    if (!validPassword) {
      console.log("Password Incorrect");
      return res.status(401).json({ message: "Password Incorrect" });
    }

    // Check if user is admin (handle both string and boolean values)
    const isAdmin = user.isAdmin === "1" || user.isAdmin === 1 || user.isAdmin === true;
    console.log("Is admin check:", isAdmin);

    if (!isAdmin) {
      console.log("User is not admin");
      return res.status(403).json({ message: "Admin access required" });
    }

    const token = jwt.sign(
      { _id: user._id, username: user.name, isAdmin: true },
      process.env.KEY,
      { expiresIn: "1h" }
    );

    // Set cookie with proper duration and settings
    res.cookie("token", token, { 
      httpOnly: true, 
      maxAge: 3600000, // 1 hour (matches JWT expiry)
      secure: true, // Always use secure for cross-origin requests
      sameSite: 'none'
    });

    console.log("Admin login successful for:", user.email);
    return res.json({ 
      message: "Admin", 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email,
        isAdmin: true
      } 
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to assign viewer role to a user
adminRouter.post("/assignViewerRole", verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "viewer";
    await user.save();

    return res.json({ 
      message: "Viewer role assigned successfully", 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error("Error assigning viewer role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to remove viewer role from a user
adminRouter.post("/removeViewerRole", verifyAdmin, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "student";
    await user.save();

    return res.json({ 
      message: "Viewer role removed successfully", 
      user: { 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error("Error removing viewer role:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get all users with their roles
adminRouter.get("/getUsersWithRoles", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'name email role sapId stream');
    return res.json({ users });
  } catch (error) {
    console.error("Error fetching users with roles:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { adminRouter };
  