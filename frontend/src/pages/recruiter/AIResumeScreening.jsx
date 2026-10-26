import React, { useEffect, useState } from "react";
import { ArrowLeft, BrainCircuit, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getRecruiterJobs,
  getJobApplicants,
  screenApplicant,
  getAIErrorMessage,
} from "../../services/recruiterAIService";

function ResultList({ title, items }) {
  return (
    <section className="rounded-xl border border-slate-200 p-5">
      <h3 className="mb-3 font-bold text-slate-800">{title}</h3>

      {Array.isArray(items) && items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex gap-2 text-slate-600">
              <span className="text-indigo-600">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">No information returned.</p>
      )}
    </section>
  );
}

export default function AIResumeScreening() {
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [applicationId, setApplicationId] = useState("");
  const [result, setResult] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [screening, setScreening] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    if (!jobId) {
      setApplicants([]);
      setApplicationId("");
      return;
    }

    let active = true;

    async function loadApplicants() {
      setLoadingApplicants(true);
      setError("");
      setResult(null);
      setApplicationId("");
      setApplicants([]);

      try {
        const data = await getJobApplicants(jobId);

        if (active) {
          setApplicants(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (active) setError(getAIErrorMessage(err));
      } finally {
        if (active) setLoadingApplicants(false);
      }
    }

    loadApplicants();

    return () => {
      active = false;
    };
  }, [jobId]);

  async function handleScreening(event) {
    event.preventDefault();

    if (!applicationId) return;

    setScreening(true);
    setError("");
    setResult(null);

    try {
      const data = await screenApplicant(applicationId);
      setResult(data);
    } catch (err) {
      setError(getAIErrorMessage(err));
    } finally {
      setScreening(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/recruiter/ai"
          className="mb-6 inline-flex items-center gap-2 text-indigo-600 hover:underline"
        >
          <ArrowLeft size={18} /> Back to Recruiter AI
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <BrainCircuit className="text-indigo-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              AI Applicant Screening
            </h1>
            <p className="mt-1 text-slate-600">
              Compare a candidate profile with your job requirements.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleScreening}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-semibold text-slate-700">
              Select Your Job
            </label>

            <select
              value={jobId}
              onChange={(event) => setJobId(event.target.value)}
              disabled={loadingJobs}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500"
            >
              <option value="">
                {loadingJobs ? "Loading jobs..." : "Choose a job"}
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
              Select Applicant
            </label>

            <select
              value={applicationId}
              onChange={(event) => {
                setApplicationId(event.target.value);
                setResult(null);
              }}
              disabled={!jobId || loadingApplicants}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-indigo-500 disabled:bg-slate-100"
            >
              <option value="">
                {loadingApplicants
                  ? "Loading applicants..."
                  : "Choose an applicant"}
              </option>

              {applicants.map((applicant) => {
                const appId = applicant.applicationId || applicant.id;
                const appName =
                  applicant.candidateName ||
                  applicant.candidate?.name ||
                  applicant.applicantName ||
                  `Application #${appId}`;
                return (
                  <option key={appId} value={appId}>
                    {appName}
                  </option>
                );
              })}
            </select>

            {jobId && !loadingApplicants && applicants.length === 0 && (
              <p className="mt-2 text-sm text-slate-500">
                No applications were returned for this job.
              </p>
            )}
          </div>

          {error && (
            <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!applicationId || screening}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {screening ? (
              <>
                <Loader2 className="animate-spin" size={19} />
                Screening Applicant...
              </>
            ) : (
              <>
                <Search size={19} />
                Screen Applicant
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Screening Results
            </h2>

            <div className="rounded-xl bg-indigo-50 p-5">
              <h3 className="font-bold text-indigo-900">
                {result.candidateName || result.applicantName || "Candidate Profile"}
              </h3>
              <p className="mt-1 text-sm text-indigo-700">
                Applied for: {result.jobTitle || "Selected Position"}
              </p>
              <p className="mt-4 leading-7 text-slate-700">
                {result.matchSummary || result.summary}
              </p>
            </div>

            <ResultList
              title="Matching Skills"
              items={result.matchingSkills || result.matchedSkills}
            />

            <ResultList
              title="Missing or Unconfirmed Requirements"
              items={
                result.missingOrUnconfirmedRequirements ||
                result.missingRequirements
              }
            />

            <section className="rounded-xl border border-slate-200 p-5">
              <h3 className="mb-2 font-bold text-slate-800">
                Experience Compatibility
              </h3>
              <p className="leading-7 text-slate-600">
                {result.experienceCompatibility ||
                  result.experienceSummary ||
                  "Not provided."}
              </p>
            </section>

            <ResultList
              title="Suggested Interview Topics"
              items={result.suggestedInterviewTopics || result.interviewTopics}
            />

            <p className="text-sm text-slate-500">
              This assessment uses the available candidate profile, not an
              uploaded resume. Verify findings directly with the applicant.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}