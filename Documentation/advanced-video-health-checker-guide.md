# Advanced Video Health Checker - Quick Start Guide

## 🎯 Overview
The Advanced Video Health Checker is a comprehensive tool for validating YouTube videos in puzzle files. It detects removed videos, copyright issues, geo-restrictions, private videos, and other problems that could break your puzzles.

## 🚀 Quick Start

### Check All Puzzles
```bash
node scripts/advancedVideoHealthChecker.js
```
This will scan all puzzle files in the `lib/puzzles` directory and generate a comprehensive report.

### Check Specific Puzzle
```bash
node scripts/advancedVideoHealthChecker.js --puzzle lib/puzzles/comedy-movies.json
```
Perfect for testing after editing a specific puzzle file.

### Test Single Video
```bash
node scripts/advancedVideoHealthChecker.js --video "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```
Useful for testing videos before adding them to puzzles.

## 📊 Understanding the Output

### Real-Time Console Output
```
🧩 Checking puzzle: iconicMovieDanceScenes.json
==================================================
📹 Found 11 video cards to check

📦 Batch 1/4 (1-3)
🔍 Checking video health: Ddm8l1VlFgg (Anchors Aweigh – Gene Kelly and Jerry)
✅ Video healthy: Anchors Aweigh - Gene Kelly - worry song
❌ Video error: Video not found or deleted - Video not found, removed, or private
⚠️  Video has warnings: Rocky Horror Picture Show The Time Warp
   - Video is unlisted (may become inaccessible)
```

### Status Icons
- ✅ **Healthy**: Video is working perfectly
- ⚠️ **Warning**: Video works but has potential issues  
- ❌ **Error**: Video is broken and needs attention

### Final Report
```
🎯 ADVANCED VIDEO HEALTH REPORT
===============================

📊 OVERALL STATISTICS:
   Total videos checked: 11
   ✅ Healthy: 9 (82%)
   ⚠️  Warnings: 1 (9%)
   ❌ Errors: 1 (9%)

🚨 ERROR BREAKDOWN:
   Video not found or deleted: 1 videos
   Video is a trailer (should be removed): 3 videos

⚠️  WARNING BREAKDOWN:
   Video is private or unlisted: 1 videos
```

## 🔧 Common Issues & Solutions

### ❌ **Critical Errors**

#### "Video not found or deleted"
- **Cause**: Video was removed by uploader or YouTube
- **Solution**: Remove from puzzle or find replacement video
- **Example**: Movie trailer taken down due to copyright

#### "Video is private or unlisted"  
- **Cause**: Uploader changed privacy settings
- **Solution**: Contact uploader or find alternative
- **Example**: Behind-the-scenes content made private

#### "Embedding disabled"
- **Cause**: Uploader disabled third-party embedding
- **Solution**: Find embeddable alternative
- **Example**: Official music videos often disable embedding

#### "Geographic restrictions"
- **Cause**: Video blocked in certain countries
- **Solution**: Find region-appropriate alternative
- **Example**: Music videos blocked in US due to licensing

#### "Video is a trailer (should be removed)"
- **Cause**: Detected promotional trailer content in movie puzzle
- **Solution**: Remove trailer and find actual scene from the movie
- **Example**: "The Matrix | Official Trailer" should be replaced with actual movie scene

### ⚠️ **Warnings to Monitor**

#### "Video is unlisted"
- **Risk**: May become inaccessible without notice
- **Action**: Monitor regularly or find public alternative

#### "Age-restricted content"  
- **Risk**: May require age verification for some users
- **Action**: Consider if appropriate for your audience

#### "Copyright issues mentioned"
- **Risk**: May be taken down in future
- **Action**: Have backup alternatives ready

## 📄 Generated Reports

### JSON Report File
Each run creates a detailed report: `video-health-report-YYYY-MM-DD.json`

**Contains:**
- Overall statistics and health percentages
- Complete results for every video checked
- Full metadata for working videos
- Detailed error descriptions
- Timestamps for tracking changes over time

### Report Structure
```json
{
  "summary": {
    "totalChecked": 50,
    "healthy": 45,
    "warnings": 3,
    "errors": 2,
    "healthPercentage": 90
  },
  "results": {
    "healthy": [...],
    "warnings": [...], 
    "errors": [...]
  }
}
```

## 🕒 Best Practices

### Regular Monitoring Schedule
- **Daily**: Check puzzles being actively worked on
- **Weekly**: Health check of all active puzzles  
- **Monthly**: Comprehensive check of entire library
- **Before Release**: Always validate before publishing

### Batch Processing
The tool automatically processes videos in small batches to avoid rate limiting:
- 3 videos per batch
- 2-second pause between batches
- 15-second timeout for API calls

### Performance Tips
- Run during off-peak hours for faster API responses
- Use specific puzzle checking for faster iteration
- Monitor the generated reports to track health trends

## 🔍 Advanced Usage

### Environment Variables
```bash
# Set your own YouTube API key
export YOUTUBE_API_KEY="your-api-key-here"
node scripts/advancedVideoHealthChecker.js
```

### Filtering Results
You can parse the JSON report to find specific issues:
```bash
# Find all videos with copyright warnings
cat video-health-report-2024-01-15.json | jq '.results.warnings[] | select(.warnings[].type == "Copyright claim or strike")'
```

## 🛠 Troubleshooting

### Common Issues

#### "API quota exceeded"
- **Cause**: Hit YouTube API rate limits
- **Solution**: Wait or use different API key
- **Prevention**: Run during off-peak hours

#### Script hangs on video check
- **Cause**: Network issues or slow video response
- **Solution**: Ctrl+C and retry, check internet connection
- **Note**: Script has built-in 15-second timeouts

#### Permission errors reading files
- **Cause**: File permissions or path issues  
- **Solution**: Check file exists and is readable
- **Example**: `node scripts/advancedVideoHealthChecker.js --puzzle /full/path/to/puzzle.json`

### Getting Help
- Check the detailed JSON report for more information
- Use single video testing to isolate problems  
- Verify puzzle file format is valid JSON
- Ensure YouTube API key has proper permissions

## 📈 Interpreting Health Trends

### Good Health Indicators
- **>90% healthy videos**: Excellent puzzle health
- **<5% errors**: Acceptable error rate
- **Stable percentages**: No degradation over time

### Warning Signs  
- **Increasing error rates**: Videos being taken down
- **High warning counts**: Potential future problems
- **Sudden drops**: Possible copyright strikes or policy changes

### Action Triggers
- **>10% errors**: Immediate attention needed
- **>20% warnings**: Review and plan replacements
- **Month-over-month decline**: Investigate trends

This health checker ensures your puzzle library stays robust and provides the best experience for users! 