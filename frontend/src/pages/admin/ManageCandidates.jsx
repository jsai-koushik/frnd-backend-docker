
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

export default function ManageCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.get("/candidates");
      setCandidates(response.data);
    } catch (err) {
      setError(getAdminError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  return (
    <section>
      <PageHeader
        title="Manage Candidates"
        description="Candidate accounts and profile information."
        onRefresh={loadCandidates}
        loading={loading}
      />

      <ErrorMessage message={error} />

      {loading && candidates.length === 0 ? (
        <LoadingMessage />
      ) : candidates.length === 0 ? (
        <EmptyMessage text="No candidates found." />
      ) : (
        <TableWrapper>
          <thead>
            <tr>
              {[
                "User ID",
                "Name",
                "Email",
                "Phone",
                "Location",
                "Education",
                "Experience",
                "About",
              ].map((heading) => (
                <th key={heading} className={thClass}>
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.userId}>
                {[
                  candidate.userId,
                  candidate.name,
                  candidate.email,
                  candidate.phone,
                  candidate.location,
                  candidate.education,
                  candidate.experience,
                  candidate.about,
                ].map((value, index) => (
                  <td
                    key={index}
                    className={`${tdClass} max-w-xs whitespace-normal break-words`}
                  >
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
