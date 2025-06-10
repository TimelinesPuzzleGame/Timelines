# GPT Integration Guide

## Overview
This document describes the comprehensive OpenAI GPT integration used in the Timelines platform for dynamic puzzle generation, content curation, and user interaction processing.

## Architecture Overview

### Integration Points
1. **"Surprise Me" Feature**: Random puzzle generation from categories
2. **Natural Language Puzzle Creation**: User-described puzzle generation
3. **Content Quality Assessment**: Automated content evaluation
4. **Error Pattern Recognition**: Identify and correct common issues
5. **User Query Processing**: Natural language interface for puzzle requests

### GPT Model Configuration
- **Primary Model**: GPT-4-turbo (for high-quality generation)
- **Fallback Model**: GPT-3.5-turbo (for simple tasks)
- **Fine-tuned Models**: Category-specific models for specialized content
- **Context Window**: 8k tokens (standard), 32k tokens (extended tasks)

## System Prompts

### Base System Prompt
```
You are a content curator for Timelines, a timeline-based puzzle game. Your role is to create engaging, accurate, and well-balanced puzzles across various categories including movies, music, history, arts, sports, and current events.

Key Requirements:
1. All content must have verifiable dates
2. Maintain appropriate difficulty balance
3. Ensure cultural sensitivity and inclusivity
4. Prefer well-known, recognizable content
5. Avoid controversial or sensitive topics unless historically significant
6. Generate 10-15 items per puzzle unless specified otherwise

Response Format: Always respond with valid JSON matching the required schema.
```

### Category-Specific Prompts

#### Movies & TV
```
Focus on theatrical releases, major TV shows, and significant entertainment milestones. Include:
- Blockbuster films and critically acclaimed movies
- Popular TV series premieres and finales
- Award ceremonies and major film festivals
- Actor/director career milestones
- Franchise launches and memorable sequels

Avoid:
- Direct-to-video releases
- Obscure foreign films (unless historically significant)
- Adult content or excessive violence
- Recent releases still in theaters
```

#### Music
```
Include diverse musical content across genres and eras:
- Album releases and single debuts
- Concert tours and music festivals
- Award shows and chart achievements
- Artist debuts and career milestones
- Genre evolution and cultural movements

Considerations:
- Balance mainstream and influential underground music
- Include diverse artists across demographics
- Consider regional variations in release dates
- Prioritize songs with lasting cultural impact
```

#### Historical Events
```
Focus on verifiable historical facts with clear dates:
- Political events, elections, and government changes
- Wars, conflicts, and peace treaties
- Scientific discoveries and technological advances
- Social movements and cultural shifts
- Economic events and market changes

Requirements:
- Use precise dates when available
- Provide brief, neutral descriptions
- Include global perspective, not just Western events
- Fact-check against multiple sources
- Avoid oversimplification of complex events
```

#### Sports
```
Cover major sporting events and achievements:
- Olympic Games and World Championships
- Professional league finals and tournaments
- Record-breaking performances
- Team formations and relocations
- Significant rule changes and innovations

Include:
- Multiple sports and global competitions
- Both team and individual achievements
- Amateur and professional milestones
- Gender balance in sports coverage
- Historical firsts and significant records
```

## Generation Strategies

### Content Discovery Process
1. **Category Analysis**: Determine target category and subcategories
2. **Era Selection**: Choose appropriate time period (default: 1950-2023)
3. **Diversity Balancing**: Ensure representation across different aspects
4. **Difficulty Calibration**: Mix well-known and moderately obscure content
5. **Quality Filtering**: Exclude inappropriate or low-quality content

### Prompt Engineering Techniques

#### Few-Shot Examples
```json
{
  "examples": [
    {
      "category": "movies",
      "input": "Create a puzzle about 1990s action movies",
      "output": {
        "title": "1990s Action Blockbusters",
        "items": [
          {"title": "Terminator 2: Judgment Day", "year": 1991},
          {"title": "Jurassic Park", "year": 1993},
          {"title": "Speed", "year": 1994}
        ]
      }
    }
  ]
}
```

