
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <main className="form-container">
      <h1>Access denied</h1>
      <p className="muted-text">
        Your account does not have permission to view this page.
      </p>
      <Link to="/" className="primary-button">Return home</Link>
    </main>
  );
}