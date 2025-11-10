import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting tracking (simple in-memory)
const rateLimits = new Map();

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userLimits = rateLimits.get(ip) || { requests: [], dailyCount: 0, dailyReset: now + 86400000 };
  
  // Reset daily count if needed
  if (now > userLimits.dailyReset) {
    userLimits.dailyCount = 0;
    userLimits.dailyReset = now + 86400000;
  }
  
  // Check daily limit (500 RPD)
  if (userLimits.dailyCount >= 500) {
    return { allowed: false, reason: 'Daily limit reached (500 requests)' };
  }
  
  // Filter requests from last minute
  userLimits.requests = userLimits.requests.filter(t => t > now - 60000);
  
  // Check per-minute limit (10 RPM)
  if (userLimits.requests.length >= 10) {
    return { allowed: false, reason: 'Rate limit exceeded (10 requests per minute)' };
  }
  
  // Update tracking
  userLimits.requests.push(now);
  userLimits.dailyCount++;
  rateLimits.set(ip, userLimits);
  
  return { allowed: true };
};

// POST /jury/analyze
app.post('/jury/analyze', async (req, res) => {
  try {
    const ip = req.ip;
    const rateCheck = checkRateLimit(ip);
    
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason });
    }
    
    const { project_digest } = req.body;
    
    if (!project_digest) {
      return res.status(400).json({ error: 'project_digest is required' });
    }
    
    const prompt = `You are Jury Mode of VibeFlow, an AI mentor.
Analyze the following project digest and return JSON with:

1) "metrics" – code quality metrics object with:
   - "memory_management": number 0-10 (memory efficiency, 10=best)
   - "algorithmic_complexity": number 0-10 (time complexity, 0=O(1), 10=O(n!))
   - "runtime_efficiency": number 0-10 (performance, 10=best)
   - "security": "Low" | "Medium" | "High" (risk level)
   - "reliability": { "handled": number, "unhandled": number } (error handling counts)
   - "maintainability": "Good" | "Fair" | "Poor" (code quality)
   - "scalability": number 0-10 (modularity and extensibility, 10=best)

2) "summary" – 5-sentence beginner-friendly overview.

3) "concepts" – list of main topics (e.g., loops, async, OOP).

4) "questions" – EXACTLY 10 questions total:
   - First 7 questions: conceptual/viva-style questions about the project
   - Last 3 questions: coding questions that require code snippets as answers

PROJECT DIGEST:
${project_digest}

Return ONLY valid JSON matching this structure:
{
  "metrics": {
    "memory_management": 0,
    "algorithmic_complexity": 0,
    "runtime_efficiency": 0,
    "security": "Low",
    "reliability": { "handled": 0, "unhandled": 0 },
    "maintainability": "Good",
    "scalability": 0
  },
  "summary": "string",
  "concepts": ["string"],
  "questions": ["string"]
}`;

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini API');
    
    const text = result.response.text();
    console.log('Response text length:', text.length);
    
    // Clean markdown code blocks if present
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const json = JSON.parse(cleanText);
    
    console.log('Successfully parsed JSON response');
    res.json(json);
  } catch (error) {
    console.error('Analyze error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error.message,
      type: error.constructor.name
    });
  }
});

// POST /jury/evaluate
app.post('/jury/evaluate', async (req, res) => {
  try {
    const ip = req.ip;
    const rateCheck = checkRateLimit(ip);
    
    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason });
    }
    
    const { project_summary, answers } = req.body;
    
    if (!project_summary || !answers) {
      return res.status(400).json({ error: 'project_summary and answers are required' });
    }
    
    const prompt = `You are the Jury AI in VibeFlow.
Evaluate each Q&A pair and return:
1) "overall_feedback" – 3 sentences about strengths + improvements.
2) "overall_score" – score out of 10 based on answer quality (number 0-10).
3) "coding_understanding" – score out of 10 for coding knowledge (number 0-10).
4) "grey_areas" – up to 3 items with:
   • "topic"
   • "micro_lesson" (2 sentences)
   • "before_after" with exactly 4 total lines (2 "before", 2 "after").

PROJECT SUMMARY:
${project_summary}

Q&A LIST:
${JSON.stringify(answers, null, 2)}

Return ONLY valid JSON matching this structure:
{
  "overall_feedback": "string",
  "overall_score": 0,
  "coding_understanding": 0,
  "grey_areas": [
    {
      "topic": "string",
      "micro_lesson": "string",
      "before_after": {
        "before": "line1\\nline2",
        "after": "line1\\nline2"
      }
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean markdown code blocks if present
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const json = JSON.parse(cleanText);
    
    res.json(json);
  } catch (error) {
    console.error('Evaluate error:', error);
    res.status(500).json({ error: 'Evaluation failed', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'VibeFlow Jury Mode API' });
});

app.listen(PORT, () => {
  console.log(`🎯 Jury Mode API running on http://localhost:${PORT}`);
  console.log(`📊 Rate limits: 10 RPM, 500 RPD`);
});
