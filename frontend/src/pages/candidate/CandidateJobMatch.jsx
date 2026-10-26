import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from "lucide-react";

import api from "../../api/axios";
import { matchJob, getAIErrorMessage } from "../../assets/components/services/aiService";

const AI_TIMEOUT = 90000;

export default function CandidateJobMatch() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [result, setResult] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState("");

  // Load available jobs on mount
  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    setError("");
    try {
      const response = await api.get("/api/jobs");
      const data = response.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];
      setJobs(list);
    } catch (err) {
      setError(getAIErrorMessage(err));
    } finally {
      setLoadingJobs(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleMatch(e) {
    e.preventDefault();
    if (!selectedJobId) return;

    setMatching(true);
    setError("");
    setResult(null);

    try {
      const data = await matchJob(selectedJobId);
      setResult(data);
    } catch (err) {
      setError(getAIErrorMessage(err));
    } finally {
      setMatching(false);
    }
  }

  const matchingSkills = Array.isArray(result?.matchingSkills)
    ? result.matchingSkills
    : [];
  const missingSkills = Array.isArray(result?.missingSkills)
    ? result.missingSkills
    : [];
  const recommendations = Array.isArray(result?.recommendations)
    ? result.recommendations
    : [];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAV */}
      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            to="/candidate/dashboard"
            className="flex items-center gap-2 text-2xl font-bold text-indigo-700"
          >
            <BrainCircuit size={28} />
            SmartHire
          </Link>
          <Link
            to="/candidate/dashboard"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-10">

        {/* HERO */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-600 to-blue-600 p-8 text-white shadow-lg md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
            <Sparkles size={16} />
            Powered by SmartHire AI
          </div>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            AI Job Match Analyzer
          </h1>
          <p className="mt-4 max-w-2xl text-indigo-100">
            Select a job to see how well your profile matches the requirements
            and get personalised improvement recommendations.
          </p>
        </section>

        {/* JOB SELECTOR */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
              <BriefcaseBusiness size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Select a Job to Analyse
              </h2>
              <p className="text-sm text-slate-500">
                Your candidate profile will be compared against the job requirements.
              </p>
            </div>
          </div>

          <form onSubmit={handleMatch} className="space-y-5">
            <div>
              <label
                htmlFor="job-select"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Available Jobs
              </label>

              <div className="flex gap-3">
                <select
                  id="job-select"
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    setResult(null);
                    setError("");
                  }}
                  disabled={loadingJobs}
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                >
                  <option value="">
                    {loadingJobs ? "Loading jobs..." : "Choose a job to match"}
                  </option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} — {job.companyName}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={fetchJobs}
                  disabled={loadingJobs}
                  className="rounded-xl border border-slate-300 px-3 py-3 hover:bg-slate-100 disabled:opacity-50"
                  title="Refresh jobs"
                >
                  <RefreshCw
                    size={18}
                    className={loadingJobs ? "animate-spin text-indigo-600" : "text-slate-500"}
                  />
                </button>
              </div>

              {!loadingJobs && jobs.length === 0 && (
                <p className="mt-2 text-sm text-slate-500">
                  No jobs available. Browse the{" "}
                  <Link to="/candidate/jobs" className="text-indigo-600 underline">
                    jobs page
                  </Link>{" "}
                  to see listings.
                </p>
              )}
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={19} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedJobId || matching || loadingJobs}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {matching ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <Sparkles size={20} />
              )}
              {matching ? "Analysing Match..." : "Analyse My Match"}
            </button>
          </form>
        </section>

        {/* LOADING */}
        {matching && (
          <section className="mt-8 rounded-2xl border border-indigo-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <BrainCircuit size={32} className="animate-pulse text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Comparing your profile with the job requirements...
            </h3>
            <p className="mt-2 text-slate-500">
              This may take up to 30 seconds.
            </p>
            <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-600" />
            </div>
          </section>
        )}

        {/* RESULTS */}
        {result && !matching && (
          <section className="mt-10 space-y-6" aria-live="polite">
            <div className="flex items-center gap-3">
              <Sparkles size={27} className="text-indigo-600" />
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Match Results
                </h2>
                <p className="text-sm text-slate-500">
                  {result.jobTitle} — {result.companyName}
                </p>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Match Summary
              </h3>
              <p className="leading-8 text-slate-700">
                {result.matchSummary || "No summary available."}
              </p>
            </div>

            {/* EXPERIENCE */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-slate-900">
                Experience Compatibility
              </h3>
              <p className="leading-8 text-slate-700">
                {result.experienceCompatibility || "Not assessed."}
              </p>
            </div>

            {/* SKILLS SIDE BY SIDE */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-green-100 bg-white p-7 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle2 className="text-green-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Matching Skills
                  </h3>
                </div>
                {matchingSkills.length ? (
                  <ul className="space-y-3">
                    {matchingSkills.map((skill, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={17} className="shrink-0 text-green-600" />
                        <span className="text-slate-700">{skill}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">No matching skills identified.</p>
                )}
              </div>

              <div className="rounded-2xl border border-red-100 bg-white p-7 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <XCircle className="text-red-500" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Missing / Unconfirmed Skills
                  </h3>
                </div>
                {missingSkills.length ? (
                  <ul className="space-y-3">
                    {missingSkills.map((skill, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <XCircle size={17} className="shrink-0 text-red-500" />
                        <span className="text-slate-700">{skill}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">No missing skills identified.</p>
                )}
              </div>
            </div>

            {/* RECOMMENDATIONS */}
            <div className="rounded-2xl border border-amber-100 bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Lightbulb className="text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Recommendations
                </h3>
              </div>
              {recommendations.length ? (
                <ul className="space-y-4">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Lightbulb size={17} className="mt-1 shrink-0 text-amber-600" />
                      <span className="leading-7 text-slate-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500">No recommendations returned.</p>
              )}
            </div>

            <div className="flex justify-center pb-6">
              <button
                type="button"
                onClick={() => { setResult(null); setSelectedJobId(""); }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                <RefreshCw size={18} />
                Analyse Another Job
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
