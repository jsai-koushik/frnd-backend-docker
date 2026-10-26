
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  LoaderCircle,
} from "lucide-react";

const API_BASE_URL = "";

const initialForm = {
  title: "",
  companyName: "",
  location: "",
  employmentType: "Full Time",
  experience: "",
  salary: "",
  skills: "",
  description: "",
};

export default function PostJob() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const token = localStorage.getItem("smarthire_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    // Exact fields from RecruiterJobRequest.java
    const payload = {
      title: form.title.trim(),
      companyName: form.companyName.trim(),
      location: form.location.trim(),
      employmentType: form.employmentType,
      experience: form.experience.trim(),
      salary: form.salary.trim(),
      skills: form.skills.trim(),
      description: form.description.trim(),
    };

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/recruiter/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Authentication failed. Please log in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Access forbidden. Please log in with a recruiter account."
          );
        }

        throw new Error(
          responseText ||
            `Failed to create job. HTTP ${response.status}`
        );
      }

      // The backend returns RecruiterJobResponse.
      // Only navigate after successful creation.
      navigate("/recruiter/dashboard", {
        state: {
          message: "Job posted successfully!",
        },
      });
    } catch (err) {
      setError(err.message || "Unable to post the job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600 p-2 text-white">
              <BriefcaseBusiness size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                SmartHire
              </h1>

              <p className="text-sm text-slate-500">
                Create a job listing
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/recruiter/dashboard")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Post a New Job
          </h2>

          <p className="mb-6 mt-2 text-slate-500">
            Enter the details for your job opening.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Job title *
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Company name *
                </label>

                <input
                  id="companyName"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Company name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Location *
                </label>

                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Vijayawada / Remote"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="employmentType"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Employment type *
                </label>

                <select
                  id="employmentType"
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Experience *
                </label>

                <input
                  id="experience"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 0-2 years"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="salary"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Salary
              </label>

              <input
                id="salary"
                name="salary"
                type="text"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. 6-10 LPA"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="skills"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Required skills *
              </label>

              <input
                id="skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                required
                placeholder="e.g. React, JavaScript, CSS"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Job description *
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe the role, responsibilities, and requirements..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <LoaderCircle
                  size={18}
                  className="animate-spin"
                />
              )}

              {loading ? "Posting job..." : "Post Job"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
