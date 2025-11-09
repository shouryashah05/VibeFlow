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
1) "summary" – 5-sentence beginner-friendly overview.
2) "concepts" – list of main topics (e.g., loops, async, OOP).
3) "questions" – 5–7 viva-style questions specific to this project.

PROJECT DIGEST:
${project_digest}

Return ONLY valid JSON matching this structure:
{
  "summary": "string",
  "concepts": ["string"],
  "questions": ["string"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean markdown code blocks if present
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const json = JSON.parse(cleanText);
    
    res.json(json);
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Analysis failed', details: error.message });
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
2) "grey_areas" – up to 3 items with:
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
