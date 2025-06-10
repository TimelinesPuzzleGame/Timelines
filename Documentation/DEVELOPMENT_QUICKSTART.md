# Timeline Puzzle Game - Development Quickstart

## **🚀 New AI Agent Onboarding**

This guide gets new AI development agents up to speed quickly with the Timeline Puzzle Game project, providing everything needed to contribute immediately.

---

## **📊 Project At-a-Glance**

### **Current State (2024 Checkpoint)**
- **Framework**: Next.js 13+ with TypeScript and Tailwind CSS
- **Total Puzzles**: 155 active puzzles across 15+ categories
- **Video Content**: 310+ YouTube videos with verified embedding
- **Game Modes**: Standard Timeline + Party Mode (multiplayer)
- **API Endpoints**: 5 active endpoints for puzzle generation
- **Compliance Status**: ✅ YouTube ToS compliant (critical requirement)

### **Recent Major Work**
- ✅ YouTube API compliance remediation (149+ hardcoded keys removed)
- ✅ Music video puzzle enhancement (314→310 working videos)
- ✅ Test puzzle structure standardization (15 puzzles fixed)
- ✅ Party Mode functionality preservation and enhancement

---

## **🎯 Core System Architecture**

### **Key Directories**
```
Timeline-Puzzle-Game/
├── components/           # React components
├── lib/                 # Core game logic and data
│   ├── puzzles/         # 155 JSON puzzle files
│   ├── gameData.ts      # Central puzzle registry
│   └── types.ts         # TypeScript interfaces
├── pages/              # Next.js pages and API routes
│   ├── api/            # Backend API endpoints
│   └── *.tsx           # Game pages
├── public/             # Static assets
├── scripts/            # Utility and crawler scripts
├── youtubeApiKeys.js   # 🚨 CRITICAL: Centralized API key management
└── Documentation/      # All project documentation
```

### **Critical Files to Understand**
1. **`youtubeApiKeys.js`** - ⚠️ COMPLIANCE CRITICAL - Single API key management
2. **`lib/gameData.ts`** - Central puzzle registry (155 puzzles)
3. **`lib/types.ts`** - TypeScript interfaces for all data structures
4. **`components/Timeline.tsx`** - Core game component
5. **`pages/api/generate.ts`** - AI puzzle generation endpoint

---

## **🚨 CRITICAL: YouTube API Compliance**

### **MUST READ FIRST**
Before any YouTube API work, read:
1. `Documentation/YOUTUBE_API_COMPLIANCE_GUIDE.md`
2. `Documentation/API-Setup-Guide.md`

### **Compliance Rules (NEVER VIOLATE)**
```javascript
// ✅ CORRECT: Use centralized system
const { getActiveKeys } = require('./youtubeApiKeys.js');
const YOUTUBE_API_KEYS = getActiveKeys();

// ❌ NEVER DO: Hardcode API keys
const API_KEY = "AIzaSy..."; // This violates YouTube ToS
```

### **Key Compliance Points**
- **Single Project**: Only use ONE Google Cloud project
- **Centralized Keys**: All API keys in `youtubeApiKeys.js`
- **Quota Limits**: 10,000 units/day maximum
- **No Circumvention**: Never create multiple projects for quota

---

## **⚡ Quick Development Setup**

### **1. Environment Setup**
```bash
# Clone and install
git clone [repository]
cd timeline-puzzle-game
npm install

# Environment variables
cp .env.example .env.local
# Add your API keys to .env.local:
# OPENAI_API_KEY=your_openai_key
# YOUTUBE_API_KEY=your_single_compliant_youtube_key
```

### **2. Verify Compliance**
```bash
# Check API key compliance
node checkSpecificApiKey.js

# Verify no hardcoded keys exist
grep -r "AIzaSy" --exclude="youtubeApiKeys.js" *.js
# Should return NO results
```

### **3. Start Development**
```bash
# Start development server
npm run dev

# Open browser
http://localhost:3000
```

---

## **🧩 Understanding the Puzzle System**

### **Puzzle Structure**
```typescript
interface Puzzle {
  slug: string;           // URL-friendly identifier
  topic: string;          // Display name
  category: string;       // Main category
  cards: EventCard[];     // Timeline items
  variantSystem?: {       // Enhanced features
    totalScenes: number;
    enhancedQueries: boolean;
  };
}

interface EventCard {
  id: string;
  label: string;          // Display text
  date: number;           // Year or timestamp
  videoUrl?: string;      // YouTube URL
  embedUrl?: string;      // YouTube embed URL
}
```

### **Adding New Puzzles**
1. **Create JSON file** in `lib/puzzles/`
2. **Add import** to `lib/gameData.ts`
3. **Add to puzzles array** in `lib/gameData.ts`
4. **Test in browser** - puzzle should appear in game

### **Example Puzzle File**
```json
{
  "slug": "test-puzzle",
  "topic": "Test Timeline",
  "category": "Entertainment",
  "cards": [
    {
      "id": "test-1",
      "label": "First Event",
      "date": 2020
    },
    {
      "id": "test-2", 
      "label": "Second Event",
      "date": 2021
    }
  ]
}
```

---

## **🎮 Game Modes**

### **Standard Timeline Mode**
- Single player arranges cards chronologically
- Drag and drop interface
- Immediate feedback (green/red)
- Score tracking

### **Party Mode (Multiplayer)**
- Up to 8 players per session
- Real-time collaboration on single timeline
- Room codes for private sessions
- Turn-based gameplay with group discussion

