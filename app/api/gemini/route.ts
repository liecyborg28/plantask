import { NextResponse } from "next/server";
import { model } from "@/app/utils/gemini/client";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = await model.generateContent(prompt);
    const text = result.response.text() || ""; // <- kasih default empty string
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Gemini error:", err);
    return NextResponse.json({ text: "" }, { status: 500 }); // konsisten
  }
}
