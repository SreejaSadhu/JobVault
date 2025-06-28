import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Company } from "../models/Company.js";
import { Interview } from "../models/Experience.js";
import { Admin } from "../models/admin.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

//---------------------------------------------USER ENDPOINTS--------------------------------------------------//

// User Registration API

router.post("/register", async (req, res) => {
  const {
    name,
    email,
    password,
    contactNumber,
    sapId,
    rollNo,
    gender,
    dob,
    tenthPercentage,
    tenthSchool,
    twelfthPercentage,
    twelfthCollege,
    graduationCollege,
    graduationCGPA,
    stream,
    sixthSemesterCGPA,
    isAdmin,
  } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.json({ message: "User already existed" });
  }

  const hashpassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    email,
    password: hashpassword,
    contactNumber,
    sapId,
    rollNo,
    gender,
    dob,
    tenthPercentage,
    tenthSchool,
    twelfthPercentage,
    twelfthCollege,
    graduationCollege,
    graduationCGPA,
    stream,
    sixthSemesterCGPA,
    isAdmin,
  });

  await newUser.save();
  return res.json({ message: "User Registered" });
});

//User and Admin Login API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt for email:", email);
  
  const user = await User.findOne({ email });

  if (!user) {
    console.log("Invalid User");
    return res.json("Invalid User");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    console.log("Password Incorrect");
    return res.json("Password Incorrect");
  }

  console.log("Password valid, creating token for user:", user._id);

  const token = jwt.sign(
    { _id: user._id, username: user.username },
    process.env.KEY,
    { expiresIn: "1h" }
  );

  console.log("Token created, setting cookie");
  res.cookie("token", token, { 
    httpOnly: true, 
    maxAge: 3600000,
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'lax' // Allow cross-site requests
  });

  console.log("Login successful, returning user data");
  return res.json(user);
});

// Middleware function to verify the authenticity of a user's token before granting access to protected routes.
const verifyUser = async (req, res, next) => {
  try {
    console.log("Verifying user token...");
    console.log("All cookies:", req.cookies);
    
    const token = req.cookies.token;
    if (!token) {
      console.log("No token found in cookies");
      return res.json({ status: false, message: "No Token" });
    }
    
    console.log("Token found, verifying...");
    const decoded = jwt.verify(token, process.env.KEY);
    console.log("Token verified successfully for user:", decoded._id);
    req.user = decoded; // Add decoded user info to request
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    if (err.name === 'TokenExpiredError') {
      return res.json({ status: false, message: "Token Expired" });
    } else if (err.name === 'JsonWebTokenError') {
      return res.json({ status: false, message: "Invalid Token" });
    } else {
      return res.json({ status: false, message: "Token Verification Failed" });
    }
  }
};

// Route to verify the authenticity of a user's token.
// It utilizes the verifyUser middleware to ensure that the user is authenticated.
router.get("/verify", verifyUser, (req, res) => {
  return res.json({ status: true, message: "Authorized" });
});

