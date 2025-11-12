// src/models/Role.js
import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
  role: { type: String, unique: true },
  definition: String,
});

// SAFE REGISTRATION
export const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);
