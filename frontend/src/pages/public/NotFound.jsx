
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="form-container">
      <h1>404 — Page not found</h1>
      <p className="muted-text">
        The page you requested does not exist.
      </p>
      <Link to="/" className="primary-button">Return home</Link>
    </main>
  );
}