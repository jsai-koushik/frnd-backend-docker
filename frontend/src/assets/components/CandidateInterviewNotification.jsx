import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Bell, CalendarDays, ArrowRight, RefreshCw } from "lucide-react";

export default function CandidateInterviewNotification() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  async function fetchInterviews() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/interviews/my");
      if (!Array.isArray(response.data)) throw new Error("Unexpected response.");
      setInterviews(response.data);
    } catch (err) {
      setInterviews([]);
      setError(err.response?.data?.message || "Unable to check scheduled interviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchInterviews(); }, []);

  return (
    <section className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-indigo-100 p-3">
            <Bell className="text-indigo-600" size={23} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Interview Notifications</h2>
            {loading ? (
              <p className="mt-2 text-sm text-slate-600">Checking your interviews...</p>
            ) : error ? (
              <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>
            ) : interviews.length > 0 ? (
              <>
                <p className="mt-2 font-semibold text-indigo-700">
                  You have {interviews.length} scheduled {interviews.length === 1 ? "interview" : "interviews"}!
                </p>
                <div className="mt-3 space-y-2">
                  {interviews.map((iv) => (
                    <p key={iv.interviewId} className="text-sm text-slate-700">
                      <CalendarDays size={15} className="mr-2 inline text-indigo-600" />
                      <strong>{iv.jobTitle}</strong> — {iv.companyName} | {iv.interviewDate} at {iv.interviewTime}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No interviews scheduled yet.</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={fetchInterviews} disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <Link to="/candidate/interviews"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            My Interviews <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
