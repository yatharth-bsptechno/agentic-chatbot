// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  info: {
    name: String,
    email: String,
    mobile: String,
    address: String,
  },
  stage: String,
  possibleRoles: [String],
  eliminatedRoles: [String],
  finalRole: String,
  roleInferenceReason: String,
  chatHistory: [
    {
      from: String,
      message: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models?.User || mongoose.model("User", UserSchema);
