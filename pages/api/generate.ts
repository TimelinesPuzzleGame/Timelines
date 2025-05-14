import type { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';
import { z } from 'zod';
import { SYSTEM_PROMPT } from "../../lib/systemPrompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CardBaseSchema = z.object({
  label: z.string(),
  date: z.number(),
});
const PuzzleBaseSchema = z.array(CardBaseSchema).length(10);

const CardSchema = z.object({
  label: z.string(),
  date: z.number(),
  source: z.string().url().optional(),
  id: z.string().optional(),
});
const PuzzleSchema = z.object({
  category: z.enum(["History", "Arts", "Entertainment", "Sports", "Current Events"]),
  cards: z.array(CardSchema).length(10),
});


async function lookupEventDate(title: string): Promise<{ date: number; source: string } | null> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) return null;
    const data = await resp.json();
    const extract: string = data.extract || '';
    const match = extract.match(/\b(?:[1-9]\d{0,2}|1[0-9]{3}|20[0-2]\d|2025)\b/);
    if (match) {
      const year = parseInt(match[0], 10);
      const sourceUrl = data.content_urls?.desktop?.page || url;
      return { date: year, source: sourceUrl };
    }
  } catch (e) {
    console.error('Lookup error for', title, e);
  }
  return null;
}




export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;
  if (typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ error: 'Missing or invalid "topic".' });
  }

  try {
    const userPrompt = `Generate a puzzle about the topic: "${topic.trim()}".`;

    let raw: string | undefined;
    let parsed: unknown;
    let successfulAttempt: number | null = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      const gptRes = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      });

      raw = gptRes.choices?.[0]?.message?.content;
      if (!raw) continue;

      try {
        parsed = JSON.parse(raw);
        successfulAttempt = attempt + 1;
        break;
      } catch {
        const match = raw.match(/\[\s*\{[\s\S]*?\}\s*\]/);
        if (match) {
          try {
            parsed = JSON.parse(match[0]);
            successfulAttempt = attempt + 1;
            break;
          } catch {
            console.warn(`Attempt ${attempt + 1}: regex recovery failed`);
          }
        }
        console.warn(`Attempt ${attempt + 1}: invalid JSON`);
        if (attempt === 2) throw new Error('Invalid JSON from OpenAI after 3 attempts');
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ GPT response succeeded on attempt ${successfulAttempt}`);
      console.table(parsed);
    }

    const base = PuzzleSchema.parse(parsed);

const enriched = await Promise.all(
  base.cards.map(async (card, index) => {
    const info = await lookupEventDate(card.label);
    if (info) {
      return {
        label: card.label,
        date: info.date,
        source: info.source,
        id: `ugc-${Date.now()}-${index}`,
      };
    }
    return {
      label: card.label,
      date: card.date,
      id: `ugc-${Date.now()}-${index}`,
    };
  })
);

const finalCards = PuzzleSchema.shape.cards.parse(enriched);
return res.status(200).json({ cards: finalCards, category: base.category });
  } catch (err: any) {
    console.error('Error generating puzzle:', err);
    return res.status(500).json({ error: 'Oopsie, the robot did a no-no. Please try again.' });
  }
}
