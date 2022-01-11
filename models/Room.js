const { Schema, model } = require("mongoose");

const Room = new Schema({
  roomId: { type: String },
  users: { type: Map, default: {} },
  messages: [{ type: Object, default: {} }],
});

module.exports = model("Room", Room);
