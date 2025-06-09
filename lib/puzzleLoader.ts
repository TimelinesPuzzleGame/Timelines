// lib/puzzleLoader.ts
import { puzzles } from "./gameData";
import type { Puzzle } from "./types";

/**
 * Finds a puzzle by its slug.
 */
export function loadPuzzle(slug: string): Promise<Puzzle> {
  const found = puzzles.find((p) => p.slug === slug);
  if (!found) {
    return Promise.reject(new Error(`Puzzle with slug "${slug}" not found.`));
  }
  return Promise.resolve(found);
}
