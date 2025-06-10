import React from 'react';
import { Puzzle } from '../lib/types';

interface PuzzleGridProps {
  puzzles: Puzzle[];
  selectedPuzzles?: Set<string>;
  onPuzzleToggle?: (puzzleSlug: string) => void;
  showCheckboxes?: boolean;
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  puzzles,
  selectedPuzzles = new Set(),
  onPuzzleToggle,
  showCheckboxes = true
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {puzzles.map((puzzle) => {
        const hasVideo = puzzle.cards.some((c: any) => !!c.youtube);
        const hasAudio = puzzle.cards.some((c: any) => !!c.deezer);
        const hasImage = puzzle.cards.some((c: any) => !!c.image);

        let emoji = "";
        if (hasVideo) emoji = "🎬";
        else if (hasAudio) emoji = "🎵";
        else if (hasImage) emoji = "🖼️";

        const isSelected = selectedPuzzles.has(puzzle.slug);

        return (
          <div
            key={puzzle.slug}
            className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => onPuzzleToggle?.(puzzle.slug)}
            title={puzzle.topic} // Native tooltip showing full name
          >
            {showCheckboxes && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onPuzzleToggle?.(puzzle.slug)}
                className="absolute top-4 left-4 w-5 h-5"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            
            <div className={showCheckboxes ? 'ml-8' : ''}>
              <div className="flex items-start gap-2">
                <span className="text-xl flex-shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate" title={puzzle.topic}>
                    {puzzle.topic}
                  </h3>
                  <div className="text-sm text-gray-600 mt-1">
                    {puzzle.cards.length} cards • {puzzle.subcategory || puzzle.category}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced tooltip on hover */}
            <div className="absolute invisible hover:visible opacity-0 hover:opacity-100 transition-opacity left-0 top-full mt-2 z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg w-64 pointer-events-none">
              <div className="font-semibold mb-1">{puzzle.topic}</div>
              <div className="text-sm text-gray-300">
                {puzzle.cards.length} cards • {puzzle.subcategory || puzzle.category}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 