// src/lib/config.js
import "dotenv/config";

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY?.trim(),
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o-mini",
};

// Final check — crash early if key missing
if (!CONFIG.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is REQUIRED. Add it to .env.local");
  process.exit(1);
}
