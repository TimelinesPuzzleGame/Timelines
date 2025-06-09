console.log("OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);

import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { SURPRISE_PROMPTS } from "../../lib/prompts";
import { z } from "zod";
import { SYSTEM_PROMPT } from "../../lib/systemPrompt";
import { searchDeezerTrack } from "../../lib/deezer";

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

// Type for the parsed result
type ParsedResult = z.infer<typeof schema>;

async function enrichMusicCards(cards: ParsedResult["cards"]) {
  const enriched = await Promise.all(
    cards.map(async (card, index) => {
      const enriched = await searchDeezerTrack(card.label, card.date);
      if (!enriched) return null;
      return {
        ...card,
        id: `surprise-${Date.now()}-${index}`,
        deezer: {
          trackId: enriched.trackId,
          preview: enriched.preview,
        },
      };
    })
  );
  return enriched.filter(Boolean);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { subcategory } = req.body;

  const config = SURPRISE_PROMPTS[subcategory];
  if (!config) return res.status(400).json({ error: "Invalid subcategory." });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `${SYSTEM_PROMPT}

// This puzzle is in category "${config.category}", subcategory "${subcategory}". Ensure all output reflects this.`
        },
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

    // 🔒 Enforce correct category for known subcategories
    if (subcategory === "Music" || subcategory === "Movies/TV" || subcategory === "Books" || subcategory === "Video Games") {
      result.category = "Entertainment";
    }
    if (subcategory === "NFL" || subcategory === "Basketball" || subcategory === "Baseball" || subcategory === "MMA" || subcategory === "Football (Soccer)") {
      result.category = "Sports";
    }

    let final: typeof result;

    if (subcategory === "Music") {
      let attempts = 0;
      let enrichedCards: any[] = [];

      while (enrichedCards.length < 10 && attempts < 3) {
        enrichedCards = await enrichMusicCards(result.cards);
        attempts++;
      }

      if (enrichedCards.length < 10) {
        return res.status(500).json({ error: "Not enough songs with previews" });
      }

      final = {
        ...result,
        cards: enrichedCards.slice(0, 10),
      };
    } else {
      final = {
        ...result,
        cards: result.cards.map((card, index) => ({
          ...card,
          id: `surprise-${Date.now()}-${index}`,
        })),
      };
    }

    return res.status(200).json(final);
  } catch (err) {
    console.error("Surprise GPT error", err);
    res.status(500).json({ error: "Failed to generate puzzle" });
  }
}
