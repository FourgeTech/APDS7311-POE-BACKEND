const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Email validation
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving the employee to the database
employeeSchema.pre('save', async function (next) {
  const employee = this;

  // Only hash the password if it has been modified (or is new)
  if (!employee.isModified('password')) return next();

  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(employee.password, salt);
    employee.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password during login
employeeSchema.methods.comparePassword = async function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};

// Create the Employee model
const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;