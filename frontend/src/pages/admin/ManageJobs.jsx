
import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import adminApi, { getAdminError } from "./adminApi";

import {
  PageHeader,
  ErrorMessage,
  SuccessMessage,
  LoadingMessage,
  EmptyMessage,
  TableWrapper,
  DisplayValue,
  thClass,
  tdClass,
} from "./AdminUI";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      setError(getAdminError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  async function handleDelete(job) {
    const confirmed = window.confirm(
      `Delete "${job.title}" from ${job.companyName}? This action may be permanent.`
    );

    if (!confirmed) return;

    setDeletingId(job.jobId);
    setError("");
    setSuccess("");

    try {
      await adminApi.delete(`/jobs/${job.jobId}`);

      setSuccess("Job deleted successfully.");
      await loadJobs();
    } catch (err) {
      setError(getAdminError(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <PageHeader
        title="Manage Jobs"
        description="View all jobs posted on SmartHire."
        onRefresh={loadJobs}
        loading={loading}
      />

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      {loading && jobs.length === 0 ? (
        <LoadingMessage />
      ) : jobs.length === 0 ? (
        <EmptyMessage text="No jobs found." />
      ) : (
        <TableWrapper>
          <thead>
            <tr>
              {[
                "Job ID",
                "Title",
                "Company",
                "Location",
                "Employment Type",
                "Experience",
                "Salary",
                "Skills",
                "Description",
                "Recruiter ID",
                "Recruiter Name",
                "Recruiter Email",
                "Action",
              ].map((heading) => (
                <th key={heading} className={thClass}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {jobs.map((job) => (
              <tr key={job.jobId}>
                {[
                  job.jobId,
                  job.title,
                  job.companyName,
                  job.location,
                  job.employmentType,
                  job.experience,
                  job.salary,
                  job.skills,
                  job.description,
                  job.recruiterId,
                  job.recruiterName,
                  job.recruiterEmail,
                ].map((value, index) => (
                  <td
                    key={index}
                    className={`${tdClass} max-w-xs whitespace-normal break-words`}
                  >
                    <DisplayValue value={value} />
                  </td>
                ))}

                <td className={tdClass}>
                  <button
                    type="button"
                    disabled={deletingId !== null}
                    onClick={() => handleDelete(job)}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    {deletingId === job.jobId
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      )}
    </section>
  );
}
