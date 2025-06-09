// MUSIC CATEGORY SELECTOR - Checkbox interface for Deezer modular system
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MusicCategory {
  id: string;
  name: string;
}

interface MusicCategories {
  genres: MusicCategory[];
  themes: MusicCategory[];
  decades: MusicCategory[];
  specialCollections: MusicCategory[];
}

interface SelectedCategories {
  genres: string[];
  themes: string[];
  decades: string[];
  specialCollections: string[];
}

interface MusicCategorySelectorProps {
  onSelectionChange: (selectedCategories: SelectedCategories) => void;
  onGeneratePuzzle: (selectedCategories: SelectedCategories) => void;
  isGenerating?: boolean;
}

const MusicCategorySelector: React.FC<MusicCategorySelectorProps> = ({
  onSelectionChange,
  onGeneratePuzzle,
  isGenerating = false
}) => {
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({
    genres: [],
    themes: [],
    decades: [],
    specialCollections: []
  });

  const [showPreview, setShowPreview] = useState(false);

  // Static category data (in real app, this would come from the Deezer discovery system)
  const musicCategories: MusicCategories = {
    genres: [
      { id: 'pop', name: 'Pop' },
      { id: 'rock', name: 'Rock' },
      { id: 'hip-hop', name: 'Hip-Hop/Rap' },
      { id: 'rnb', name: 'R&B/Soul' },
      { id: 'electronic', name: 'Electronic/EDM' },
      { id: 'country', name: 'Country' },
      { id: 'jazz', name: 'Jazz' },
      { id: 'classical', name: 'Classical' },
      { id: 'metal', name: 'Metal' },
      { id: 'punk', name: 'Punk' },
      { id: 'reggae', name: 'Reggae' },
      { id: 'folk', name: 'Folk/Indie' },
      { id: 'blues', name: 'Blues' },
      { id: 'latin', name: 'Latin' },
      { id: 'world', name: 'World Music' },
      { id: 'alternative', name: 'Alternative' }
    ],
    themes: [
      { id: 'summer', name: 'Summer Hits' },
      { id: 'love', name: 'Love Songs/Ballads' },
      { id: 'breakup', name: 'Breakup Anthems' },
      { id: 'party', name: 'Party Bangers' },
      { id: 'workout', name: 'Workout/Gym' },
      { id: 'roadtrip', name: 'Road Trip Classics' },
      { id: 'chill', name: 'Chill/Relaxing' },
      { id: 'nostalgia', name: 'Nostalgic Throwbacks' },
      { id: 'onehit', name: 'One Hit Wonders' },
      { id: 'soundtracks', name: 'Movie Soundtracks' },
      { id: 'tv', name: 'TV Show Themes' },
      { id: 'disney', name: 'Disney Classics' },
      { id: 'christmas', name: 'Christmas/Holiday' },
      { id: 'wedding', name: 'Wedding Songs' },
      { id: 'diss', name: 'Rap Diss Tracks' },
      { id: 'dancefloor', name: 'Dance Floor' },
      { id: 'acoustic', name: 'Acoustic/Unplugged' },
      { id: 'live', name: 'Live Performances' },
      { id: 'covers', name: 'Covers & Remixes' },
      { id: 'viral', name: 'Viral TikTok Songs' },
      { id: 'gaming', name: 'Gaming Soundtracks' },
      { id: 'anime', name: 'Anime Themes' }
    ],
    decades: [
      { id: '1900s', name: '1900s' },
      { id: '1910s', name: '1910s' },
      { id: '1920s', name: '1920s' },
      { id: '1930s', name: '1930s' },
      { id: '1940s', name: '1940s' },
      { id: '1950s', name: '1950s' },
      { id: '1960s', name: '1960s' },
      { id: '1970s', name: '1970s' },
      { id: '1980s', name: '1980s' },
      { id: '1990s', name: '1990s' },
      { id: '2000s', name: '2000s' },
      { id: '2010s', name: '2010s' },
      { id: '2020s', name: '2020s' }
    ],
    specialCollections: [
      { id: 'billboard', name: 'Billboard #1 Hits' },
      { id: 'grammy', name: 'Grammy Winners' },
      { id: 'guilty', name: 'Guilty Pleasures' },
      { id: 'duets', name: 'Duets & Collaborations' },
      { id: 'protest', name: 'Protest Songs' },
      { id: 'instrumental', name: 'Instrumental Hits' },
      { id: 'debut', name: 'Debut Singles' },
      { id: 'final', name: 'Final Songs' },
      { id: 'comeback', name: 'Comeback Hits' },
      { id: 'festival', name: 'Festival Anthems' }
    ]
  };

  // Handle checkbox changes
  const handleCategoryChange = (categoryType: keyof SelectedCategories, categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => {
      const updated = {
        ...prev,
        [categoryType]: checked 
          ? [...prev[categoryType], categoryId]
          : prev[categoryType].filter(id => id !== categoryId)
      };
      
      onSelectionChange(updated);
      return updated;
    });
  };

  // Quick preset selections
  const applyPreset = (preset: SelectedCategories) => {
    setSelectedCategories(preset);
    onSelectionChange(preset);
  };

  // Clear all selections
  const clearAll = () => {
    const empty = { genres: [], themes: [], decades: [], specialCollections: [] };
    setSelectedCategories(empty);
    onSelectionChange(empty);
  };

  // Calculate total selections
  const totalSelections = Object.values(selectedCategories).flat().length;

  // Generate description of current selection
  const getSelectionDescription = () => {
    if (totalSelections === 0) return "All music (no filters)";
    
    const parts = [];
    if (selectedCategories.genres.length > 0) {
      const genreNames = selectedCategories.genres.map(id => 
        musicCategories.genres.find(g => g.id === id)?.name
      ).filter(Boolean);
      parts.push(genreNames.join(' + '));
    }
    
    if (selectedCategories.themes.length > 0) {
      const themeNames = selectedCategories.themes.map(id => 
        musicCategories.themes.find(t => t.id === id)?.name
      ).filter(Boolean);
      parts.push(themeNames.join(' + '));
    }
    
    if (selectedCategories.decades.length > 0) {
      const decadeNames = selectedCategories.decades.map(id => 
        musicCategories.decades.find(d => d.id === id)?.name
      ).filter(Boolean);
      parts.push(decadeNames.join(' + '));
    }
    
    return parts.join(' • ') || "Custom selection";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🎵 Create Your Custom Music Timeline
        </h2>
        <p className="text-gray-600">
          Select any combination of genres, themes, decades, and special collections
        </p>
      </div>

      {/* Selection Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Selection:</p>
            <p className="font-semibold text-gray-800">{getSelectionDescription()}</p>
            <p className="text-xs text-gray-500">{totalSelections} filters selected</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
        
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-3 bg-white rounded border"
          >
            <p className="text-sm text-gray-600 mb-2">This combination will search for:</p>
            <p className="text-xs font-mono text-gray-700">
              {totalSelections === 0 
                ? "General music playlists across all genres and eras"
                : `Playlists combining ${getSelectionDescription().toLowerCase()}`
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Quick Presets */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">🎯 Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { name: "Summer 2020s", selection: { genres: ['pop', 'electronic'], themes: ['summer'], decades: ['2020s'], specialCollections: [] } },
            { name: "90s Rock", selection: { genres: ['rock'], themes: ['nostalgia'], decades: ['1990s'], specialCollections: [] } },
            { name: "Love Ballads", selection: { genres: ['pop', 'rnb'], themes: ['love'], decades: [], specialCollections: [] } },
            { name: "Hip-Hop Hits", selection: { genres: ['hip-hop'], themes: [], decades: [], specialCollections: ['billboard'] } },
            { name: "Workout Mix", selection: { genres: ['electronic', 'rock'], themes: ['workout'], decades: ['2010s', '2020s'], specialCollections: [] } },
            { name: "Disney Magic", selection: { genres: [], themes: ['disney'], decades: [], specialCollections: [] } }
          ].map((preset, i) => (
            <button
              key={i}
              onClick={() => applyPreset(preset.selection)}
              className="p-2 text-xs bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Category Selections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Genres */}
        <CategorySection
          title="🎸 Genres"
          items={musicCategories.genres}
          selectedItems={selectedCategories.genres}
          onItemChange={(id, checked) => handleCategoryChange('genres', id, checked)}
          color="blue"
        />

        {/* Themes */}
        <CategorySection
          title="🎭 Themes"
          items={musicCategories.themes}
          selectedItems={selectedCategories.themes}
          onItemChange={(id, checked) => handleCategoryChange('themes', id, checked)}
          color="purple"
        />

        {/* Decades */}
        <CategorySection
          title="📅 Decades"
          items={musicCategories.decades}
          selectedItems={selectedCategories.decades}
          onItemChange={(id, checked) => handleCategoryChange('decades', id, checked)}
          color="green"
        />

        {/* Special Collections */}
        <CategorySection
          title="⭐ Special"
          items={musicCategories.specialCollections}
          selectedItems={selectedCategories.specialCollections}
          onItemChange={(id, checked) => handleCategoryChange('specialCollections', id, checked)}
          color="orange"
        />
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={() => onGeneratePuzzle(selectedCategories)}
          disabled={isGenerating}
          className={`px-8 py-4 text-lg font-semibold rounded-lg transition-all ${
            isGenerating
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 transform hover:scale-105'
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Your Timeline...
            </span>
          ) : (
            `🎵 Generate ${totalSelections === 0 ? 'All Music' : 'Custom'} Timeline`
          )}
        </button>
        
        {totalSelections > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Creating timeline from {totalSelections} selected categories
          </p>
        )}
      </div>
    </div>
  );
};

// Category Section Component
interface CategorySectionProps {
  title: string;
  items: MusicCategory[];
  selectedItems: string[];
  onItemChange: (id: string, checked: boolean) => void;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  items,
  selectedItems,
  onItemChange,
  color
}) => {
  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
    green: 'border-green-200 bg-green-50',
    orange: 'border-orange-200 bg-orange-50'
  };

  const checkboxColors = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600'
  };

  return (
    <div className={`border-2 rounded-lg p-4 ${colorClasses[color]}`}>
      <h3 className="font-semibold mb-3 text-gray-800">{title}</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map(item => (
          <label key={item.id} className="flex items-center space-x-2 cursor-pointer hover:bg-white hover:bg-opacity-50 p-1 rounded">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={(e) => onItemChange(item.id, e.target.checked)}
              className={`rounded border-gray-300 ${checkboxColors[color]} focus:ring-offset-0 focus:ring-1`}
            />
            <span className="text-sm text-gray-700">{item.name}</span>
          </label>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          {selectedItems.length} of {items.length} selected
        </p>
      </div>
    </div>
  );
};

export default MusicCategorySelector; 