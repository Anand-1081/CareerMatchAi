# CareerMatch AI

A small, polished AI portfolio project that compares a job description with a user's skills and produces a practical match report.

## Features

- Responsive React + Tailwind UI
- Job description + skills input
- AI match score
- Matching skills
- Missing skills
- Important keywords
- Recommended next steps
- Loading/error states
- Gemini API kept on the server
- Local fallback analysis when no API key is configured

## Requirements

- Node.js 18+
- A Gemini API key for AI mode

## Run locally

### 1. Start the backend

```bash
cd server
npm install
copy .env.example .env
```

Open `server/.env` and set:

```env
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
```

Then:

```bash
npm run dev
```

### 2. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

http://localhost:5173

## Without an API key

The app still runs and uses a simple local keyword-based fallback. Add the Gemini key when you want AI-generated analysis.

## Project structure

```text
CareerMatch-AI/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## Portfolio description

CareerMatch AI is an AI-powered job matching tool that analyzes a job description against a candidate's skills, identifies skill gaps and important keywords, and generates practical preparation recommendations. The project uses React, Tailwind CSS, Node.js, Express and Gemini through a server-side API layer.
