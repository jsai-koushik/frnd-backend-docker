import { useCallback, useEffect, useState } from "react";
import api from "../../api/axios";
import { RefreshCw, Trash2, Users } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/admin/users");
      setUsers(response.data);
    } catch (err) {
      if (err.response?.status === 401) setError("Session expired. Please log in again.");
      else if (err.response?.status === 403) setError("Access denied. Admin role is required.");
      else setError("Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleDelete(user) {
    const role = String(user.role || "").replace(/^ROLE_/, "").toUpperCase();
    if (role === "ADMIN") { setError("Admin accounts cannot be deleted."); return; }

    if (!window.confirm(`Delete ${user.name || user.email}?`)) return;

    setDeletingId(user.id);
    setError("");
    setSuccess("");
    try {
      await api.delete(`/api/admin/users/${user.id}`);
      setSuccess("User deleted successfully.");
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete user.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900">
            <Users className="text-indigo-600" /> Manage Users
          </h1>
          <p className="mt-2 text-gray-500">View and manage SmartHire registered users.</p>
        </div>
        <button type="button" onClick={fetchUsers} disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50">
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {error   && <div role="alert"  className="mb-4 rounded-lg bg-red-50   p-4 text-red-700"  >{error}</div>}
      {success && <div role="status" className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">{success}</div>}

      {loading ? (
        <p className="rounded-xl bg-white p-6 shadow-sm">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="rounded-xl bg-white p-6 shadow-sm">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>{["ID","Name","Email","Role","Action"].map(h => <th key={h} className="px-5 py-4">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => {
                const isAdmin = String(user.role||"").replace(/^ROLE_/,"").toUpperCase() === "ADMIN";
                return (
                  <tr key={user.id}>
                    <td className="px-5 py-4">{user.id}</td>
                    <td className="px-5 py-4">{user.name  || "—"}</td>
                    <td className="px-5 py-4">{user.email || "—"}</td>
                    <td className="px-5 py-4">{user.role  || "—"}</td>
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => handleDelete(user)}
                        disabled={isAdmin || deletingId === user.id}
                        className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40">
                        <Trash2 size={16} />
                        {deletingId === user.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
