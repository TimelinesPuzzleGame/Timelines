import React from 'react';

export function CardTooltip({ description, quote }: { description: string; quote: string }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 p-4 bg-white text-sm text-gray-800 rounded-lg shadow-lg z-50 animate-fade-in">
      <p className="mb-2">{description}</p>
      <blockquote className="italic text-gray-600 border-l-2 border-gray-300 pl-2">“{quote}”</blockquote>
    </div>
  );
}
