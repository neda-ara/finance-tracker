"use server";

import { fetchSnapshot } from "../dashboard/snapshot";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Interval } from "@/lib/actions/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAiInsights(interval: Interval) {
  const snapshot = await fetchSnapshot(interval);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

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

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return {
    snapshot,
    insights: text,
  };
}
