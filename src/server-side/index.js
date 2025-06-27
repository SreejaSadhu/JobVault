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
  origin: process.env.FRONTEND_URL || true, // fallback to true for development
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use("/auth", UserRouter);
app.use("/admin", adminRouter);

// Use env variable, since mongo uri is sensitive
mongoose.connect(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("JobVault backend is running!");
});
