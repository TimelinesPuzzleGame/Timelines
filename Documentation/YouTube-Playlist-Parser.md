# YouTube Playlist to Timeline Puzzle Converter

This system allows you to automatically convert YouTube playlists into timeline puzzle JSON files for your game.

## 🎯 Overview

The YouTube Playlist Parser takes any YouTube playlist URL and generates a properly formatted puzzle JSON file with:
- Video titles as puzzle labels
- Upload/publish dates for chronological ordering
- YouTube video URLs for embedded playback
- Optional tooltips with video descriptions
- Configurable puzzle metadata

## 🚀 Quick Start

### 1. Access the Web Interface
Navigate to `/playlist-creator` in your app to use the visual interface.

### 2. Use the Command Line Tool
```bash
# Set your YouTube API key
export YOUTUBE_API_KEY="your-api-key-here"

# Run the parser
npm run parse-playlist
```

### 3. Use the API Directly
```typescript
import { YouTubePlaylistParser } from './scripts/youtubePlaylistParser';

const parser = new YouTubePlaylistParser('YOUR_API_KEY');
const puzzle = await parser.parsePlaylist(
  'https://www.youtube.com/playlist?list=PLv3TTBr1W_9tppikBxAE_G6qjWdBljBHJ',
  {
    topic: 'Michael Jackson Greatest Hits',
    category: 'Entertainment',
    subcategory: 'Music',
    sortBy: 'chronological',
    maxCards: 20,
    outputDir: './lib/puzzles',
  }
);
```

## 🔧 Setup Instructions

### 1. Get YouTube Data API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the key to YouTube Data API for security

### 2. Configure Environment

Create a `.env.local` file:
```env
YOUTUBE_API_KEY=your-api-key-here
```

### 3. Install Dependencies

The parser uses built-in Node.js modules and your existing dependencies:
- `fs` for file operations
- `path` for file paths
- Your existing TypeScript setup

## 📊 Configuration Options

### Puzzle Options
```typescript
interface PuzzleOptions {
  topic: string;                    // Display name for the puzzle
  category: string;                 // Main category (Entertainment, Sports, etc.)
  subcategory: string;              // Specific subcategory (Music, Basketball, etc.)
  sortBy?: 'chronological' | 'playlist';  // How to order cards
  maxCards?: number;                // Limit number of cards (default: 40)
  hideDates?: boolean;              // Hide years in gameplay
  showTooltips?: boolean;           // Enable tooltip system
  includeTooltips?: boolean;        // Include video descriptions
  outputDir?: string;               // Where to save JSON file
}
```

### Categories and Subcategories
```typescript
const categories = {
  History: ['Ancient History', 'Modern History', 'Wars & Conflicts', 'Politics'],
  Arts: ['Paintings', 'Literature', 'Sculpture', 'Architecture'],
  Entertainment: ['Music', 'Movies/TV', 'Video Games', 'Comedy'],
  Sports: ['Basketball', 'Football (Soccer)', 'Baseball', 'Tennis', 'Olympics'],
  'Current Events': ['Technology', 'Social Media', 'Pop Culture', 'News'],
};
```

## 🎮 Generated Puzzle Format

The parser creates JSON files compatible with your existing puzzle system:

```json
{
  "slug": "michael-jackson-greatest-hits",
  "topic": "Michael Jackson Greatest Hits",
  "category": "Entertainment",
  "subcategory": "Music",
  "hideDates": false,
  "showTooltips": true,
  "cards": [
    {
      "id": "dQw4w9WgXcQ",
      "label": "Billie Jean",
      "date": 1982,
      "youtube": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "tooltip": {
        "description": "Official music video for Billie Jean..."
      }
    }
  ]
}
```

## 🛠️ Advanced Usage

### Custom Video Processing
```typescript
// Override label formatting
private formatLabel(title: string): string {
  return title
    .replace(/\[(Official )?Video\]/gi, '')
    .replace(/\(Official Music Video\)/gi, '')
    .trim();
}

// Custom date extraction
const publishYear = new Date(video.publishedAt).getFullYear();
```

### Batch Processing
```typescript
const playlists = [
  { url: 'playlist1', topic: 'Topic 1' },
  { url: 'playlist2', topic: 'Topic 2' },
];

for (const playlist of playlists) {
  await parser.parsePlaylist(playlist.url, {
    topic: playlist.topic,
    // ... other options
  });
}
```

## 📝 Integration Workflow

### 1. Parse Playlist
Use the web interface or command line to generate the JSON file.

### 2. Review and Edit
- Check video titles and dates
- Adjust labels for better readability
- Remove or reorder cards if needed
- Add custom tooltips or quotes

### 3. Add to Game
```typescript
// lib/gameData.ts
import newPuzzle from './puzzles/your-new-puzzle.json';

export const puzzles = [
  // ... existing puzzles
  newPuzzle,
];
```

### 4. Test
- Verify cards display correctly
- Check video playback works
- Test timeline ordering
- Validate tooltip content

## ⚠️ Important Notes

### API Limits
- YouTube Data API has daily quotas
- Each playlist request costs quota units
- Monitor usage in Google Cloud Console

### Video Availability
- Some videos may be private/deleted
- Geographic restrictions may apply
- Age-restricted content might not work

### Best Practices
- Use public playlists for reliability
- Keep puzzles to 10-30 cards for optimal gameplay
- Sort chronologically for timeline puzzles
- Include tooltips for educational value
- Test with various playlist sizes

## 🐛 Troubleshooting

### Common Issues

**Invalid API Key**
```
YouTube API error: 403 - Forbidden
```
- Check API key is correct
- Verify YouTube Data API is enabled
- Check API key restrictions

**Private Playlist**
```
No videos found in the playlist or playlist is private/deleted
```
- Ensure playlist is public
- Check playlist URL is correct
- Verify playlist exists and has videos

**Quota Exceeded**
```
YouTube API error: 403 - quotaExceeded
```
- Wait for quota reset (daily)
- Consider requesting quota increase
- Use cached results when possible

## 🔄 Updates and Maintenance

### Adding New Features
- Extend `PuzzleOptions` interface
- Update web interface form
- Add new processing logic
- Update documentation

### Monitoring
- Track API usage in Google Cloud Console
- Monitor generated puzzle quality
- Collect user feedback on puzzles

## 🎨 Customization

### Video Title Cleanup
Add custom regex patterns to `formatLabel()`:
```typescript
private formatLabel(title: string): string {
  return title
    .replace(/your-custom-pattern/gi, '')
    .replace(/another-pattern/gi, '')
    .trim();
}
```

### Date Handling
Customize how dates are extracted:
```typescript
// Use video upload date vs publish date
const uploadYear = new Date(video.snippet.publishedAt).getFullYear();

// Or use custom date logic
const customDate = this.extractCustomDate(video.title);
```

### Output Format
Modify the puzzle structure:
```typescript
private createPuzzle(...) {
  return {
    // Standard fields
    slug: this.generateSlug(topic),
    topic,
    category,
    // Custom fields
    source: 'youtube-playlist',
    createdAt: new Date().toISOString(),
    cards,
  };
}
```

This system provides a powerful and flexible way to convert YouTube content into engaging timeline puzzles for your game! 