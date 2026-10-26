import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Loader2,
  MessageSquareText,
  Copy,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  getRecruiterJobs,
  generateInterviewQuestions,
  getAIErrorMessage,
} from "../../services/recruiterAIService";

function QuestionSection({ title, questions }) {
  return (
    <section className="rounded-xl border border-slate-200 p-5">
      <h3 className="mb-4 text-lg font-bold text-slate-800">{title}</h3>

      {Array.isArray(questions) && questions.length > 0 ? (
        <ol className="list-inside list-decimal space-y-4 text-slate-700">
          {questions.map((question, index) => (
            <li key={index} className="leading-7">
              {question}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-slate-500">No questions returned.</p>
      )}
    </section>
  );
}

export default function AIInterviewQuestions() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [result, setResult] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      try {
        const data = await getRecruiterJobs();

        if (active) {
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) setError(getAIErrorMessage(err));
      } finally {
        if (active) setLoadingJobs(false);
      }
    }

    loadJobs();

    return () => {
      active = false;
    };
  }, []);

  async function handleGenerate(event) {
    event.preventDefault();

    if (!jobId) return;

    setGenerating(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const data = await generateInterviewQuestions(
        jobId,
        Number(numberOfQuestions)
      );

      setResult(data);
    } catch (err) {
      setError(getAIErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  }

  async function handleCopy() {
    if (!result) return;

    const content = [
      `Interview Questions: ${result.jobTitle || "Selected Job"}`,
      "",
      "TECHNICAL QUESTIONS",
      ...(result.technicalQuestions || []).map(
        (question, index) => `${index + 1}. ${question}`
      ),
      "",
      "BEHAVIORAL QUESTIONS",
      ...(result.behavioralQuestions || []).map(
        (question, index) => `${index + 1}. ${question}`
      ),
      "",
      "INTERVIEWER GUIDANCE",
      ...(result.interviewerGuidance || []).map(
        (guidance, index) => `${index + 1}. ${guidance}`
      ),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch {
      setError("Unable to copy. Please select and copy the text manually.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/recruiter/ai"
          className="mb-6 inline-flex items-center gap-2 text-indigo-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Recruiter AI
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <BrainCircuit size={32} className="text-indigo-600" />

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              AI Interview Question Generator
            </h1>

            <p className="mt-2 text-slate-600">
              Generate relevant interview questions using your job description.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleGenerate}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Select Job
            </label>

            <select
              value={jobId}
              onChange={(event) => {
                setJobId(event.target.value);
                setResult(null);
              }}
              disabled={loadingJobs}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500"
            >
              <option value="">
                {loadingJobs ? "Loading jobs..." : "Choose your job"}
              </option>

              {jobs.map((job) => {
                const jId = job.id || job.jobId;
                const jTitle = job.title || job.jobTitle || "Untitled Job";
                const jCompany = job.companyName || "";
                return (
                  <option key={jId} value={jId}>
                    {jTitle} {jCompany ? `— ${jCompany}` : ""}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Number of Questions
            </label>

            <input
              type="number"
              min="1"
              max="20"
              required
              value={numberOfQuestions}
              onChange={(event) => setNumberOfQuestions(event.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500"
            />

            <p className="mt-2 text-sm text-slate-500">
              Choose between 1 and 20 questions.
            </p>
          </div>

          {error && (
            <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={
              !jobId ||
              generating ||
              !Number.isInteger(Number(numberOfQuestions)) ||
              Number(numberOfQuestions) < 1 ||
              Number(numberOfQuestions) > 20
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Generating Questions...
              </>
            ) : (
              <>
                <MessageSquareText size={19} />
                Generate Interview Questions
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Generated Questions
                </h2>

                <p className="mt-1 text-slate-500">
                  {result.jobTitle || "Selected Position"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 font-semibold text-indigo-600 hover:bg-indigo-50"
              >
                <Copy size={17} />
                {copied ? "Copied!" : "Copy All"}
              </button>
            </div>

            <QuestionSection
              title="Technical Questions"
              questions={result.technicalQuestions}
            />

            <QuestionSection
              title="Behavioral Questions"
              questions={result.behavioralQuestions}
            />

            <section className="rounded-xl border border-slate-200 p-5">
              <h3 className="mb-4 text-lg font-bold text-slate-800">
                Interviewer Guidance
              </h3>

              <ul className="list-inside list-disc space-y-3 text-slate-700">
                {(result.interviewerGuidance || []).map((guidance, index) => (
                  <li key={index} className="leading-7">
                    {guidance}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}