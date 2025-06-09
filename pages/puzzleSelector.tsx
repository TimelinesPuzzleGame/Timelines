import React, { useState } from 'react';
import { puzzles } from '../lib/gameData';
import { Puzzle } from '../lib/types';
import { useRouter } from 'next/router';

export default function PuzzleSelector() {
  const [selectedPuzzles, setSelectedPuzzles] = useState<Set<string>>(new Set());
  const router = useRouter();

  const togglePuzzle = (puzzleSlug: string) => {
    setSelectedPuzzles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(puzzleSlug)) {
        newSet.delete(puzzleSlug);
      } else {
        newSet.add(puzzleSlug);
      }
      return newSet;
    });
  };

  const handleStart = () => {
    if (selectedPuzzles.size > 0) {
      // Navigate to play with selected puzzles
      const selectedArray = Array.from(selectedPuzzles);
      router.push(`/play?puzzles=${selectedArray.join(',')}`);
    }
  };

  // Group puzzles by category
  const puzzlesByCategory = puzzles.reduce((acc, puzzle) => {
    const category = puzzle.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(puzzle);
    return acc;
  }, {} as Record<string, Puzzle[]>);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Select Puzzles</h1>
        
        {/* Grid of puzzle cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all min-w-[300px] ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-md'
                }`}
                onClick={() => togglePuzzle(puzzle.slug)}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => togglePuzzle(puzzle.slug)}
                  className="absolute top-4 left-4 w-5 h-5 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Content */}
                <div className="ml-8">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold text-lg leading-tight mb-1"
                        title={puzzle.topic} // Native browser tooltip
                      >
                        {puzzle.topic}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {puzzle.cards.length} cards • {puzzle.subcategory || puzzle.category}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Custom tooltip on hover */}
                <div className="absolute invisible group-hover:visible opacity-0 hover:opacity-100 transition-all duration-200 left-0 top-full mt-2 z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl w-80 pointer-events-none">
                  <div className="font-semibold text-base mb-1">{puzzle.topic}</div>
                  <div className="text-sm text-gray-300 mb-2">
                    Category: {puzzle.category} {puzzle.subcategory && `• ${puzzle.subcategory}`}
                  </div>
                  <div className="text-sm text-gray-300">
                    {puzzle.cards.length} cards
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-gray-600">
              {selectedPuzzles.size === 0 
                ? "No puzzles selected" 
                : `${selectedPuzzles.size} puzzle${selectedPuzzles.size > 1 ? 's' : ''} selected`}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedPuzzles(new Set())}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleStart}
                disabled={selectedPuzzles.size === 0}
                className={`px-8 py-2 rounded-lg font-semibold transition-all ${
                  selectedPuzzles.size > 0
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 