// Route to fetch the current user's details.
// It verifies the user's token and retrieves the user's information.
router.get("/currentUser", verifyUser, async (req, res) => {
  try {
    // User info is already verified and available from middleware
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    return res.json({ status: true, user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.json({ status: false, message: "Error fetching user data" });
  }
});

// This API is designed to handle the functionality of sending a reset password link via email to the user.
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User not registered" });
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "5m",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "", //The email id you want the mail to be sent from
        pass: "", // Generate a special password from your google account
      },
    });

    var mailOptions = {
      from: "manupalash4@gmail.com",
      to: email,
      subject: "Reset Password Link",
      text: `http://localhost:3000/resetPassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.json({ status: true, message: "Error sending the email" });
      } else {
        return res.json({ status: true, message: "Email Sent" });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

// This API endpoint is responsible for resetting the password of a user. It verifies the provided token,
// then updates the user's password with the new hashed password. If the token is invalid, it returns an
// error response indicating the token is invalid.
router.post("/resetPassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = await jwt.verify(token, process.env.KEY);
    const id = decoded.id;

    const hashPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate({ _id: id }, { password: hashPassword });

    return res.json({ status: true, message: "Updated Password Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: false, message: "Invalid Token" });
  }
});

//API to add a company ID to appliedCompanies array for a user
router.post("/applyCompany/:userId/:companyId", async (req, res) => {
  const { userId, companyId } = req.params;
  console.log("User ID: ", userId);
  console.log("Company ID:", companyId);

  try {
    const user = await User.findById(userId);
    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.appliedCompanies) {
      user.appliedCompanies = [];
    }

    if (user.appliedCompanies.includes(companyId)) {
      return res
        .status(400)
        .json({ message: "User already applied to this company" });
    }

    user.appliedCompanies.push(companyId);
    await user.save();

    return res.json({ message: "Company applied successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to retrieve scheduled interviews for a user
router.get("/scheduledInterviews/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const appliedCompanyIds = user.appliedCompanies;
    const companies = await Company.find({ _id: { $in: appliedCompanyIds } });

    const scheduledInterviews = companies.map((company) => ({
      companyName: company.companyname,
      interviewDate: company.doi,
    }));

    return res.json({ scheduledInterviews });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//API to post interview experience
router.post("/add-interview", async (req, res) => {
  try {
    const {
      username,
      companyName,
      position,
      experience,
      interviewLevel,
      result,
    } = req.body;

    const newInterview = new Interview({
      username,
      companyName,
      position,
      experience,
      interviewLevel,
      result,
    });

    await newInterview.save();

    return res.json({ message: "Interview experience added successfully" });
  } catch (error) {
    console.error("Error adding interview experience:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//API to fetch the interview experiences on the feed
router.get("/fetchinterviewexperience", async (req, res) => {
  try {
    const interviews = await Interview.find({});
    return res.json({ data: interviews });
  } catch (error) {
    console.error("Error fetching interview experiences:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/placementStatus/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get the placement status
    const status = user.placementStatus;

    if (status === 'Placed') {
      // If the status is placed, get the company name from the user document
      const companyName = user.companyPlaced;
      return res.json({ status, companyName });
    }

    return res.json({ status });
  } catch (error) {
    console.error('Error fetching placement status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//---------------------------------------------ADMIN ENDPOINTS--------------------------------------------------//

// This API endpoint is responsible for adding new company details to the database.
router.post("/add-companies", async (req, res) => {
  const {
    companyname,
    jobprofile,
    jobdescription,
    website,
    ctc,
    doi,
    eligibilityCriteria,
    tenthPercentage,
    twelfthPercentage,
    graduationCGPA,
    sixthSemesterCGPA,
  } = req.body;

  try {
    const newCompany = new Company({
      companyname,
      jobprofile,
      jobdescription,
      website,
      ctc,
      doi,
      eligibilityCriteria,
      tenthPercentage,
      twelfthPercentage,
      graduationCGPA,
      sixthSemesterCGPA,
    });

    await newCompany.save();
    console.log(newCompany);
    return res.json({ message: "Company Registered" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to fetch all users and generate user reports.
// It retrieves all users from the database and sends them as a response.
router.get("/getUsers", async (req, res) => {
  try {
    const allUsers = await User.find({});

    res.send({ data: allUsers });
  } catch (error) {
    console.log(error);
  }
});

// Route to fetch all companies.
// It retrieves all companies from the database and sends them as a response.
router.get("/getCompanies", async (req, res) => {
  try {
    const allCompanies = await Company.find({});

    res.send({ data: allCompanies });
  } catch (error) {
    console.log(error);
  }
});

// Route to update company data.
// It updates the company details based on the provided ID.
router.put("/updatecompany/:id", (req, res) => {
  const id = req.params.id;
  Company.findByIdAndUpdate(id, {
    companyname: req.body.companyname,
    jobprofile: req.body.jobprofile,
    ctc: req.body.ctc,
    doi: req.body.doi,
    tenthPercentage: req.body.tenthPercentage,
    twelfthPercentage: req.body.twelfthPercentage,
    graduationCGPA: req.body.graduationCGPA,
    sixthSemesterCGPA: req.body.sixthSemesterCGPA,
  })
    .then((company) => res.json(company))
    .catch((err) => res.json(err));
});

// Route to delete company data.
// It deletes the company based on the provided ID.
router.delete("/deletecompany/:id", (req, res) => {
  const id = req.params.id;
  Company.findByIdAndDelete({ _id: id })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

// Route to fetch a specific company by ID.
// It retrieves the company details based on the provided ID.
router.get("/getCompanies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const company = await Company.findById(id);

    res.send({ data: company });
  } catch (error) {
    console.log(error);
  }
});

//This API fetches the users and the companies they have applied to
router.get("/companyApplicants", async (req, res) => {
  try {
    const companies = await Company.find(); // Assuming you have a Company model

    const companyData = [];

    for (const company of companies) {
      const applicants = await User.find({ appliedCompanies: company._id });

      const companyInfo = {
        companyId: company._id,
        companyName: company.companyname,
        applicants: applicants.map((applicant) => ({
          userId: applicant._id,
          name: applicant.name,
          email: applicant.email,
        })),
      };

      companyData.push(companyInfo);
    }

    res.json(companyData);
  } catch (error) {
    console.error("Error fetching company applicants:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Backend API to update placementStatus
router.post("/updatePlacementStatus", async (req, res) => {
  try {
    const { userId, companyId, status } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.placementStatus === "Placed" && status === "Placed") {
      return res.status(200).json({ message: "User is already placed." });
    }
    const company = await Company.findById(companyId);
    console.log(company.companyname);
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    user.placementStatus = status;
    user.companyPlaced = company.companyname;
    await user.save();
    res.json({
      message: `Placement status updated to ${status} successfully.`,
    });
  } catch (error) {
    console.error("Error updating placement status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this endpoint if it doesn't exist already
router.post("/updateProfile", async (req, res) => {
  try {
    // Get user ID from the token
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.KEY);
    const userId = decoded._id;

    // Get updated fields from request body
    const {
      name,
      contactNumber,
      dob,
      gender,
      address,
      graduationCollege,
      stream,
      graduationCGPA,
      graduationYear,
      skills,
      experience,
      projects
    } = req.body;

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        contactNumber,
        dob,
        gender,
        address,
        graduationCollege,
        stream,
        graduationCGPA,
        graduationYear,
        skills,
        experience,
        projects
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.json({ status: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ status: false, message: `Internal Server Error: ${error.message}` });
  }
});

// Test route to check if server is working
router.get("/test", (req, res) => {
  console.log("Test route called");
  console.log("Cookies received:", req.cookies);
  res.json({ 
    status: true, 
    message: "Server is working", 
    cookies: req.cookies,
    timestamp: new Date().toISOString()
  });
});

// Logout route to clear the authentication token
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    return res.json({ status: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.json({ status: false, message: "Error during logout" });
  }
});

export { router as UserRouter };