import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true, unique: true },
  sapId: { type: String, required: true, unique: true },
  rollNo: { type: String },
  gender: { type: String },
  dob: { type: String },
  tenthPercentage: { type: Number, required: true },
  tenthSchool: { type: String },
  twelfthPercentage: { type: Number, required: true },
  twelfthCollege: { type: String },
  graduationCollege: { type: String },
  cgpa: { type: Number, required: true },
  stream: { type: String },
  yearOfGraduation: { type: Number },
  isAdmin: { type: String },
  role: { type: String, enum: ['student', 'viewer', 'admin'], default: 'student' },
  placementStatus: { type: String, default: "Unplaced" },
  companyPlaced: { type: String, default: null },
  appliedCompanies: [
    { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
  ],
  skills: [{ type: String }],
  experience: [{
    company: { type: String },
    role: { type: String },
    duration: { type: String },
  }],
  projects: [{
    title: { type: String },
    description: { type: String },
    link: { type: String },
  }],
});

// Add only the indexes that don't already exist from unique: true
userSchema.index({ appliedCompanies: 1 });
userSchema.index({ placementStatus: 1 });

const UserModel = mongoose.model("User", userSchema);
export { UserModel as User };
