import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true }, // Use Boolean for clarity
  adminCode: { type: String, required: true },
  // ... other fields ...
});

const Admin = mongoose.model('Admin', adminSchema);

export { Admin };