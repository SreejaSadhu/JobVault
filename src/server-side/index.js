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
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://job-vault-bice.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001'
    ].filter(Boolean); // Remove undefined values
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

console.log("CORS allowed origins:", corsOptions.origin);
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: '5mb' })); // Limit payload size for Render

// Add response time logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

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
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 3000, // Faster timeout
  socketTimeoutMS: 30000, // 30 second timeout
  bufferCommands: false, // Disable mongoose buffering
  maxPoolSize: 5, // Smaller pool for Render
  minPoolSize: 1 // Keep at least one connection
})
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    console.error("Please check your MONGO_URI environment variable");
  });

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});

// Keep-alive ping to prevent Render from sleeping
setInterval(() => {
  console.log("Keep-alive ping:", new Date().toISOString());
}, 60000); // Every 1 minute (more frequent)

// Additional ping every 30 seconds during first 5 minutes
let startupPings = 0;
const startupInterval = setInterval(() => {
  if (startupPings < 10) { // First 5 minutes
    console.log("Startup keep-alive ping:", new Date().toISOString());
    startupPings++;
  } else {
    clearInterval(startupInterval);
  }
}, 30000); // Every 30 seconds

app.get("/", (req, res) => {
  res.send("JobVault backend is running!");
});
