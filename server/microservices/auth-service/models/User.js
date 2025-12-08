// server/microservices/auth-service/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// ✅ Define the schema fields exactly as per your table
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    description: 'Unique username for each user'
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true,
    description: 'User email address'
  },
  password: { 
    type: String, 
    required: true,
    description: 'User password stored securely (hashed)'
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['Resident', 'Staff', 'Advocate'],
    description: 'Defines user permissions'
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    description: 'Timestamp for when the user was created'
  }
});

// ✅ Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ✅ Add password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ Export model
export default mongoose.model('User', userSchema);
