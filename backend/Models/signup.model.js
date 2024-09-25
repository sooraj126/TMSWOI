const mongoose = require('mongoose');

const signup = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true },
  confirm_password: { type: String, required: true }
});

module.exports = mongoose.model('Signup', signup);