const { Schema, model } = require("mongoose");

const User = new Schema({
  userId: { type: String, unique: true },
  userName: { type: String, unique: true, required: true },
  userPassword: { type: String, required: true },
  userEmail: { type: String, unique: true, required: true },
  userTokens: { type: Number, default: 0 },
  userRole: { type: String, required: true },
  userProfile: { type: Object, default: null },
  studioId: { type: String, default: null },
  isOnLine: { type: Boolean, default: false },
  isStream: { type: Boolean, default: false },
});

module.exports = model("User", User);
