import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "./Auth.css";

export function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      const data = response.data;

      login(data);

      const role = String(data.role ?? data.user?.role ?? "")
        .replace(/^ROLE_/, "")
        .toUpperCase();

      if      (role === "CANDIDATE") navigate("/candidate/dashboard", { replace: true });
      else if (role === "RECRUITER") navigate("/recruiter/dashboard", { replace: true });
      else if (role === "ADMIN")     navigate("/admin/dashboard",     { replace: true });
      else throw new Error("Unknown user role returned by backend.");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate-scale-in">
        {/* Logo Section */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Sign in to continue to SmartHire</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert auth-alert-error">
            <svg className="auth-alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-fields">
            {/* Email Field */}
            <div className="auth-form-group">
              <label htmlFor="login-email" className="auth-form-label">
                Email Address
              </label>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-form-input"
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-form-group">
              <label htmlFor="login-password" className="auth-form-label">
                Password
              </label>
              <div className="auth-input-wrapper">
                <svg className="auth-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-form-input"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="auth-submit-btn">
            <div className="auth-submit-btn-content">
              {loading ? (
                <>
                  <div className="auth-loading"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Sign In</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-footer-link">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
