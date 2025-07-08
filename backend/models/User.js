const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: 'user' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  lastLogin: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, {
  timestamps: true // createdAt y updatedAt automáticos
});

module.exports = mongoose.model('User', userSchema);
