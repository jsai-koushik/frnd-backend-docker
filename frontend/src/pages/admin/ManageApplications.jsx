
import { useCallback, useEffect, useState } from "react";

import adminApi, { getAdminError } from "./adminApi";

import {
  PageHeader,
  ErrorMessage,
  LoadingMessage,
  EmptyMessage,
  TableWrapper,
  DisplayValue,
  thClass,
  tdClass,
} from "./AdminUI";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.get("/applications");
      setApplications(response.data);
    } catch (err) {
      setError(getAdminError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  return (
    <section>
      <PageHeader
        title="Manage Applications"
        description="Monitor all job applications and their statuses."
        onRefresh={loadApplications}
        loading={loading}
      />

      <ErrorMessage message={error} />

      {loading && applications.length === 0 ? (
        <LoadingMessage />
      ) : applications.length === 0 ? (
        <EmptyMessage text="No applications found." />
      ) : (
        <TableWrapper>
          <thead>
            <tr>
              {[
                "Application ID",
                "Candidate ID",
                "Candidate Name",
                "Candidate Email",
                "Job ID",
                "Job Title",
                "Company",
                "Recruiter ID",
                "Recruiter Name",
                "Recruiter Email",
                "Status",
              ].map((heading) => (
                <th key={heading} className={thClass}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {applications.map((application) => (
              <tr key={application.applicationId}>
                {[
                  application.applicationId,
                  application.candidateId,
                  application.candidateName,
                  application.candidateEmail,
                  application.jobId,
                  application.jobTitle,
                  application.companyName,
                  application.recruiterId,
                  application.recruiterName,
                  application.recruiterEmail,
                ].map((value, index) => (
                  <td key={index} className={tdClass}>
                    <DisplayValue value={value} />
                  </td>
                ))}

                <td className={tdClass}>
                  <span className="inline-block whitespace-nowrap rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    <DisplayValue value={application.status} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      )}
    </section>
  );
}
