# VibeFlow Backend - Jury Mode API

Backend proxy server for Jury Mode using Gemini 2.0 Flash-Lite.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your Gemini API key:**
   Edit `.env` and replace `your_api_key_here` with your actual Gemini API key.

3. **Start the server:**
   ```bash
   npm run dev
   ```

Server runs on `http://localhost:3001`

## Get Gemini API Key

1. Go to: https://aistudio.google.com/apikey
2. Create a new API key
3. Copy and paste it into `backend/.env`

## Endpoints

- `GET /health` - Health check
- `POST /jury/analyze` - Analyze project digest
- `POST /jury/evaluate` - Evaluate user answers

## Rate Limits

- 10 requests per minute (RPM)
- 500 requests per day (RPD)
