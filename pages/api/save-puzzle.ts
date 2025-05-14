import type { NextApiRequest, NextApiResponse } from 'next';
import { savePuzzleToDisk } from '../../lib/savePuzzle';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { puzzle, slug } = req.body;
  if (!puzzle || !slug) return res.status(400).json({ error: "Missing puzzle or slug" });

  try {
    const result = savePuzzleToDisk(puzzle, slug);
    res.status(200).json({ result });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Failed to save puzzle." });
  }
}
