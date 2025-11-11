import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true },
    definition: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Role || mongoose.model("Role", roleSchema);
