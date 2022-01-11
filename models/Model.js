const { Schema, model } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Model = new Schema({
  modelId: { type: String, unique: true, default: uuidv4() },
  modelName: { type: String, unique: true, required: true },
  modelPassword: { type: String, required: true },
  modelEmail: { type: String, unique: true, required: true },
  modelTokens: { type: Number, default: 0 },
  modelRoles: [{ type: String, ref: "Role" }],
  modelStudio: { type: String, default: null },
});

module.exports = model("Model", Model);
