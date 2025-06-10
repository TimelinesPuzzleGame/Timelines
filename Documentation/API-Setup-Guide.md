# YouTube API Setup Guide

## **IMPORTANT: Terms of Service Compliance**

⚠️ **CRITICAL**: This project uses a **single Google Cloud project** with **one legitimate YouTube API key** to ensure full compliance with YouTube's Terms of Service. Multiple API keys or quota circumvention is strictly prohibited.

## **Current Setup (Post-Compliance)**

### **1. API Key Configuration**
The project uses a centralized API key management system located at `youtubeApiKeys.js`:

```javascript
const { getActiveKeys } = require('./youtubeApiKeys.js');
const YOUTUBE_API_KEYS = getActiveKeys(); // Returns array of legitimate keys
const apiKey = YOUTUBE_API_KEYS[0]; // Use first active key
```

### **2. Legitimate API Key Requirements**
- **Single Project**: All API keys must come from one Google Cloud project
- **Proper Quotas**: Use official daily quota limits (10,000 units/day)
- **No Circumvention**: Never use multiple projects to exceed quotas
- **Compliance Monitoring**: Regular quota usage monitoring

### **3. Getting Your API Key**

1. **Google Cloud Console Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create **ONE** project for Timeline Puzzle Game
   - Enable YouTube Data API v3
   - Create **ONE** API key with YouTube Data API v3 access

2. **Update youtubeApiKeys.js**:
   ```javascript
   // Replace with your legitimate API key
   const LEGITIMATE_KEYS = [
     'YOUR_SINGLE_LEGITIMATE_API_KEY_HERE'
   ];
   ```

### **4. Quota Management**
- **Daily Limit**: 10,000 units (resets midnight Pacific)
- **Search Cost**: ~100 units per search request
- **Video Details**: ~1 unit per video
- **Monitor Usage**: Use `scripts/checkYouTubeQuota.js`

### **5. DO NOT**
- ❌ Use multiple Google Cloud projects
- ❌ Create multiple API keys to circumvent quotas
- ❌ Share API keys between projects
- ❌ Use hardcoded API keys in multiple files

### **6. Compliance Verification**
Run this command to verify compliance:
```bash
node checkSpecificApiKey.js
```

## **Migration from Old System**

If upgrading from the old multi-key system:

1. **Remove all hardcoded API keys** from crawler files
2. **Update all crawlers** to use `getActiveKeys()` import
3. **Delete test API key files**
4. **Verify compliance** with quota monitoring

## **File Structure**
```
youtubeApiKeys.js           # Centralized API key management
scripts/
  checkYouTubeQuota.js      # Quota monitoring
  checkSpecificApiKey.js    # Key validation
crawlers/
  variantMegaCrawler.js     # Uses getActiveKeys()
  bttfCrawler.js           # Uses getActiveKeys()
  gibboanxBurnDownCrawler.js # Uses getActiveKeys()
```

## **Support**
For API setup issues, check:
1. `YOUTUBE_API_COMPLIANCE_GUIDE.md` for detailed compliance info
2. `YOUTUBE_CRAWLER_COMPREHENSIVE_SPEC.md` for crawler configuration
3. Google Cloud Console quota dashboard

## Step 1: Get YouTube Data API Key