#### Chain-of-Thought Reasoning
```
Step 1: Identify the user's intent and category preferences
Step 2: Determine appropriate time period and scope
Step 3: Generate diverse content list with verified dates
Step 4: Balance difficulty and cultural representation
Step 5: Format as valid JSON with required fields
```

### Content Validation Rules

#### Date Verification
- Cross-reference release dates with multiple sources
- Handle regional release variations (use earliest major market)
- Account for festival premieres vs. wide releases
- Verify historical event dates against authoritative sources

#### Quality Scoring
- **Recognizability**: How well-known is this content? (1-10)
- **Accuracy**: How confident are we in the date? (1-10)
- **Appropriateness**: Suitable for general audience? (1-10)
- **Diversity**: Contributes to balanced representation? (1-10)

## API Integration

### OpenAI Client Configuration
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  maxRetries: 3,
  timeout: 30000, // 30 seconds
});
```

### Request Structure
```typescript
interface GPTRequest {
  model: 'gpt-4-turbo' | 'gpt-3.5-turbo';
  messages: ChatMessage[];
  temperature: number;       // 0.1-0.9, creativity vs consistency
  max_tokens: number;        // Response length limit
  response_format?: {        // For JSON mode
    type: 'json_object';
  };
  seed?: number;            // For reproducible outputs
}
```

### Response Processing
```typescript
interface GPTResponse {
  choices: {
    message: {
      content: string;
      role: 'assistant';
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

## Error Handling and Fallbacks

### Common Issues and Solutions

#### JSON Parsing Errors
```typescript
async function parseGPTResponse(response: string): Promise<PuzzleData> {
  try {
    return JSON.parse(response);
  } catch (error) {
    // Attempt to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid JSON response from GPT');
  }
}
```

#### Content Filtering
```typescript
function validateContent(items: TimelineItem[]): ValidationResult {
  const issues = [];
  
  items.forEach(item => {
    // Check for inappropriate content
    if (containsInappropriateContent(item.title)) {
      issues.push(`Inappropriate content: ${item.title}`);
    }
    
    // Verify date ranges
    if (item.year < 1850 || item.year > new Date().getFullYear()) {
      issues.push(`Invalid year: ${item.year} for ${item.title}`);
    }
    
    // Check for duplicates
    const duplicates = items.filter(i => i.title === item.title);
    if (duplicates.length > 1) {
      issues.push(`Duplicate content: ${item.title}`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    score: Math.max(0, 100 - (issues.length * 10))
  };
}
```

#### Retry Logic
```typescript
async function generateWithRetry(
  prompt: string, 
  maxRetries: number = 3
): Promise<PuzzleData> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: getSystemPrompt() },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3 + (attempt * 0.1), // Increase creativity on retries
        response_format: { type: 'json_object' }
      });
      
      const content = response.choices[0].message.content;
      const puzzle = await parseGPTResponse(content);
      const validation = validateContent(puzzle.items);
      
      if (validation.isValid) {
        return puzzle;
      } else if (attempt === maxRetries) {
        throw new Error(`Validation failed: ${validation.issues.join(', ')}`);
      }
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## Performance Optimization

### Caching Strategy
```typescript
interface CacheEntry {
  prompt: string;
  response: PuzzleData;
  timestamp: number;
  usage: TokenUsage;
}

const responseCache = new Map<string, CacheEntry>();

async function getCachedResponse(prompt: string): Promise<PuzzleData | null> {
  const cached = responseCache.get(prompt);
  if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
    return cached.response;
  }
  return null;
}
```

### Token Management
```typescript
function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

function optimizePrompt(userInput: string): string {
  const maxTokens = 4000; // Leave room for response
  const systemPromptTokens = estimateTokens(getSystemPrompt());
  const availableTokens = maxTokens - systemPromptTokens - 1000; // Buffer
  
  if (estimateTokens(userInput) > availableTokens) {
    return truncatePrompt(userInput, availableTokens);
  }
  return userInput;
}
```

### Batch Processing
```typescript
async function generateMultiplePuzzles(
  requests: GenerationRequest[]
): Promise<PuzzleData[]> {
  const batchSize = 5;
  const results: PuzzleData[] = [];
  
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(request => generateWithRetry(request.prompt))
    );
    results.push(...batchResults);
    
    // Rate limiting delay
    if (i + batchSize < requests.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}
```

## Quality Assurance

### Content Verification
```typescript
interface QualityMetrics {
  accuracy: number;        // Date and fact accuracy
  diversity: number;       // Representation balance
  difficulty: number;      // Appropriate challenge level
  engagement: number;      // Likely user interest
  appropriateness: number; // Content suitability
}

async function assessQuality(puzzle: PuzzleData): Promise<QualityMetrics> {
  const metrics = {
    accuracy: await verifyFactualAccuracy(puzzle.items),
    diversity: calculateDiversityScore(puzzle.items),
    difficulty: assessDifficultyBalance(puzzle.items),
    engagement: estimateEngagementLevel(puzzle.items),
    appropriateness: checkContentAppropriateness(puzzle.items)
  };
  
  return metrics;
}
```

### Human Review Integration
```typescript
interface ReviewQueue {
  puzzle: PuzzleData;
  qualityScore: number;
  flaggedIssues: string[];
  reviewStatus: 'pending' | 'approved' | 'rejected';
  reviewerNotes?: string;
}

function shouldRequireHumanReview(
  puzzle: PuzzleData, 
  quality: QualityMetrics
): boolean {
  return (
    quality.accuracy < 0.8 ||
    quality.appropriateness < 0.9 ||
    puzzle.items.some(item => isControversialTopic(item.title))
  );
}
```

## Monitoring and Analytics

### Usage Tracking
```typescript
interface GPTUsageMetrics {
  requestCount: number;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
  averageResponseTime: number;
  successRate: number;
  errorTypes: Record<string, number>;
  costEstimate: number;
}

function trackUsage(
  request: GPTRequest, 
  response: GPTResponse, 
  duration: number
): void {
  const metrics = getMetrics();
  metrics.requestCount++;
  metrics.tokenUsage.prompt += response.usage.prompt_tokens;
  metrics.tokenUsage.completion += response.usage.completion_tokens;
  metrics.tokenUsage.total += response.usage.total_tokens;
  metrics.averageResponseTime = 
    (metrics.averageResponseTime + duration) / 2;
}
```

### Cost Management
```typescript
const PRICING = {
  'gpt-4-turbo': { input: 0.01, output: 0.03 }, // per 1K tokens
  'gpt-3.5-turbo': { input: 0.001, output: 0.002 }
};

function calculateCost(usage: TokenUsage, model: string): number {
  const pricing = PRICING[model];
  const inputCost = (usage.prompt_tokens / 1000) * pricing.input;
  const outputCost = (usage.completion_tokens / 1000) * pricing.output;
  return inputCost + outputCost;
}
```

## Security and Compliance

### Input Sanitization
```typescript
function sanitizeUserInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove JavaScript
    .slice(0, 2000) // Limit length
    .trim();
}
```

### Content Filtering
```typescript
const BLOCKED_PATTERNS = [
  /adult content/i,
  /explicit material/i,
  /hate speech/i,
  // Add more patterns as needed
];

function containsInappropriateContent(text: string): boolean {
  return BLOCKED_PATTERNS.some(pattern => pattern.test(text));
}
```

### API Key Management
```typescript
// Rotate API keys periodically
const API_KEYS = [
  process.env.OPENAI_KEY_1,
  process.env.OPENAI_KEY_2,
  process.env.OPENAI_KEY_3
];

function getActiveAPIKey(): string {
  const index = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % API_KEYS.length;
  return API_KEYS[index];
}
```

## Future Enhancements

### Planned Features
1. **Fine-tuned Models**: Category-specific models for better accuracy
2. **Multi-modal Input**: Process images and audio for content identification
3. **Real-time Learning**: Incorporate user feedback for model improvement
4. **Collaborative Filtering**: Use community data to improve recommendations
5. **Advanced Personalization**: User preference learning for puzzle generation

### Research Areas
- **Fact Verification**: Automated fact-checking against multiple sources
- **Cultural Sensitivity**: Enhanced cultural awareness and inclusivity
- **Difficulty Calibration**: Dynamic difficulty adjustment based on user performance
- **Content Freshness**: Integration with real-time news and events

This GPT integration guide will be updated as new features are implemented and best practices evolve. 