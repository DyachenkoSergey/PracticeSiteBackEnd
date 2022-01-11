const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Studio = new Schema({
  studioId: { type: String, unique: true, default: uuidv4() },
  studioName: { type: String, unique: true, required: true },
  studioPassword: { type: String, required: true },
  studioEmail: { type: String, unique: true, required: true },
  studioTokens: { type: Number, default: 0 },
  studioRoles: [{ type: String, ref: "Role" }],
  studioModels: { type: String, default: null },
});

module.exports = model("STUDIO", Studio);
