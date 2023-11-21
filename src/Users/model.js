const mongoose = require("mongoose");

const Userschema = mongoose.Schema({
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  phone: { type: Number, default: 0, required: true },
  country_code: { type: String },
  email: { type: String, default: 0 },
  token: { type: String, default: 0 },
  status: { type: String },
  isAdmin: { type: Boolean, default: false },
  otp: { type: Number },
  isSA: { type: String, default: false },
});

const Users = mongoose.model("User", Userschema);
module.exports = Users;
