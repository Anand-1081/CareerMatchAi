import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const fallbackAnalyze = (jobDescription, skillsText) => {
  const normalize = s => s.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ");
  const job = normalize(jobDescription);
  const skills = skillsText.split(/[,\\n]/).map(s => s.trim()).filter(Boolean);
  const matching = skills.filter(s => job.includes(normalize(s))).slice(0, 12);
  const common = ["react","javascript","typescript","html","css","node.js","node","express","mongodb","sql","git","docker","aws","python","java","rest api","tailwind"];
  const missing = common.filter(x => job.includes(x) && !skills.some(s => normalize(s).includes(x))).slice(0, 8);
  const score = Math.max(15, Math.min(95, Math.round((matching.length / Math.max(1, matching.length + missing.length)) * 100)));
  return {
    matchScore: score,
    summary: "This is a local fallback analysis. Add a Gemini API key for a richer AI-generated report.",
    matchingSkills: matching.length ? matching : ["Review the job description against your current skills"],
    missingSkills: missing.length ? missing : ["No obvious gaps detected from the supplied skills"],
    keywords: common.filter(x => job.includes(x)).slice(0, 10),
    recommendations: [
      "Prioritize the missing skills that appear repeatedly in the job description.",
      "Use the important keywords naturally in your resume when they accurately describe your experience.",
      "Build or document one small project that demonstrates your most important skill gap."
    ]
  };
};

function cleanJson(text) {
  const stripped = text.replace(/```json|```/gi, "").trim();
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("AI returned an invalid response.");
  return JSON.parse(stripped.slice(start, end + 1));
}

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/analyze", async (req, res) => {
  try {
    const { jobDescription, skills } = req.body;
    if (!jobDescription?.trim() || !skills?.trim()) {
      return res.status(400).json({ error: "Job description and skills are required." });
    }
    if (!ai) return res.json(fallbackAnalyze(jobDescription, skills));

    const prompt = `You are a practical career matching assistant.
Compare the user's supplied skills/resume summary with the job description.
Do not invent experience, skills, metrics, qualifications or achievements.
Return ONLY valid JSON with exactly these keys:
matchScore (integer 0-100),
summary (string, max 40 words),
matchingSkills (array of strings, max 12),
missingSkills (array of strings, max 12),
keywords (array of strings, max 12),
recommendations (array of strings, max 5).
Base the score on evidence in the supplied text, not on assumptions.

JOB DESCRIPTION:
${jobDescription}

USER SKILLS / RESUME SUMMARY:
${skills}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { temperature: 0.2 }
    });

    const data = cleanJson(response.text || "");
    if (typeof data.matchScore !== "number") throw new Error("Invalid AI response.");
    res.json({
      matchScore: Math.max(0, Math.min(100, Math.round(data.matchScore))),
      summary: String(data.summary || ""),
      matchingSkills: Array.isArray(data.matchingSkills) ? data.matchingSkills : [],
      missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : [],
      keywords: Array.isArray(data.keywords) ? data.keywords : [],
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI analysis failed. Check your API key/model and try again." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CareerMatch API running on http://localhost:${PORT}`));