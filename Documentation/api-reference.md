# Timeline Puzzle Game - API Reference

## **Overview**
The Timeline Puzzle Game provides several API endpoints for puzzle generation, playlist parsing, and content management. All APIs follow RESTful conventions and return JSON responses.

## **Base Configuration**
- **Base URL**: `/api`
- **Response Format**: JSON
- **Authentication**: Not required for public endpoints
- **Rate Limiting**: Applied per endpoint (YouTube API quota limits)

---

## **Core Endpoints**

### **1. Generate Puzzle API**

#### `POST /api/generate`
**Purpose**: Generate a custom puzzle from natural language description using AI

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
{
  topic: string;              // Natural language puzzle description
}
```

**Special Modes**:
- **Songs Mode**: Prefix topic with `"songs:"` to generate music puzzles with Deezer integration
- **Example**: `"songs: 90s grunge music"`

**Example Requests**:

*Standard Puzzle*:
```json
{
  "topic": "Major events of World War II"
}
```

*Songs Mode*:
```json
{
  "topic": "songs: best rock anthems of the 80s"
}
```

**Response Schema**:

*Standard Puzzle Response*:
```typescript
{
  cards: EventCard[];
  category: string;
}
```

*Songs Mode Response*:
```typescript
{
  topic: string;
  category: "Entertainment";
  subcategory: "Music";
  cards: MusicCard[];
}
```

**Response Examples**:

*Success - Standard (200)*:
```json
{
  "cards": [
    {
      "label": "Attack on Pearl Harbor",
      "date": 1941,
      "source": "https://en.wikipedia.org/wiki/Attack_on_Pearl_Harbor",
      "id": "ugc-1234567890-0"
    }
  ],
  "category": "History"
}
```

*Success - Songs Mode (200)*:
```json
{
  "topic": "80s rock anthems",
  "category": "Entertainment", 
  "subcategory": "Music",
  "cards": [
    {
      "label": "Don't Stop Believin' – Journey",
      "date": 1981,
      "id": "ugc-1234567890-0",
      "deezer": {
        "trackId": "1234567"
      }
    }
  ]
}
```

**Error Responses**:
- `400`: Missing or invalid topic
- `405`: Method not allowed (only POST supported)
- `500`: AI generation failed or insufficient content found

---

### **2. Parse Playlist API**

#### `POST /api/parse-playlist`
**Purpose**: Convert YouTube playlist into a timeline puzzle

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```typescript
{
  playlistUrl: string;        // YouTube playlist URL
  topic: string;              // Puzzle title/topic
  category: string;           // Must be: History, Arts, Entertainment, Sports, Current Events
  subcategory: string;        // Custom subcategory description
  sortBy?: string;            // Default: 'chronological'
  maxCards?: number;          // Default: 200, max cards to include
  hideDates?: boolean;        // Default: false
  showTooltips?: boolean;     // Default: true
  includeTooltips?: boolean;  // Default: true
}
```

**Example Request**:
```json
{
  "playlistUrl": "https://www.youtube.com/playlist?list=PLXXXxxxx",
  "topic": "Greatest Rock Songs of All Time",
  "category": "Entertainment",
  "subcategory": "Music",
  "maxCards": 50,
  "sortBy": "chronological"
}
```

**Response Schema**:
```typescript
{
  success: boolean;
  puzzle?: Puzzle;
  message?: string;
  error?: string;
}
```

**Success Response (200)**:
```json
{
  "success": true,
  "puzzle": {
    "slug": "greatest-rock-songs-of-all-time",
    "topic": "Greatest Rock Songs of All Time",
    "category": "Entertainment",
    "subcategory": "Music",
    "cards": [
      {
        "id": "rock-1",
        "label": "Bohemian Rhapsody - Queen",
        "date": 1975,
        "videoUrl": "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
        "embedUrl": "https://www.youtube.com/embed/fJ9rUzIMcZQ"
      }
    ]
  },
  "message": "Successfully generated puzzle with 25 cards"
}
```

**Error Responses**:
- `400`: Missing required fields or invalid category
- `403`: YouTube API access denied or quota exceeded
- `404`: Playlist not found or private
- `405`: Method not allowed
- `500`: YouTube API key not configured or parsing failed

**Valid Categories**:
- `History`
- `Arts` 
- `Entertainment`
- `Sports`
- `Current Events`

---

### **3. Surprise Me API**

#### `POST /api/surprise`
**Purpose**: Generate a random puzzle from curated categories

**Request Body**: *(Implementation details available in endpoint)*

---

### **4. Save Puzzle API**

#### `POST /api/save-puzzle`
**Purpose**: Save a user-created puzzle (minimal implementation)

**Request Body**: *(Basic implementation for puzzle persistence)*

---

### **5. Hello API**

#### `GET /api/hello`
**Purpose**: Basic health check endpoint

**Response**:
```json
{
  "message": "Hello from the Timeline Puzzle API!"
}
```

---

## **Data Types**

### **EventCard**
```typescript
interface EventCard {
  id: string;
  label: string;
  date: number;
  source?: string;          // Wikipedia or other source URL
  videoUrl?: string;        // YouTube video URL
  embedUrl?: string;        // YouTube embed URL
}
```

### **MusicCard**
```typescript
interface MusicCard extends EventCard {
  deezer?: {
    trackId: string;        // Deezer track ID for audio preview
  };
}
```

### **Puzzle**
```typescript
interface Puzzle {
  slug: string;
  topic: string;
  category: string;
  subcategory?: string;
  cards: EventCard[];
  variantSystem?: {
    totalScenes: number;
    enhancedQueries: boolean;
  };
}
```

---

## **Error Handling**

### **Common Error Codes**
- `400 Bad Request`: Invalid request parameters
- `403 Forbidden`: API key issues or quota exceeded
- `404 Not Found`: Resource not found
- `405 Method Not Allowed`: Wrong HTTP method
- `500 Internal Server Error`: Server processing error

### **YouTube API Specific Errors**
- **Quota Exceeded**: Daily limit of 10,000 units reached
- **Access Denied**: API key invalid or restricted
- **Not Found**: Playlist is private, deleted, or doesn't exist
- **Invalid URL**: Malformed YouTube playlist URL

---

## **Rate Limiting**

### **YouTube API Constraints**
- **Daily Quota**: 10,000 units per day
- **Search Cost**: ~100 units per playlist parsing
- **Video Details**: ~1 unit per video
- **Quota Reset**: Midnight Pacific Time

### **Best Practices**
- Cache responses when possible
- Batch requests for multiple videos
- Monitor quota usage with `scripts/checkYouTubeQuota.js`
- Use single API key (Terms of Service compliant)

---

## **Authentication & Security**

### **Environment Variables Required**
```bash
# OpenAI API for puzzle generation
OPENAI_API_KEY=your_openai_api_key_here

