"use server";

import { fetchSnapshot } from "../dashboard/snapshot";
import { GoogleGenAI } from "@google/genai";
import { Interval } from "@/lib/actions/types";

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function generateAiInsights(interval: Interval) {
  const snapshot = await fetchSnapshot(interval);

  const prompt = `
You are a financial analyst inside a personal finance app.

Rules:
- Only use the provided data
- Do NOT hallucinate numbers
- Do NOT perform calculations
- Focus on insights, anomalies, risks, and suggestions
- Be concise and structured

Return format:

1. Key Insights (bullet points)
2. Spending Anomalies
3. Budget Health
4. Suggestions (max 3)

DATA:
${JSON.stringify(snapshot)}
`;

  const result = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = result.text;

  return {
    snapshot,
    insights: text,
  };
}
