
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  CheckCircle2,
  Lightbulb,
  BriefcaseBusiness,
  LoaderCircle,
  RotateCcw,
  BrainCircuit,
  AlertCircle,
} from "lucide-react";

import { analyzeResume } from "../../assets/components/services/aiService";

export default function CandidateResumeAnalysis() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resumeText.trim()) {
      setError("Please enter your resume details.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await analyzeResume(resumeText);

      const parsed =
        typeof data === "string" ? JSON.parse(data) : data;

      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Invalid analysis response.");
      }

      setResult(parsed);
    } catch (err) {
      const status = err.response?.status ?? err.status;

      if (status === 502 || status === 503) {
        setError("AI is temporarily busy. Please try again shortly.");
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to analyze resume."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResumeText("");
    setResult(null);
    setError("");
  };

  const skills = Array.isArray(result?.identifiedSkills)
    ? result.identifiedSkills
    : [];

  const strengths = Array.isArray(result?.strengths)
    ? result.strengths
    : [];

  const improvements = Array.isArray(result?.improvementSuggestions)
    ? result.improvementSuggestions
    : [];

  const roles = Array.isArray(result?.recommendedJobRoles)
    ? result.recommendedJobRoles
    : [];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* NAVBAR */}

      <nav className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
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

      <main className="mx-auto max-w-6xl px-5 py-10">

        {/* HERO */}

        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 p-8 text-white shadow-lg md:p-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
            <Sparkles size={16} />
            Powered by SmartHire AI
          </div>

          <h1 className="text-3xl font-extrabold md:text-4xl">
            AI Resume Analyzer
          </h1>

          <p className="mt-4 max-w-2xl text-indigo-100">
            Discover your strengths, identify missing details,
            and explore career opportunities based on your resume.
          </p>
        </section>

        {/* INPUT FORM */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Resume
              </h2>
              <p className="text-sm text-slate-500">
                Enter your professional details below.
              </p>
            </div>
          </div>

          <form onSubmit={handleAnalyze}>
            <label
              htmlFor="resume"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Resume Content
            </label>

            <textarea
              id="resume"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={11}
              disabled={loading}
              placeholder={`Professional Summary:

Technical Skills:

Education:

Projects:

Work Experience:

Certifications:`}
              className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50 p-5 text-sm leading-7 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Include your skills, projects and experience.</span>
              <span>{resumeText.length} characters</span>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={19} className="shrink-0" />
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={loading || !resumeText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle size={20} className="animate-spin" />
                ) : (
                  <Sparkles size={20} />
                )}

                {loading ? "Analyzing Resume..." : "Analyze My Resume"}
              </button>

              <button
                type="button"
                onClick={reset}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* LOADING ANIMATION */}

        {loading && (
          <section
            role="status"
            className="mt-8 rounded-2xl border border-indigo-100 bg-white p-10 text-center shadow-sm"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
              <BrainCircuit
                size={32}
                className="animate-pulse text-indigo-600"
              />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              SmartHire AI is analyzing your resume
            </h3>

            <p className="mt-2 text-slate-500">
              Please wait while we generate your personalized report.
            </p>

            <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-600" />
            </div>
          </section>
        )}

        {/* DYNAMIC AI RESULTS */}

        {result && (
          <section className="mt-10 space-y-6" aria-live="polite">

            <div className="flex items-center gap-3">
              <Sparkles size={27} className="text-indigo-600" />

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Your Resume Analysis
                </h2>
                <p className="text-sm text-slate-500">
                  Generated from your submitted resume.
                </p>
              </div>
            </div>

            {/* SUMMARY */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <FileText className="text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  Professional Summary
                </h3>
              </div>

              <p className="whitespace-pre-wrap leading-8 text-slate-700">
                {result.summary || "No summary available."}
              </p>
            </div>

            {/* SKILLS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="mb-5 text-xl font-bold text-slate-900">
                Identified Skills
              </h3>

              <div className="flex flex-wrap gap-3">
                {skills.length ? (
                  skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500">
                    No skills identified.
                  </p>
                )}
              </div>
            </div>

            {/* STRENGTHS AND IMPROVEMENTS */}

            <div className="grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border border-green-100 bg-white p-7 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <CheckCircle2 className="text-green-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Your Strengths
                  </h3>
                </div>

                {strengths.length ? (
                  <ul className="space-y-4">
                    {strengths.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2
                          size={19}
                          className="mt-1 shrink-0 text-green-600"
                        />
                        <span className="leading-7 text-slate-700">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">
                    No strengths returned.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-amber-100 bg-white p-7 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Lightbulb className="text-amber-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    Areas to Improve
                  </h3>
                </div>

                {improvements.length ? (
                  <ul className="space-y-4">
                    {improvements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Lightbulb
                          size={19}
                          className="mt-1 shrink-0 text-amber-600"
                        />
                        <span className="leading-7 text-slate-700">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">
                    No improvement suggestions returned.
                  </p>
                )}
              </div>

            </div>

            {/* RECOMMENDED ROLES */}

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <BriefcaseBusiness className="text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-900">
                  Recommended Job Roles
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {roles.length ? (
                  roles.map((role, index) => (
                    <div
                      key={`${role}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-5 transition hover:border-indigo-300 hover:shadow-md"
                    >
                      <div className="rounded-lg bg-white p-2 text-indigo-600">
                        <BriefcaseBusiness size={20} />
                      </div>

                      <span className="font-semibold text-slate-800">
                        {role}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">
                    No job roles recommended.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center pb-6">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                <RotateCcw size={19} />
                Analyze Another Resume
              </button>
            </div>

          </section>
        )}
      </main>
    </div>
  );
}
