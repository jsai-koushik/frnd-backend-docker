import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  BriefcaseBusiness,
  MessageSquareText,
  Users,
  Lightbulb,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import api from "../../api/axios";
import { prepareInterview, getAIErrorMessage } from "../../assets/components/services/aiService";

export default function CandidateInterviewPrep() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [result, setResult] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

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

  async function handleGenerate(e) {
    e.preventDefault();
    if (!selectedJobId) return;

    const count = Number(numberOfQuestions);
    if (!Number.isInteger(count) || count < 1 || count > 20) {
      setError("Number of questions must be between 1 and 20.");
      return;
    }

    setGenerating(true);
    setError("");
    setResult(null);

    try {
      const data = await prepareInterview(selectedJobId, count);
      setResult(data);
    } catch (err) {
      setError(getAIErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  const technical = Array.isArray(result?.technicalQuestions)
    ? result.technicalQuestions
    : [];
  const hr = Array.isArray(result?.hrQuestions)
    ? result.hrQuestions
    : [];
  const tips = Array.isArray(result?.preparationTips)
    ? result.preparationTips
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
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 p-8 text-white shadow-lg md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
            <Sparkles size={16} />
            Powered by SmartHire AI
          </div>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            AI Interview Preparation
          </h1>
          <p className="mt-4 max-w-2xl text-indigo-100">
            Generate practice interview questions based on the job you are
            applying for. Prepare smarter and walk in with confidence.
          </p>
        </section>

        {/* FORM */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
              <MessageSquareText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Generate Practice Questions
              </h2>
              <p className="text-sm text-slate-500">
                Select the job you are preparing for.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">

            {/* JOB SELECT */}
            <div>
              <label
                htmlFor="job-select"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Job
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
                    {loadingJobs ? "Loading jobs..." : "Choose a job to prepare for"}
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
            </div>

            {/* QUESTION COUNT */}
            <div>
              <label
                htmlFor="q-count"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Number of Questions (1 – 20)
              </label>
              <input
                id="q-count"
                type="number"
                min={1}
                max={20}
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                disabled={generating}
                className="w-40 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
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

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={!selectedJobId || generating || loadingJobs}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? (
                  <LoaderCircle size={20} className="animate-spin" />
                ) : (
                  <Sparkles size={20} />
                )}
                {generating ? "Generating Questions..." : "Generate Questions"}
              </button>

              {result && (
                <button
                  type="button"
                  onClick={() => { setResult(null); setSelectedJobId(""); }}
                  disabled={generating}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LOADING */}
        {generating && (
          <section className="mt-8 rounded-2xl border border-indigo-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <BrainCircuit size={32} className="animate-pulse text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Generating your practice questions...
            </h3>
            <p className="mt-2 text-slate-500">This may take up to 30 seconds.</p>
            <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-600" />
            </div>
          </section>
        )}

        {/* RESULTS */}
        {result && !generating && (
          <section className="mt-10 space-y-6" aria-live="polite">
            <div className="flex items-center gap-3">
              <Sparkles size={27} className="text-indigo-600" />
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Practice Questions
                </h2>
                <p className="text-sm text-slate-500">
                  {result.jobTitle || "Selected Job"}
                </p>
              </div>
            </div>

            {/* TECHNICAL */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <BriefcaseBusiness className="text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  Technical Questions
                </h3>
              </div>
              {technical.length ? (
                <ol className="list-inside list-decimal space-y-4 text-slate-700">
                  {technical.map((q, i) => (
                    <li key={i} className="leading-7">{q}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-slate-500">No technical questions returned.</p>
              )}
            </div>

            {/* HR */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <Users className="text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  HR Questions
                </h3>
              </div>
              {hr.length ? (
                <ol className="list-inside list-decimal space-y-4 text-slate-700">
                  {hr.map((q, i) => (
                    <li key={i} className="leading-7">{q}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-slate-500">No HR questions returned.</p>
              )}
            </div>

            {/* TIPS */}
            {tips.length > 0 && (
              <div className="rounded-2xl border border-amber-100 bg-white p-7 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Lightbulb className="text-amber-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Preparation Tips
                  </h3>
                </div>
                <ul className="space-y-4">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Lightbulb size={17} className="mt-1 shrink-0 text-amber-600" />
                      <span className="leading-7 text-slate-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center pb-6">
              <button
                type="button"
                onClick={() => { setResult(null); setSelectedJobId(""); }}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                <RotateCcw size={19} />
                Prepare for Another Job
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
