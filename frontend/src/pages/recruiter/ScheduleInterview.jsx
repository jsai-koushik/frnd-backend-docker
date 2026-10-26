import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Video,
  Link2,
  UserRound,
  FileText,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL = "";

const initialForm = {
  interviewDate: "",
  interviewTime: "",
  interviewType: "ONLINE",
  meetingLink: "",
  interviewerName: "",
  notes: "",
};

export default function ScheduleInterview() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.interviewDate ||
      !form.interviewTime ||
      !form.interviewType.trim() ||
      !form.interviewerName.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const selectedDateTime = new Date(
      `${form.interviewDate}T${form.interviewTime}:00`
    );

    if (
      Number.isNaN(selectedDateTime.getTime()) ||
      selectedDateTime <= new Date()
    ) {
      setError("Please select a future interview date and time.");
      return;
    }

    const payload = {
      interviewDate: form.interviewDate,
      interviewTime: form.interviewTime,
      interviewType: form.interviewType.trim(),
      meetingLink: form.meetingLink.trim(),
      interviewerName: form.interviewerName.trim(),
      notes: form.notes.trim(),
    };

    setSaving(true);

    try {
      await api.post(
        `/api/recruiter/interviews/${applicationId}`,
        payload
      );

      setSuccess("Interview scheduled successfully!");

      // Backend automatically updates application status
      // to INTERVIEW_SCHEDULED.

      setTimeout(() => {
        navigate("/recruiter/interviews", {
          replace: true,
        });
      }, 1000);
    } catch (err) {
      console.error("Interview scheduling failed:", err);

      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (err.response?.status === 403) {
        setError(
          "You do not have permission to schedule this interview."
        );
      } else {
        const data = err.response?.data;

        setError(
          (typeof data === "string" && data.trim()) ||
            data?.message ||
            err.message ||
            "Unable to schedule interview."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">

        <Link
          to="/recruiter/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-7">
          <h1 className="text-3xl font-bold text-slate-900">
            Schedule Interview
          </h1>

          <p className="mt-2 text-slate-500">
            Schedule an interview for Application ID: {applicationId}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
          >
            <CheckCircle2 size={20} />
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm"
        >
          {/* INTERVIEW DATE */}
          <div>
            <label
              htmlFor="interviewDate"
              className="mb-2 flex items-center gap-2 font-medium text-slate-700"
            >
              <CalendarDays size={18} />
              Interview Date *
            </label>

            <input
              id="interviewDate"
              type="date"
              name="interviewDate"
              value={form.interviewDate}
              min={localToday}
              onChange={handleChange}
              required
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* INTERVIEW TIME */}
          <div>
            <label
              htmlFor="interviewTime"
              className="mb-2 flex items-center gap-2 font-medium text-slate-700"
            >
              <Clock3 size={18} />
              Interview Time *
            </label>

            <input
              id="interviewTime"
              type="time"
              name="interviewTime"
              value={form.interviewTime}
              onChange={handleChange}
              required
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* INTERVIEW TYPE */}
          <div>
            <label
              htmlFor="interviewType"
              className="mb-2 flex items-center gap-2 font-medium text-slate-700"
            >
              <Video size={18} />
              Interview Type *
            </label>

            <select
              id="interviewType"
              name="interviewType"
              value={form.interviewType}
              onChange={handleChange}
              required
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="TELEPHONIC">Telephonic</option>
            </select>

            <p className="mt-1 text-xs text-slate-500">
              These are frontend suggestions; the backend stores
              interview type as a string.
            </p>
          </div>

          {/* MEETING LINK */}
          <div>
            <label
              htmlFor="meetingLink"
              className="mb-2 flex items-center gap-2 font-medium text-slate-700"
            >
              <Link2 size={18} />
              Meeting Link (Optional)
            </label>

            <input
              id="meetingLink"
              type="url"
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              disabled={saving}
              placeholder="https://meet.google.com/..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* INTERVIEWER NAME */}
          <div>
            <label
              htmlFor="interviewerName"
              className="mb-2 flex items-center gap-2 font-medium text-slate-700"
            >
              <UserRound size={18} />
              Interviewer Name *
            </label>

            <input
              id="interviewerName"
              type="text"
              name="interviewerName"
              value={form.interviewerName}
              onChange={handleChange}
              required
              disabled={saving}
              placeholder="Enter interviewer name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* NOTES */}
          <div>
            <label
              htmlFor="notes"
              className="mb-2 flex items-center gap-2 font-medium text-slate-700"
            >
              <FileText size={18} />
              Interview Notes (Optional)
            </label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              disabled={saving}
              rows={4}
              placeholder="Technical interview, topics to prepare, etc."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
            <Link
              to="/recruiter/dashboard"
              className="rounded-lg border px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || Boolean(success)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <CalendarDays size={18} />
              )}

              {saving ? "Scheduling..." : "Schedule Interview"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
