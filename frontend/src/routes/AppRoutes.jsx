
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "../pages/public/Home.jsx";
import { Login } from "../pages/auth/Login.jsx";
import { Register } from "../pages/auth/Register.jsx";
import Unauthorized from "../pages/public/Unauthorized.jsx";
import NotFound from "../pages/public/NotFound.jsx";

// ==========================================
// CANDIDATE LAYOUT
// ==========================================

import CandidateLayout from "../pages/candidate/CandidateLayout.jsx";

// ==========================================
// CANDIDATE PAGES
// ==========================================

import CandidateDashboard from "../pages/candidate/CandidateDashboard.jsx";
import CandidateJobs from "../pages/candidate/CandidateJobs.jsx";
import CandidateApplications from "../pages/candidate/CandidateApplications.jsx";
import CandidateApplicationDetails from "../pages/candidate/CandidateApplicationDetails.jsx";
import CandidateProfile from "../pages/candidate/CandidateProfile.jsx";
import CandidateInterviews from "../pages/candidate/CandidateInterviews.jsx";
import CandidateResumeAnalysis from "../pages/candidate/CandidateResumeAnalysis.jsx";
import CandidateJobMatch from "../pages/candidate/CandidateJobMatch.jsx";
import CandidateInterviewPrep from "../pages/candidate/CandidateInterviewPrep.jsx";

// ==========================================
// RECRUITER PAGES
// ==========================================

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard.jsx";
import PostJob from "../pages/recruiter/PostJob.jsx";
import RecruiterApplicants from "../pages/recruiter/RecruiterApplicants.jsx";
import ScheduleInterview from "../pages/recruiter/ScheduleInterview.jsx";
import RecruiterInterviews from "../pages/recruiter/RecruiterInterviews.jsx";

// ==========================================
// RECRUITER AI PAGES
// ==========================================

import RecruiterAI from "../pages/recruiter/RecruiterAI.jsx";
import AIResumeScreening from "../pages/recruiter/AIResumeScreening.jsx";
import AIInterviewQuestions from "../pages/recruiter/AIInterviewQuestions.jsx";

// ==========================================
// ADMIN PAGES
// ==========================================

import AdminLayout from "../pages/admin/AdminLayout.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import ManageUsers from "../pages/admin/ManageUsers.jsx";
import ManageCandidates from "../pages/admin/ManageCandidates.jsx";
import ManageRecruiters from "../pages/admin/ManageRecruiters.jsx";
import ManageJobs from "../pages/admin/ManageJobs.jsx";
import ManageApplications from "../pages/admin/ManageApplications.jsx";

// ==========================================
// DASHBOARD REDIRECT BASED ON USER ROLE
// ==========================================

function getDashboardPath(user) {
  const role = String(user?.role || "")
    .replace(/^ROLE_/i, "")
    .toUpperCase();

  switch (role) {
    case "CANDIDATE":
      return "/candidate/dashboard";

    case "RECRUITER":
      return "/recruiter/dashboard";

    case "ADMIN":
      return "/admin/dashboard";

    default:
      return "/unauthorized";
  }
}

// ==========================================
// MAIN APPLICATION ROUTES
// ==========================================

export default function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>

      {/* =====================================
          PUBLIC ROUTES
      ===================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={getDashboardPath(user)}
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate
              to={getDashboardPath(user)}
              replace
            />
          ) : (
            <Register />
          )
        }
      />

      <Route
        path="/unauthorized"
        element={<Unauthorized />}
      />

      {/* =====================================
          CANDIDATE PROTECTED ROUTES
      ===================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["CANDIDATE"]}
          />
        }
      >

        <Route element={<CandidateLayout />}>

          <Route
            path="/candidate"
            element={
              <Navigate
                to="/candidate/dashboard"
                replace
              />
            }
          />

          <Route
            path="/candidate/dashboard"
            element={<CandidateDashboard />}
          />

          <Route
            path="/candidate/jobs"
            element={<CandidateJobs />}
          />

          <Route
            path="/candidate/applications"
            element={<CandidateApplications />}
          />

          <Route
            path="/candidate/applications/:applicationId"
            element={<CandidateApplicationDetails />}
          />

          <Route
            path="/candidate/profile"
            element={<CandidateProfile />}
          />

          <Route
            path="/candidate/interviews"
            element={<CandidateInterviews />}
          />

          <Route
            path="/candidate/resume-analysis"
            element={<CandidateResumeAnalysis />}
          />

          <Route
            path="/candidate/job-match"
            element={<CandidateJobMatch />}
          />

          <Route
            path="/candidate/interview-prep"
            element={<CandidateInterviewPrep />}
          />

        </Route>

      </Route>

      {/* =====================================
          RECRUITER PROTECTED ROUTES
      ===================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["RECRUITER"]}
          />
        }
      >

        {/* Recruiter default redirect */}

        <Route
          path="/recruiter"
          element={
            <Navigate
              to="/recruiter/dashboard"
              replace
            />
          }
        />

        {/* Recruiter dashboard */}

        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        {/* Post new job */}

        <Route
          path="/recruiter/jobs/new"
          element={<PostJob />}
        />

        {/* View applicants for a specific job */}

        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={<RecruiterApplicants />}
        />

        {/* Schedule an interview */}

        <Route
          path="/recruiter/interviews/schedule/:applicationId"
          element={<ScheduleInterview />}
        />

        {/* Recruiter interviews */}

        <Route
          path="/recruiter/interviews"
          element={<RecruiterInterviews />}
        />

        {/* Recruiter AI dashboard */}

        <Route
          path="/recruiter/ai"
          element={<RecruiterAI />}
        />

        {/* AI resume screening */}

        <Route
          path="/recruiter/ai/resume-screening"
          element={<AIResumeScreening />}
        />

        {/* AI interview question generator */}

        <Route
          path="/recruiter/ai/interview-questions"
          element={<AIInterviewQuestions />}
        />

      </Route>

      {/* =====================================
          ADMIN PROTECTED ROUTES
      ===================================== */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["ADMIN"]}
          />
        }
      >

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<ManageUsers />}
          />

          <Route
            path="candidates"
            element={<ManageCandidates />}
          />

          <Route
            path="recruiters"
            element={<ManageRecruiters />}
          />

          <Route
            path="jobs"
            element={<ManageJobs />}
          />

          <Route
            path="applications"
            element={<ManageApplications />}
          />

        </Route>

      </Route>

      {/* =====================================
          PAGE NOT FOUND
      ===================================== */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}
