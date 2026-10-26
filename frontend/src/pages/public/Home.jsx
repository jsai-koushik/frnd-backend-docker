
import { Link } from "react-router-dom";
import { BriefcaseBusiness, Search, Users } from "lucide-react";

export default function Home() {
  return (
    <main>
      <header style={styles.header}>
        <Link to="/" style={styles.brand}>
          <BriefcaseBusiness size={25} />
          SmartHire
        </Link>

        <nav style={styles.nav}>
          <Link to="/login">Login</Link>
          <Link to="/register" className="primary-button">
            Get Started
          </Link>
        </nav>
      </header>

      <section style={styles.hero}>
        <p style={styles.eyebrow}>SMARTER RECRUITMENT STARTS HERE</p>
        <h1>
          Find opportunities.
          <br />
          <span style={{ color: "#3155d9" }}>Build your future.</span>
        </h1>

        <p style={styles.description}>
          Discover jobs, track applications, and manage recruitment
          activities with SmartHire.
        </p>

        <div style={styles.actions}>
          <Link to="/login" className="primary-button">
            <Search size={18} />
            Explore Jobs
          </Link>
          <Link to="/register" style={styles.secondary}>
            Create Account
          </Link>
        </div>
      </section>

      <section style={styles.features}>
        <article>
          <Search size={25} color="#3155d9" />
          <h3>For Candidates</h3>
          <p>Explore job opportunities and track your applications.</p>
        </article>

        <article>
          <BriefcaseBusiness size={25} color="#3155d9" />
          <h3>For Recruiters</h3>
          <p>Manage job postings, applicants, and interviews.</p>
        </article>

        <article>
          <Users size={25} color="#3155d9" />
          <h3>For Administrators</h3>
          <p>Manage platform information according to your role.</p>
        </article>
      </section>
    </main>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 6%",
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 24,
    color: "#3155d9",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 22,
  },
  hero: {
    padding: "90px 8%",
    background: "linear-gradient(120deg, #f8fafc, #eaf0ff)",
  },
  eyebrow: {
    color: "#3155d9",
    fontWeight: 700,
    letterSpacing: 1.5,
    fontSize: 12,
  },
  description: {
    maxWidth: 550,
    color: "#64748b",
    lineHeight: 1.8,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 26,
  },
  secondary: {
    padding: "12px 18px",
    border: "1px solid #cbd5e1",
    borderRadius: 8,
    background: "#fff",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 24,
    padding: "50px 8%",
  },
};