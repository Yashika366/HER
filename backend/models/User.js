const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  age: { type: Number, min: 10, max: 80 },
  condition: {
    type: String,
    enum: ['PCOS', 'PCOD', 'Both', 'Suspected', 'Not Diagnosed'],
    default: 'Not Diagnosed'
  },
  diagnosisYear: Number,
  bio: { type: String, maxlength: 500 },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'admin', 'doctor'], default: 'user' },
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  joinedDate: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
