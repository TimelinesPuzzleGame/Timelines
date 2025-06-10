import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PuzzleCard {
  id?: string;
  label: string;
  date: number;
  youtube?: string;
  tooltip?: {
    description?: string;
    quote?: string;
  };
}

interface Puzzle {
  slug: string;
  topic: string;
  category: string;
  subcategory?: string;
  hideDates?: boolean;
  showTooltips?: boolean;
  cards: PuzzleCard[];
}

interface PlaylistData {
  playlistUrl: string;
  topic: string;
  category: 'History' | 'Arts' | 'Entertainment' | 'Sports' | 'Current Events';
  subcategory: string;
  sortBy: 'chronological' | 'playlist';
  maxCards: number;
  hideDates: boolean;
  showTooltips: boolean;
  includeTooltips: boolean;
}

const PlaylistPuzzleCreator: React.FC = () => {
  const [formData, setFormData] = useState<PlaylistData>({
    playlistUrl: '',
    topic: '',
    category: 'Entertainment',
    subcategory: 'Music',
    sortBy: 'chronological',
    maxCards: 200,
    hideDates: false,
    showTooltips: true,
    includeTooltips: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [generatedPuzzle, setGeneratedPuzzle] = useState<Puzzle | null>(null);
  const [error, setError] = useState<string>('');

  const categories = {
    History: ['Ancient History', 'Modern History', 'Wars & Conflicts', 'Politics'],
    Arts: ['Paintings', 'Literature', 'Sculpture', 'Architecture'],
    Entertainment: ['Music', 'Movies/TV', 'Video Games', 'Comedy'],
    Sports: ['Basketball', 'Football (Soccer)', 'American Football', 'Baseball', 'Tennis', 'Olympics'],
    'Current Events': ['Technology', 'Social Media', 'Pop Culture', 'News'],
  };

  const handleInputChange = (field: keyof PlaylistData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
      ...(field === 'category' && { subcategory: categories[value as keyof typeof categories][0] }),
    }));
  };

  const extractPlaylistId = (url: string): string | null => {
    const patterns = [
      /[?&]list=([a-zA-Z0-9_-]+)/,
      /\/playlist\?list=([a-zA-Z0-9_-]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const parsePuzzle = async () => {
    setIsLoading(true);
    setError('');
    setGeneratedPuzzle(null);

    try {
      // Validate playlist URL
      const playlistId = extractPlaylistId(formData.playlistUrl);
      if (!playlistId) {
        throw new Error('Invalid YouTube playlist URL. Please enter a valid playlist URL.');
      }

      // Call the backend API
      const response = await fetch('/api/parse-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playlistUrl: formData.playlistUrl,
          topic: formData.topic,
          category: formData.category,
          subcategory: formData.subcategory,
          sortBy: formData.sortBy,
          maxCards: formData.maxCards,
          hideDates: formData.hideDates,
          showTooltips: formData.showTooltips,
          includeTooltips: formData.includeTooltips,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse playlist');
      }

      setGeneratedPuzzle(data.puzzle);
      
      // Show success message
      console.log('✅ Puzzle generated successfully:', data.message);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPuzzle = () => {
    if (!generatedPuzzle) return;
    
    const jsonString = JSON.stringify(generatedPuzzle, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPuzzle.slug}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            🎬 YouTube Playlist to Timeline Puzzle
          </h1>
          <p className="text-blue-200 text-center mb-8">
            Convert any YouTube playlist into a timeline puzzle for your game
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  YouTube Playlist URL *
                </label>
                <input
                  type="url"
                  value={formData.playlistUrl}
                  onChange={(e) => handleInputChange('playlistUrl', e.target.value)}
                  placeholder="https://www.youtube.com/playlist?list=..."
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Puzzle Topic *
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="e.g., Michael Jackson Greatest Hits"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                  >
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat} className="bg-gray-800">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Subcategory</label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                  >
                    {categories[formData.category].map(subcat => (
                      <option key={subcat} value={subcat} className="bg-gray-800">
                        {subcat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Sort By</label>
                  <select
                    value={formData.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                  >
                    <option value="chronological" className="bg-gray-800">Chronological (by date)</option>
                    <option value="playlist" className="bg-gray-800">Playlist Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Max Cards</label>
                  <input
                    type="number"
                    value={formData.maxCards}
                    onChange={(e) => handleInputChange('maxCards', parseInt(e.target.value))}
                    min="5"
                    max="300"
                    className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    checked={formData.hideDates}
                    onChange={(e) => handleInputChange('hideDates', e.target.checked)}
                    className="w-5 h-5 rounded bg-white/20 border-white/30"
                  />
                  <span>Hide dates in game</span>
                </label>

                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    checked={formData.showTooltips}
                    onChange={(e) => handleInputChange('showTooltips', e.target.checked)}
                    className="w-5 h-5 rounded bg-white/20 border-white/30"
                  />
                  <span>Enable tooltips</span>
                </label>

                <label className="flex items-center space-x-3 text-white">
                  <input
                    type="checkbox"
                    checked={formData.includeTooltips}
                    onChange={(e) => handleInputChange('includeTooltips', e.target.checked)}
                    className="w-5 h-5 rounded bg-white/20 border-white/30"
                  />
                  <span>Include video descriptions</span>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={parsePuzzle}
                disabled={!formData.playlistUrl || !formData.topic || isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Parsing Playlist...</span>
                  </div>
                ) : (
                  'Generate Puzzle'
                )}
              </motion.button>
            </div>

            {/* Right Column - Preview/Results */}
            <div className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-500/20 border border-red-500/50 rounded-lg p-4"
                >
                  <h3 className="text-red-300 font-medium mb-2">Error</h3>
                  <p className="text-red-200 text-sm">{error}</p>
                </motion.div>
              )}

              {generatedPuzzle && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-500/20 border border-green-500/50 rounded-lg p-6"
                >
                  <h3 className="text-green-300 font-bold text-xl mb-4">✅ Puzzle Generated!</h3>
                  
                  <div className="space-y-3 text-green-100">
                    <p><strong>Topic:</strong> {generatedPuzzle.topic}</p>
                    <p><strong>Category:</strong> {generatedPuzzle.category} → {generatedPuzzle.subcategory}</p>
                    <p><strong>Cards:</strong> {generatedPuzzle.cards.length}</p>
                    <p><strong>Slug:</strong> {generatedPuzzle.slug}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={downloadPuzzle}
                    className="w-full mt-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📥 Download JSON File
                  </motion.button>
                </motion.div>
              )}

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-6">
                <h3 className="text-blue-300 font-bold mb-3">📋 Setup Instructions</h3>
                <div className="text-blue-200 text-sm space-y-2">
                  <p><strong>1.</strong> Get a YouTube Data API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Google Cloud Console</a></p>
                  <p><strong>2.</strong> Enable "YouTube Data API v3" in APIs & Services → Library</p>
                  <p><strong>3.</strong> Create Credentials → API Key</p>
                  <p><strong>4.</strong> Add to your .env.local file: <code className="bg-black/30 px-1 rounded">YOUTUBE_API_KEY=your_key_here</code></p>
                  <p><strong>5.</strong> Restart your development server</p>
                  <p><strong>6.</strong> Test with a public playlist below</p>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded">
                  <p className="text-yellow-200 text-xs">
                    💡 <strong>Testing:</strong> Run <code className="bg-black/30 px-1 rounded">node scripts/testAPISetup.js</code> to verify your setup
                  </p>
                </div>
              </div>

              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                <h4 className="text-yellow-300 font-medium mb-2">💡 Tips</h4>
                <ul className="text-yellow-200 text-sm space-y-1">
                  <li>• Use chronological sort for timeline puzzles</li>
                  <li>• System supports playlists up to 300 videos</li>
                  <li>• Large playlists (100+ videos) may take longer to process</li>
                  <li>• Include tooltips for extra context</li>
                  <li>• Test with public playlists first</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlaylistPuzzleCreator; 