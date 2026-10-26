import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Video,
  UserRound,
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  FileText,
  RefreshCw,
  AlertCircle,
  LoaderCircle,
  ClipboardList,
} from "lucide-react";

const API_URL = "";

export default function CandidateInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH CANDIDATE INTERVIEWS
  // ==========================================

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/interviews/my");

      if (!Array.isArray(response.data)) {
        throw new Error(
          "Unexpected interview response from the server."
        );
      }

      setInterviews(response.data);
    } catch (err) {
      console.error(
        "Failed to fetch candidate interviews:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Authentication failed. Please log in again."
        );
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to view these interviews."
        );
      } else {
        const data = err.response?.data;

        setError(
          (typeof data === "string" && data.trim()) ||
            data?.message ||
            err.message ||
            "Unable to load your interviews."
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(date) {
    if (!date) return "Not available";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    const [year, month, day] = parts;

    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  // ==========================================
  // FORMAT TIME
  // ==========================================

  function formatTime(time) {
    if (!time) return "Not available";

    const [hours, minutes] = time.split(":").map(Number);

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes)
    ) {
      return time;
    }

    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* BACK BUTTON */}
        <Link
          to="/candidate/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Interviews
            </h1>

            <p className="mt-2 text-slate-500">
              View interviews scheduled by recruiters for
              your job applications.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchInterviews}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle
              size={20}
              className="shrink-0"
            />
            <p>{error}</p>
          </div>
        )}

        {/* INTERVIEW COUNT */}
        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-3">
              <CalendarDays
                size={25}
                className="text-indigo-600"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                My Scheduled Interviews
              </p>

              <p className="text-3xl font-bold text-slate-900">
                {loading ? "..." : error ? "—" : interviews.length}
              </p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-xl border bg-white p-12 text-slate-500">
            <LoaderCircle
              size={22}
              className="animate-spin"
            />
            Loading your interviews...
          </div>
        ) : error ? null : interviews.length === 0 ? (

          /* EMPTY STATE */
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <CalendarDays
              size={46}
              className="mx-auto mb-4 text-slate-400"
            />

            <h2 className="text-xl font-semibold text-slate-800">
              No interviews scheduled yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              When a recruiter schedules an interview for
              one of your applications, its details will
              appear here.
            </p>

            <Link
              to="/candidate/applications"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              <ClipboardList size={18} />
              View My Applications
            </Link>
          </div>
        ) : (

          /* INTERVIEW CARDS */
          <div className="grid gap-6 md:grid-cols-2">
            {interviews.map((interview) => (
              <article
                key={interview.interviewId}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                {/* JOB INFORMATION */}
                <div className="mb-5 border-b pb-5">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {interview.jobTitle}
                    </h2>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                      {interview.applicationStatus}
                    </span>
                  </div>

                  <p className="flex items-center gap-2 text-slate-600">
                    <Building2 size={17} />
                    {interview.companyName}
                  </p>
                </div>

                {/* INTERVIEW DETAILS */}
                <div className="space-y-4 text-sm text-slate-700">

                  <p className="flex items-center gap-3">
                    <CalendarDays
                      size={18}
                      className="shrink-0 text-indigo-600"
                    />

                    <span>
                      <strong>Date:</strong>{" "}
                      {formatDate(interview.interviewDate)}
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <Clock3
                      size={18}
                      className="shrink-0 text-indigo-600"
                    />

                    <span>
                      <strong>Time:</strong>{" "}
                      {formatTime(interview.interviewTime)}
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <Video
                      size={18}
                      className="shrink-0 text-indigo-600"
                    />

                    <span>
                      <strong>Interview Type:</strong>{" "}
                      {interview.interviewType}
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <UserRound
                      size={18}
                      className="shrink-0 text-indigo-600"
                    />

                    <span>
                      <strong>Interviewer:</strong>{" "}
                      {interview.interviewerName}
                    </span>
                  </p>

                  <p className="flex items-center gap-3">
                    <BriefcaseBusiness
                      size={18}
                      className="shrink-0 text-indigo-600"
                    />

                    <span>
                      <strong>Job ID:</strong>{" "}
                      {interview.jobId}
                    </span>
                  </p>

                  <p>
                    <strong>Application ID:</strong>{" "}
                    {interview.applicationId}
                  </p>

                  {/* MEETING LINK */}
                  {interview.meetingLink && (
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                      <p className="mb-2 font-semibold text-slate-800">
                        Meeting Link
                      </p>

                      {/^https?:\/\//i.test(interview.meetingLink) ? (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex max-w-full items-center gap-2 break-all font-medium text-blue-600 hover:underline"
                        >
                          <ExternalLink
                            size={17}
                            className="shrink-0"
                          />
                          Join / Open Meeting
                        </a>
                      ) : (
                        <p className="break-all text-slate-700">
                          {interview.meetingLink}
                        </p>
                      )}
                    </div>
                  )}

                  {/* NOTES */}
                  {interview.notes && (
                    <div className="rounded-lg bg-slate-50 p-4">
                      <p className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                        <FileText size={17} />
                        Interview Notes
                      </p>

                      <p className="whitespace-pre-wrap text-slate-600">
                        {interview.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="mt-6 border-t pt-4">
                  <Link
                    to={`/candidate/applications/${interview.applicationId}`}
                    className="inline-flex items-center gap-2 font-medium text-blue-600 hover:underline"
                  >
                    View Application Details
                    <ExternalLink size={16} />
                  </Link>
                </div>

              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
