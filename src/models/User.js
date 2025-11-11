import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ["user", "bot"], required: true },
    message: { type: String, required: true },
    ts: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    info: {
      name: { type: String, default: null },
      email: { type: String, default: null },
      mobile: { type: String, default: null },
      address: { type: String, default: null },
    },
    stage: {
      type: String,
      enum: ["collecting_info", "chatting"],
      default: "collecting_info",
    },
    chatHistory: { type: [MessageSchema], default: [] },
    possibleRoles: { type: [String], default: [] },
    eliminatedRoles: { type: [String], default: [] },
    finalRole: { type: String, default: null },
    roleInferenceReason: { type: String, default: null },
    manualRole: { type: String, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
