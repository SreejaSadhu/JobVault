import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/user.js";
import { adminRouter } from "./routes/admin.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL, // fallback to localhost for development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

console.log("CORS origin configured as:", corsOptions.origin);
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use("/auth", UserRouter);
app.use("/admin", adminRouter);

// Use env variable, since mongo uri is sensitive
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

app.get("/", (req, res) => {
  res.send("JobVault backend is running!");
});
