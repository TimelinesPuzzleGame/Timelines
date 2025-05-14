import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { SURPRISE_PROMPTS } from "../../lib/prompts";
import { z } from "zod";
import { SYSTEM_PROMPT } from "../../lib/systemPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const schema = z.object({
  cards: z.array(z.object({
    label: z.string(),
    date: z.number().min(0).max(2025)
  })),
  topic: z.string(),
  category: z.enum(["History", "Arts", "Entertainment", "Sports", "Current Events"]),
  subcategory: z.string().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { subcategory } = req.body;

  const config = SURPRISE_PROMPTS[subcategory];
  if (!config) return res.status(400).json({ error: "Invalid subcategory." });




  try {
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: config.prompt }
  ],
  temperature: 0.85
});


   const raw = completion.choices[0].message?.content ?? "";

console.log("🔍 GPT raw response:", raw);

let parsed;
try {
  parsed = JSON.parse(raw);
} catch (e) {
  console.error("❌ JSON parse error:", e);
  return res.status(500).json({ error: "Invalid JSON from GPT", raw });
}

let result;
try {
  result = schema.parse(parsed);
} catch (e) {
  console.error("❌ Zod validation error:", e);
  return res.status(500).json({ error: "Invalid puzzle structure", parsed });
}


const withIds = {
  ...result,
  cards: result.cards.map((card, index) => ({
    ...card,
    id: `surprise-${Date.now()}-${index}`,
  })),
};
res.status(200).json(withIds);
  } catch (err) {
    console.error("Surprise GPT error", err);
    res.status(500).json({ error: "Failed to generate puzzle" });
  }
}
