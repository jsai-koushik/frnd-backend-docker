import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  BriefcaseBusiness,
  Video,
  RefreshCw,
  AlertCircle,
  Mail,
} from "lucide-react";

const API_URL = "";

export default function RecruiterInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchInterviews() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/recruiter/interviews");

      if (!Array.isArray(response.data)) {
        throw new Error("Unexpected interview response.");
      }

      setInterviews(response.data);
    } catch (err) {
      console.error("Failed to fetch interviews:", err);

      const data = err.response?.data;

      setError(
        (typeof data === "string" && data.trim()) ||
          data?.message ||
          err.message ||
          "Unable to load interviews."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">

        <Link
          to="/recruiter/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Scheduled Interviews
            </h1>

            <p className="mt-2 text-slate-500">
              View interviews scheduled for your job applicants.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchInterviews}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Scheduled Interviews
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {loading ? "..." : error ? "—" : interviews.length}
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-white p-12 text-center text-slate-500">
            Loading interviews...
          </div>
        ) : error ? null : interviews.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center">
            <CalendarDays
              size={42}
              className="mx-auto mb-4 text-slate-400"
            />

            <h2 className="text-xl font-semibold text-slate-800">
              No interviews scheduled yet
            </h2>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {interviews.map((interview) => (
              <article
                key={interview.interviewId}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="mb-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    {interview.jobTitle}
                  </h2>

                  <p className="mt-1 text-slate-500">
                    {interview.companyName}
                  </p>
                </div>

                <div className="space-y-3 text-sm text-slate-700">
                  <p className="flex items-center gap-2">
                    <UserRound size={17} />
                    {interview.candidateName}
                  </p>

                  <p className="flex items-center gap-2">
                    <Mail size={17} />
                    {interview.candidateEmail}
                  </p>

                  <p className="flex items-center gap-2">
                    <CalendarDays size={17} />
                    {interview.interviewDate}
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock3 size={17} />
                    {interview.interviewTime}
                  </p>

                  <p className="flex items-center gap-2">
                    <Video size={17} />
                    {interview.interviewType}
                  </p>

                  <p className="flex items-center gap-2">
                    <BriefcaseBusiness size={17} />
                    Interviewer: {interview.interviewerName}
                  </p>

                  <p>
                    <strong>Application Status:</strong>{" "}
                    {interview.applicationStatus}
                  </p>

                  <p>
                    <strong>Application ID:</strong>{" "}
                    {interview.applicationId}
                  </p>

                  {interview.meetingLink && (
                    <p className="break-all">
                      <strong>Meeting Link:</strong>{" "}
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Open Meeting
                      </a>
                    </p>
                  )}

                  {interview.notes && (
                    <p>
                      <strong>Notes:</strong> {interview.notes}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
