import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import "./CandidateProfile.css";

import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  Pencil,
  Save,
  RefreshCw,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const EMPTY_FORM = {
  phone: "",
  location: "",
  education: "",
  experience: "",
  about: "",
};

function profileToForm(data) {
  return {
    phone: data?.phone ?? "",
    location: data?.location ?? "",
    education: data?.education ?? "",
    experience: data?.experience ?? "",
    about: data?.about ?? "",
  };
}

function getErrorMessage(error) {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return "You do not have permission to access this profile.";
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return (
    data?.message ||
    data?.detail ||
    data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="flex items-center gap-2 text-sm text-gray-500">
        <Icon size={17} className="text-indigo-600" />
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap break-words font-medium text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function CandidateProfile() {
  const { user, token } = useAuth();

  // This is the User entity ID returned by login.
  // It is NOT the CandidateProfile entity ID.
  const userId = user?.id ?? null;

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [mode, setMode] = useState("view");

  const profileUrl =
    userId !== null && userId !== undefined
      ? `/api/candidates/${encodeURIComponent(userId)}/profile`
      : null;

  // ==========================================
  // FETCH PROFILE
  // ==========================================

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!token || !profileUrl) {
      setProfile(null);
      setError(
        "Your login session is incomplete. Please log out and log in again."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(profileUrl);

      const data = response.data;

      setProfile(data);
      setForm(profileToForm(data));
      setMode("view");
    } catch (err) {
      if (err.response?.status === 404) {
        // A newly registered candidate has no profile yet.
        // Display the Create Profile form.
        setProfile(null);
        setForm({ ...EMPTY_FORM });
        setMode("create");
        setError("");
      } else {
        setProfile(null);
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }, [profileUrl, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  function handleCancel() {
    if (!profile) return;

    setForm(profileToForm(profile));
    setMode("view");
  }

  // ==========================================
  // CREATE / UPDATE PROFILE
  // ==========================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (!profileUrl || !token || saving) {
      return;
    }

    setSaving(true);

    const isCreating = mode === "create";

    const payload = {
      phone: form.phone.trim(),
      location: form.location.trim(),
      education: form.education.trim(),
      experience: form.experience.trim(),
      about: form.about.trim(),
    };

    const config = {}; // token added by axios interceptor

    try {
      const response = isCreating
        ? await api.post(profileUrl, payload)
        : await api.put(profileUrl, payload);

      const savedProfile = response.data;

      setProfile(savedProfile);
      setForm(profileToForm(savedProfile));
      setMode("view");
      setError("");

      toast.success(
        isCreating
          ? "Profile created successfully!"
          : "Profile updated successfully!"
      );
    } catch (err) {
      if (isCreating && err.response?.status === 409) {
        toast.error(
          "A profile already exists for this account. Refreshing..."
        );

        await fetchProfile();
      } else {
        toast.error(getErrorMessage(err));
      }
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="candidate-profile-page">
      <div className="candidate-profile-container">

        {/* BACK TO DASHBOARD */}

        <Link
          to="/candidate/dashboard"
          className="profile-back-link"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* PAGE HEADER */}

        <div className="profile-header">
          <div className="profile-header-content">
            <h1 className="profile-header-title">
              <UserRound className="profile-header-icon" size={32} />
              My Profile
            </h1>
            <p className="profile-header-subtitle">
              Manage your candidate information and showcase your skills
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            disabled={loading || saving}
            className="profile-refresh-btn"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="profile-loading">
            <div className="profile-loading-spinner" />
            <p className="profile-loading-text">
              Loading your amazing profile...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div role="alert" className="profile-error">
            <p className="profile-error-text">{error}</p>
            <button
              type="button"
              onClick={fetchProfile}
              disabled={!profileUrl || !token}
              className="profile-error-btn"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EXISTING PROFILE */}

        {!loading &&
          !error &&
          mode === "view" &&
          profile && (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-indigo-100 p-4 text-indigo-600">
                    <UserRound size={30} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {profile.name || user?.name || "Candidate"}
                    </h2>

                    <p className="mt-1 flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {profile.email ||
                        user?.email ||
                        "Email not provided"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white hover:bg-indigo-700"
                >
                  <Pencil size={17} />
                  Edit Profile
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ProfileField
                  icon={Phone}
                  label="Phone"
                  value={profile.phone}
                />

                <ProfileField
                  icon={MapPin}
                  label="Location"
                  value={profile.location}
                />

                <ProfileField
                  icon={GraduationCap}
                  label="Education"
                  value={profile.education}
                />

                <ProfileField
                  icon={BriefcaseBusiness}
                  label="Experience"
                  value={profile.experience}
                />
              </div>

              <div className="mt-4">
                <ProfileField
                  icon={FileText}
                  label="About Me"
                  value={profile.about}
                />
              </div>
            </section>
          )}

        {/* CREATE / EDIT FORM */}

        {!loading &&
          !error &&
          (mode === "create" || mode === "edit") && (
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === "create"
                    ? "Create Candidate Profile"
                    : "Edit Candidate Profile"}
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {mode === "create"
                    ? "Complete your candidate profile to get started."
                    : "Update your candidate information below."}
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="grid gap-5 sm:grid-cols-2">

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="9876543210"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* LOCATION */}

                  <div>
                    <label
                      htmlFor="location"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Location
                    </label>

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={form.location}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="Your city"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* EDUCATION */}

                  <div>
                    <label
                      htmlFor="education"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Education
                    </label>

                    <input
                      id="education"
                      name="education"
                      type="text"
                      value={form.education}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="B.Tech Computer Science"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* EXPERIENCE */}

                  <div>
                    <label
                      htmlFor="experience"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Experience
                    </label>

                    <input
                      id="experience"
                      name="experience"
                      type="text"
                      value={form.experience}
                      onChange={handleChange}
                      disabled={saving}
                      placeholder="Fresher"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* ABOUT */}

                <div>
                  <label
                    htmlFor="about"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    About Me
                  </label>

                  <textarea
                    id="about"
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    disabled={saving}
                    rows={5}
                    maxLength={2000}
                    placeholder="Tell recruiters about yourself..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />

                  <p className="mt-1 text-right text-xs text-gray-500">
                    {form.about.length}/2000
                  </p>
                </div>

                {/* ACTION BUTTONS */}

                <div className="flex flex-wrap gap-3 border-t pt-6">

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={18} />

                    {saving
                      ? "Saving..."
                      : mode === "create"
                        ? "Create Profile"
                        : "Save Changes"}
                  </button>

                  {mode === "edit" && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </section>
          )}
      </div>
    </main>
  );
}
