import { useState } from "react";
import {
  ArrowRight, BrainCircuit, BriefcaseBusiness, CheckCircle2, ChevronRight,
  FileText, Lightbulb, Loader2, Search, Sparkles, Target, TriangleAlert, XCircle
} from "lucide-react";

const sampleJob = `We are looking for a Frontend Developer Intern to build responsive web applications.
Requirements: React, JavaScript, HTML, CSS, Git, REST APIs. Knowledge of TypeScript, Docker and AWS is a plus.
You should understand component-based architecture, state management, API integration and responsive design.`;

const sampleSkills = `React, JavaScript, HTML5, CSS3, Tailwind CSS, Node.js, Express.js, MongoDB, Git, REST APIs`;

function ScoreRing({ score }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative grid h-36 w-36 place-items-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="9" className="text-slate-800" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeWidth="9"
          strokeLinecap="round" className="text-indigo-400 transition-all duration-700"
          strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="text-center">
        <div className="text-3xl font-bold text-white">{score}%</div>
        <div className="text-xs text-slate-400">match</div>
      </div>
    </div>
  );
}

function Pill({ children, tone = "indigo" }) {
  const tones = {
    indigo: "bg-indigo-500/10 text-indigo-300 ring-indigo-500/20",
    green: "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-300 ring-amber-500/20",
    red: "bg-rose-500/10 text-rose-300 ring-rose-500/20"
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${tones[tone]}`}>{children}</span>;
}

function ResultCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-glow">
      <div className="mb-4 flex items-center gap-2">
        <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-300"><Icon size={17} /></div>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [job, setJob] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    setError("");
    setResult(null);
    if (!job.trim() || !skills.trim()) {
      setError("Please enter both the job description and your skills.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: job, skills })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not analyze the job.");
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setJob(sampleJob);
    setSkills(sampleSkills);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500 p-2 text-white shadow-lg shadow-indigo-500/20"><BrainCircuit size={20}/></div>
            <div><div className="font-bold text-white">CareerMatch AI</div><div className="text-xs text-slate-500">Job Match Copilot</div></div>
          </div>
          <button onClick={loadDemo} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/5">
            Try demo <ChevronRight size={15}/>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-300">
            <Sparkles size={13}/> AI-powered career matching
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Know your <span className="text-indigo-400">job match</span> before you apply.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Paste a job description and your skills. CareerMatch AI identifies your strengths, skill gaps and the keywords you should focus on.
          </p>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><BriefcaseBusiness size={16} className="text-indigo-300"/> Job description</label>
            <textarea value={job} onChange={e => setJob(e.target.value)} placeholder="Paste the job description here..."
              className="min-h-72 w-full rounded-xl border border-white/10 bg-slate-900/80 p-4 text-sm leading-6 text-slate-200 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/10"/>
            <div className="mt-2 text-right text-xs text-slate-600">{job.length} characters</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><FileText size={16} className="text-indigo-300"/> Your skills / resume summary</label>
            <textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="Example: React, Java, SQL, Node.js, Git..."
              className="min-h-72 w-full rounded-xl border border-white/10 bg-slate-900/80 p-4 text-sm leading-6 text-slate-200 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/10"/>
            <div className="mt-2 text-right text-xs text-slate-600">{skills.length} characters</div>
          </div>
        </section>

        {error && <div className="mt-5 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300"><TriangleAlert size={17}/>{error}</div>}

        <div className="mt-6 flex justify-center">
          <button onClick={analyze} disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <><Loader2 size={18} className="animate-spin"/> Analyzing...</> : <><Search size={18}/> Analyze my match <ArrowRight size={17}/></>}
          </button>
        </div>

        {result && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between">
              <div><p className="text-sm font-medium text-indigo-300">Analysis complete</p><h2 className="mt-1 text-2xl font-bold text-white">Your CareerMatch report</h2></div>
              <Pill tone="green">AI analysis</Pill>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <ResultCard icon={Target} title="Overall match">
                <div className="flex items-center gap-5"><ScoreRing score={result.matchScore}/><p className="text-sm leading-6 text-slate-400">{result.summary}</p></div>
              </ResultCard>

              <ResultCard icon={CheckCircle2} title="Matching skills">
                <div className="flex flex-wrap gap-2">{result.matchingSkills?.map((x,i)=><Pill key={i} tone="green">{x}</Pill>)}</div>
              </ResultCard>

              <ResultCard icon={XCircle} title="Skill gaps">
                <div className="flex flex-wrap gap-2">{result.missingSkills?.map((x,i)=><Pill key={i} tone="red">{x}</Pill>)}</div>
              </ResultCard>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <ResultCard icon={Search} title="Important keywords">
                <div className="flex flex-wrap gap-2">{result.keywords?.map((x,i)=><Pill key={i}>{x}</Pill>)}</div>
              </ResultCard>
              <ResultCard icon={Lightbulb} title="Recommended next steps">
                <ul className="space-y-3 text-sm leading-6 text-slate-300">
                  {result.recommendations?.map((x,i)=><li key={i} className="flex gap-2"><ChevronRight size={17} className="mt-1 shrink-0 text-indigo-300"/>{x}</li>)}
                </ul>
              </ResultCard>
            </div>
          </section>
        )}

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            ["01","Paste","Add the job description you want to target."],
            ["02","Compare","AI compares the role with your skills."],
            ["03","Improve","Focus your preparation on the actual gaps."]
          ].map(([n,t,d]) => <div key={n} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><div className="text-xs font-bold text-indigo-400">{n}</div><div className="mt-2 font-semibold text-white">{t}</div><p className="mt-1 text-sm leading-6 text-slate-500">{d}</p></div>)}
        </section>
      </main>

      <footer className="border-t border-white/10 py-7 text-center text-xs text-slate-600">CareerMatch AI • Built as a portfolio project</footer>
    </div>
  );
}