### **Key Components**
- `components/Timeline.tsx` - Core timeline interface
- `components/PartyMode/` - Multiplayer components
- `lib/party-mode.ts` - Party mode logic

---

## **🔧 Common Development Tasks**

### **1. Adding Video Content**
```bash
# Use playlist creator web interface
http://localhost:3000/playlist-creator

# Or use API directly
curl -X POST http://localhost:3000/api/parse-playlist \
  -H "Content-Type: application/json" \
  -d '{"playlistUrl": "...", "topic": "...", "category": "Entertainment"}'
```

### **2. Testing Video Embedding**
```javascript
// Check if video can be embedded
const testEmbed = (videoId) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  // Test in iframe - should not show "Video unavailable"
};
```

### **3. Debugging Puzzle Issues**
```javascript
// Check puzzle structure
const puzzle = require('./lib/puzzles/your-puzzle.json');
console.log(`Puzzle has ${puzzle.cards.length} cards`);
console.log('Date range:', Math.min(...puzzle.cards.map(c => c.date)), 
                          Math.max(...puzzle.cards.map(c => c.date)));
```

### **4. API Usage Examples**
```javascript
// Generate puzzle with AI
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'Major events of the 1990s' })
});

// Songs mode (includes Deezer integration)
const songsResponse = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic: 'songs: best rock anthems' })
});
```

---

## **🐛 Common Issues & Solutions**

### **YouTube Video Problems**
```bash
# Problem: Videos not embedding
# Solution: Check embedding permissions
node scripts/testVideoEmbedding.js

# Problem: API quota exceeded
# Solution: Check quota usage
node scripts/checkYouTubeQuota.js
```

### **Puzzle Not Showing**
1. **Check import** in `lib/gameData.ts`
2. **Verify JSON format** - use JSON validator
3. **Check console** for TypeScript errors
4. **Verify file path** - should be in `lib/puzzles/`

### **Party Mode Issues**
1. **WebSocket connections** - check browser console
2. **Room codes** - verify generation and validation
3. **State synchronization** - check real-time updates

---

## **📚 Essential Documentation**

### **Must Read for Development**
1. **`game-overview.md`** - Complete feature overview
2. **`YOUTUBE_API_COMPLIANCE_GUIDE.md`** - Critical compliance rules
3. **`api-reference.md`** - API endpoints and usage
4. **`party-mode-guide.md`** - Multiplayer features

### **Reference Documents**
1. **`API-Setup-Guide.md`** - Environment setup
2. **`Music-Video-Groundrules.md`** - Content curation rules
3. **`DOCUMENT_REGISTRY.md`** - All documentation index

---

## **🎯 Development Workflow**

### **Before Starting Any Task**
1. **Git pull** latest changes
2. **Check compliance** - run compliance verification
3. **Read relevant docs** - ensure understanding
4. **Plan approach** - consider impact on existing features

### **For YouTube API Work**
1. **Verify compliance first** - check `youtubeApiKeys.js`
2. **Test quota usage** - monitor API calls
3. **Use centralized system** - never hardcode keys
4. **Document changes** - update compliance tracking

### **For New Features**
1. **Check existing patterns** - follow established conventions
2. **Update TypeScript types** - add to `lib/types.ts`
3. **Add tests** - verify functionality works
4. **Update documentation** - document new features

### **Before Committing**
1. **Test functionality** - verify changes work
2. **Check compliance** - no hardcoded API keys
3. **Update documentation** - if needed
4. **Run quality checks** - lint, type check

---

## **🚀 Quick Wins for New Contributors**

### **Easy First Tasks**
1. **Add new puzzle category** - create JSON file and add to gameData.ts
2. **Fix broken video links** - update URLs in existing puzzles
3. **Improve error messages** - enhance user feedback
4. **Add new API validation** - strengthen input checking

### **Medium Complexity Tasks**
1. **Enhance Party Mode features** - add new multiplayer functionality
2. **Improve video embedding** - better fallback systems
3. **Add puzzle filtering** - search and categorization
4. **Optimize performance** - loading and caching improvements

### **Advanced Tasks**
1. **New AI integration** - enhance puzzle generation
2. **Advanced compliance monitoring** - automated quota tracking
3. **Real-time improvements** - WebSocket optimization
4. **Content management system** - admin interface for puzzles

---

## **📞 Getting Help**

### **Documentation Resources**
- **Complete API docs**: `api-reference.md`
- **Compliance requirements**: `YOUTUBE_API_COMPLIANCE_GUIDE.md`
- **Feature overview**: `game-overview.md`
- **All docs index**: `DOCUMENT_REGISTRY.md`

### **Code References**
- **Puzzle examples**: `lib/puzzles/` directory
- **Component patterns**: `components/` directory
- **API implementations**: `pages/api/` directory
- **Utility scripts**: `scripts/` directory

### **Debugging Tools**
```bash
# Check API keys
node checkSpecificApiKey.js

# Monitor quota
node scripts/checkYouTubeQuota.js

# Test video embedding
node scripts/testVideoEmbedding.js

# Validate puzzle structure
node scripts/validatePuzzles.js
```

---

**Last Updated**: Checkpoint: Party Mode Clean Up and Music Videos  
**Quick Start Version**: 2024 Enhanced Edition  
**Next Steps**: Choose a task from the Quick Wins section and start contributing! 