# YouTube API for playlist parsing (single key compliance)
YOUTUBE_API_KEY=your_youtube_api_key_here

# OpenAI Model (optional, defaults to gpt-3.5-turbo)
OPENAI_MODEL=gpt-4
```

### **API Key Management**
- YouTube API keys managed through `youtubeApiKeys.js`
- Single Google Cloud project compliance
- Centralized key rotation system
- Quota monitoring and compliance verification

---

## **Development & Testing**

### **Local Development**
```bash
# Start development server
npm run dev

# Test API endpoints
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"topic": "Major events of the 1960s"}'
```

### **Environment Setup**
1. Copy `.env.example` to `.env.local` 
2. Add your API keys
3. Ensure YouTube API compliance (single project)
4. Test with playlist creator at `/playlist-creator`

---

## **Integration Examples**

### **Frontend Integration**
```typescript
// Generate puzzle from description
const generatePuzzle = async (topic: string) => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic })
  });
  return response.json();
};

// Parse YouTube playlist
const parsePlaylist = async (playlistData: PlaylistRequest) => {
  const response = await fetch('/api/parse-playlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playlistData)
  });
  return response.json();
};
```

### **Error Handling**
```typescript
try {
  const result = await generatePuzzle(topic);
  if (result.error) {
    console.error('API Error:', result.error);
    // Handle specific error cases
  }
} catch (error) {
  console.error('Network Error:', error);
}
```

---

**Last Updated**: Checkpoint: Party Mode Clean Up and Music Videos  
**API Version**: 2024 Enhanced Edition  
**Compliance Status**: ✅ YouTube ToS Compliant 