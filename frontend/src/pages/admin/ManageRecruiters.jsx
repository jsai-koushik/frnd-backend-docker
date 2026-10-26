
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

export default function ManageRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRecruiters = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.get("/recruiters");
      setRecruiters(response.data);
    } catch (err) {
      setError(getAdminError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecruiters();
  }, [loadRecruiters]);

  return (
    <section>
      <PageHeader
        title="Manage Recruiters"
        description="Recruiter accounts and their job posting totals."
        onRefresh={loadRecruiters}
        loading={loading}
      />

      <ErrorMessage message={error} />

      {loading && recruiters.length === 0 ? (
        <LoadingMessage />
      ) : recruiters.length === 0 ? (
        <EmptyMessage text="No recruiters found." />
      ) : (
        <TableWrapper>
          <thead>
            <tr>
              {[
                "User ID",
                "Name",
                "Email",
                "Role",
                "Total Jobs",
              ].map((heading) => (
                <th key={heading} className={thClass}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {recruiters.map((recruiter) => (
              <tr key={recruiter.userId}>
                {[
                  recruiter.userId,
                  recruiter.name,
                  recruiter.email,
                  recruiter.role,
                  recruiter.totalJobs,
                ].map((value, index) => (
                  <td key={index} className={tdClass}>
                    <DisplayValue value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </TableWrapper>
      )}
    </section>
  );
}