### 1.1 Go to Google Cloud Console
Visit [Google Cloud Console](https://console.cloud.google.com/)

### 1.2 Create or Select Project
- If you don't have a project, click "Create Project"
- Give it a name like "Timeline Puzzle Generator"
- Click "Create"

### 1.3 Enable YouTube Data API v3
1. In the left sidebar, go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click on it and click "Enable"

### 1.4 Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the generated API key
4. Click "Restrict Key" for security

### 1.5 Restrict API Key (Recommended)
1. Under "API restrictions", select "Restrict key"
2. Check "YouTube Data API v3"
3. Under "Application restrictions", you can optionally restrict by:
   - HTTP referrers (for your domain)
   - IP addresses (for your server)
4. Click "Save"

## Step 2: Configure Environment Variables

### 2.1 Create Environment File
Create a `.env.local` file in your project root:

```env
# YouTube Data API v3 Key
YOUTUBE_API_KEY=your_actual_api_key_here
```

### 2.2 Example
```env
YOUTUBE_API_KEY=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw
```

⚠️ **Important**: Never commit your API key to version control!

### 2.3 Add to .gitignore
Make sure `.env.local` is in your `.gitignore` file:
```
.env.local
.env
```

## Step 3: Test the Integration

### 3.1 Start Your Development Server
```bash
npm run dev
```

### 3.2 Navigate to Playlist Creator
Go to `http://localhost:3000/playlist-creator`

### 3.3 Test with a Public Playlist
Use a public playlist URL like:
```
https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMpHz
```

### 3.4 Fill in Details
- **Topic**: "Test Playlist"
- **Category**: "Entertainment"
- **Subcategory**: "Music"
- **Max Cards**: 10 (for testing)

### 3.5 Generate Puzzle
Click "Generate Puzzle" and wait for results.

## Step 4: Troubleshooting

### Common Issues

#### API Key Not Working
```
Error: YouTube API key not configured
```
**Solution**: Make sure your `.env.local` file exists and has the correct variable name.

#### 403 Forbidden Error
```
Error: YouTube API access denied
```
**Solutions**:
- Check if YouTube Data API v3 is enabled
- Verify API key is correct
- Check API key restrictions
- Ensure you haven't exceeded quota limits

#### 404 Not Found Error
```
Error: Playlist not found or is private/deleted
```
**Solutions**:
- Use a public playlist
- Check the playlist URL is correct
- Make sure the playlist has videos

#### Quota Exceeded Error
```
Error: quotaExceeded
```
**Solutions**:
- Wait for daily quota reset (resets at midnight PST)
- Request quota increase in Google Cloud Console
- Use fewer API calls during development

### API Quota Limits
- **Default daily quota**: 10,000 units per day
- **Playlist items request**: ~3 units per page (50 videos)
- **Small playlist (10 videos)**: ~3 units
- **Large playlist (100 videos)**: ~6 units

## Step 5: Production Deployment

### 5.1 Environment Variables
Set `YOUTUBE_API_KEY` in your production environment:

**Vercel**:
```bash
vercel env add YOUTUBE_API_KEY
```

**Netlify**:
Add in site settings → Environment variables

**Other platforms**:
Follow their environment variable setup instructions.

### 5.2 API Key Security
- Use different API keys for development and production
- Set up proper restrictions for production keys
- Monitor usage in Google Cloud Console
- Set up alerts for unusual usage

## Step 6: Monitoring and Maintenance

### 6.1 Monitor API Usage
- Check Google Cloud Console regularly
- Set up billing alerts
- Monitor for unusual spikes

### 6.2 Error Handling
The system includes comprehensive error handling for:
- Invalid API keys
- Private/deleted playlists
- Quota exceeded errors
- Network timeouts
- Invalid URLs

### 6.3 Backup Plans
- Cache successful responses when possible
- Have manual puzzle creation as fallback
- Monitor for API changes/deprecation

## Example Usage

Once set up, you can:

1. **Use the Web Interface**: Go to `/playlist-creator`
2. **Use the API Directly**: 
   ```bash
   curl -X POST http://localhost:3000/api/parse-playlist \
     -H "Content-Type: application/json" \
     -d '{
       "playlistUrl": "https://www.youtube.com/playlist?list=...",
       "topic": "My Puzzle",
       "category": "Entertainment",
       "subcategory": "Music"
     }'
   ```

3. **Use the Command Line**: 
   ```bash
   YOUTUBE_API_KEY=your_key npm run tsx scripts/playlistParserExample.ts
   ```

## Success!
You should now be able to convert any public YouTube playlist into a timeline puzzle for your game! 🎉 