// API/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

// Load the service account credentials from the file
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const credentials = JSON.parse(fs.readFileSync(keyFile, "utf8"));

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(credentials.private_key, {
  projectId: credentials.project_id,
});

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function askGemini(promptText) {
  const result = await model.generateContent(promptText);
  const response = await result.response;
  return response.text();
}
