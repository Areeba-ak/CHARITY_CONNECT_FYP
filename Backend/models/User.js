// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['donor', 'needy', 'admin'],
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email']
  },
  password: {
    type: String,
    required: false,
    minlength: 6,
    select: false
  },

  // Google OAuth id (optional)
  googleId: {
    type: String,
    unique: false,
    sparse: true
  },

  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },

  address: String,
  city: String,

  contact: String,

  // ✅ Avatar stored as Base64 OR URL
  avatar: {
    type: String,
    default: ""
  },

  profession: String,
  otherProfession: String,
  cnicImage: String
}, { timestamps: true });

/* Hash password */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* Compare password */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model('User', userSchema);
