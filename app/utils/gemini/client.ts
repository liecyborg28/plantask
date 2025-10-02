import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// model: "gemini-pro" untuk text, "gemini-1.5-pro" untuk multimodal
export const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
