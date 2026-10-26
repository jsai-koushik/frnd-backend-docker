import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./Auth.css";

export function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("CANDIDATE");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      navigate("/login", {
        replace: true,
        state: { message: "Registration successful! Please sign in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "An error occurred during registration. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="register-name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input id="register-name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Enter your name" />
            </div>
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input id="register-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Enter your email" />
            </div>
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Password</label>
              <input id="register-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Create a password" />
            </div>
            <div>
              <label htmlFor="register-role" className="block text-sm font-medium text-gray-700">I want to register as</label>
              <select id="register-role" value={role} onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none sm:text-sm">
                <option value="CANDIDATE">Candidate</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
