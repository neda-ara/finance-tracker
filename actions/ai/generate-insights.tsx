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

      Your job is to analyze the data and present clear, useful insights for a non-expert user.

      Rules:
      - Only use the provided data
      - Do NOT hallucinate numbers
      - Do NOT perform calculations unless explicitly present in data
      - Be concise, practical, and easy to understand
      - Avoid repetition and vague statements
      - Keep tone professional but simple (no jargon)

      Formatting rules:
      - Always format numbers with commas (e.g., 546,873)
      - Always prefix monetary values with the currency symbol (₹)
      - Keep numbers human-readable (no raw/unformatted values)

      Return ONLY valid JSON. No markdown, no text outside JSON.

      CRITICAL OUTPUT RULES:
      - Return ONLY raw JSON
      - Do NOT wrap in markdown
      - Do NOT use \`\`\` or code blocks
      - Do NOT add any text before or after JSON
      - Response must start with { and end with }

      Schema:
      {
        "observations": string[],
        "suggestions": string[]
      }

      Guidelines:
      - Observations = key insights, anomalies, risks
      - Suggestions = clear, actionable next steps
      - Observations: 4-6 points
      - Suggestions: 3-5 points
      - Each point must be a single short sentence
      - No numbering, no bullet symbols, no extra formatting

      DATA: ${JSON.stringify(snapshot)}
  `;

  const result = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let parsed = null;

  try {
    const cleaned = (result.text as string)
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const json = JSON.parse(cleaned);

    const hasValidData =
      Array.isArray(json?.observations) &&
      json.observations.length > 0 &&
      Array.isArray(json?.suggestions) &&
      json.suggestions.length > 0;

    if (hasValidData) {
      parsed = json;
    }
  } catch (err) {
    console.error("AI response parse failed: ", err);
  }

  console.log("parsed::", parsed);

  return {
    snapshot,
    insights: parsed,
  };
}
