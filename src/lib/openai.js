// src/lib/openai.js
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY?.trim();

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing in .env.local");
}

if (apiKey.startsWith("gsk_")) {
  throw new Error("Remove GROQ key! Use only OpenAI sk-proj-... key");
}

if (apiKey.length < 40) {
  throw new Error("Invalid OpenAI key — too short");
}

export const openai = new OpenAI({
  apiKey: apiKey,
});
