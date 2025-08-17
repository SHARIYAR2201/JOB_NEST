import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext"; // adjust path

const BACKEND_URL = "http://localhost:3000";

const EMPTY = {
  _id: "",
  // common
  fullName: "",
  mobileNumber: "",
  email: "",
  address: "",
  role: "",
  avatarUrl: "",
  // jobseeker-only
  headline: "",
  skills: "",
  resumeUrl: "",
  resumeFileUrl: "",
  // company-only
  companyName: "",
  website: "",
  foundedYear: "",
  companySize: "",
  description: "",
};

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const email = useMemo(() => user?.email || "", [user?.email]);

  const [profile, setProfile] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ---------- helpers ----------
  const safeJson = async (res) => {
    // do not throw on invalid json
    try {
      const text = await res.text();
      return text ? JSON.parse(text) : null;
    } catch {
      return null;
    }
  };

  const validateUrls = () => {
    if (profile.avatarUrl && !/^https?:\/\/.+/i.test(profile.avatarUrl)) {
      return "Please provide a valid image URL (http/https).";
    }
    if (profile.resumeUrl && !/^https?:\/\/.+/i.test(profile.resumeUrl)) {
      return "Please provide a valid resume URL (http/https).";
    }
    if (profile.role === "company" && profile.website) {
      if (!/^https?:\/\/.+/i.test(profile.website)) {
        return "Please provide a valid website URL (http/https).";
      }
    }
    return "";
  };

  const buildPayload = () => {
    const payload = {
      fullName: profile.fullName,
      mobileNumber: profile.mobileNumber,
      address: profile.address,
      avatarUrl: profile.avatarUrl,
      resumeUrl: profile.resumeUrl,
      resumeFileUrl: profile.resumeFileUrl,
    };
    if (profile.role === "jobseeker") {
      payload.headline = profile.headline;
      payload.skills = profile.skills;
    }
    if (profile.role === "company") {
      payload.companyName = profile.companyName;
      payload.website = profile.website;
      payload.foundedYear = profile.foundedYear;
      payload.companySize = profile.companySize;
      payload.description = profile.description;
    }
    return payload;
  };

  // ---------- load profile ----------
  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      if (!email) {
        setLoading(false);
        setError("You must be logged in to view your profile.");
        return;
      }
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const r = await fetch(
          `${BACKEND_URL}/api/users/by-email?email=${encodeURIComponent(email)}`
        );
        if (r.ok) {
          const doc = await r.json();
          if (!ignore) setProfile({ ...EMPTY, ...doc });
        } else {
          // fallback: list and find
          const rf = await fetch(`${BACKEND_URL}/api/users?limit=200`);
          const data = await rf.json();
          if (rf.ok && Array.isArray(data.items)) {
            const found = data.items.find(
              (u) => String(u.email).toLowerCase() === email.toLowerCase()
            );
            if (!ignore) setProfile({ ...EMPTY, ...found });
          } else if (!ignore) {
            setError("Could not load profile.");
          }
        }
      } catch {
        if (!ignore) setError("Failed to load profile.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      ignore = true;
    };
  }, [email]);

  // ---------- form handlers ----------
  const onChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!profile?._id && !profile?.email) {
      setError("Update failed. Please reload and try again.");
      return;
    }

    const urlError = validateUrls();
    if (urlError) {
      setError(urlError);
      return;
    }

    const payload = buildPayload();

    const updateById = async () => {
      const res = await fetch(`${BACKEND_URL}/api/users/${profile._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);
      return { ok: res.ok, status: res.status, data };
    };

    const updateByEmail = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/users/by-email?email=${encodeURIComponent(
          profile.email
        )}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await safeJson(res);
      return { ok: res.ok, status: res.status, data };
    };

    try {
      setSaving(true);

      let result = null;

      // Try by id first if available; if ANY non-2xx, fall back to by-email
      if (profile._id) {
        result = await updateById();
        if (!result.ok) {
          // fall back silently
          result = await updateByEmail();
        }
      } else {
        result = await updateByEmail();
      }

      if (!result.ok) {
        console.error("Update failed:", result.status, result.data);
        // setError("Update failed. Please try again.");
        return;
      }

      // success path
      const updated = result.data && typeof result.data === "object" ? result.data : {};
      setProfile((p) => ({ ...p, ...updated }));
      setSuccess("Updated Successfully");
      setError("");
    } catch (err) {
      console.error("Update error:", err);
    //   setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const uploadResume = async () => {
    setError("");
    setSuccess("");

    if (!profile?._id) {
      setError("Please reload your profile before uploading.");
      return;
    }
    if (!resumeFile) {
      setError("Please choose a PDF file first.");
      return;
    }
    if (resumeFile.type !== "application/pdf") {
      setError("Resume must be a PDF file.");
      return;
    }

    try {
      setUploadingResume(true);
      const form = new FormData();
      form.append("resume", resumeFile);

      const res = await fetch(
        `${BACKEND_URL}/api/users/${profile._id}/resume`,
        { method: "POST", body: form }
      );
      const data = await safeJson(res);

      if (!res.ok) {
        console.error("Resume upload failed:", res.status, data);
        setError("Resume upload failed. Please try again.");
        return;
      }

      setProfile((p) => ({ ...p, resumeFileUrl: data?.resumeFileUrl || p.resumeFileUrl }));
      setSuccess("Updated Successfully");
      setResumeFile(null);
      setError("");
    } catch (err) {
      console.error("Resume upload error:", err);
      setError("Resume upload failed. Please try again.");
    } finally {
      setUploadingResume(false);
    }
  };

  // ---------- render ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info form */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Your Profile</h2>

              <form className="space-y-4" onSubmit={saveProfile} noValidate>
                {/* Common fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Name</label>
                    <input
                      name="fullName"
                      type="text"
                      value={profile.fullName || ""}
                      onChange={onChange}
                      className="input input-bordered w-full"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Number</label>
                    <input
                      name="mobileNumber"
                      type="tel"
                      value={profile.mobileNumber || ""}
                      onChange={onChange}
                      className="input input-bordered w-full"
                      placeholder="+8801XXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="label">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={profile.email || ""}
                      readOnly
                      className="input input-bordered w-full bg-base-200"
                    />
                  </div>

                  <div>
                    <label className="label">Address</label>
                    <input
                      name="address"
                      type="text"
                      value={profile.address || ""}
                      onChange={onChange}
                      className="input input-bordered w-full"
                      placeholder="House, Road, City, Country"
                    />
                  </div>

                  <div>
                    <label className="label">Role</label>
                    <input
                      name="role"
                      type="text"
                      value={profile.role || ""}
                      readOnly
                      className="input input-bordered w-full bg-base-200 capitalize"
                    />
                  </div>
                </div>

                {/* Jobseeker fields */}
                {profile.role === "jobseeker" && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Jobseeker Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Headline</label>
                        <input
                          name="headline"
                          type="text"
                          value={profile.headline || ""}
                          onChange={onChange}
                          className="input input-bordered w-full"
                          placeholder="e.g., Frontend Developer | React"
                        />
                      </div>
                      <div>
                        <label className="label">Skills (comma separated)</label>
                        <input
                          name="skills"
                          type="text"
                          value={profile.skills || ""}
                          onChange={onChange}
                          className="input input-bordered w-full"
                          placeholder="React, Node, MongoDB"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="label">Resume URL (optional)</label>
                        <input
                          name="resumeUrl"
                          type="url"
                          value={profile.resumeUrl || ""}
                          onChange={onChange}
                          className="input input-bordered w-full"
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Company fields */}
                {profile.role === "company" && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Company Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Company Name</label>
                        <input
                          name="companyName"
                          type="text"
                          value={profile.companyName || ""}
                          onChange={onChange}
                          className="input input-bordered w-full"
                          placeholder="Acme Ltd."
                        />
                      </div>
                      <div>
                        <label className="label">Website</label>
                        <input
                          name="website"
                          type="url"
                          value={profile.website || ""}
                          onChange={onChange}
                          className="input input-bordered w-full"
                          placeholder="https://acme.com"
                        />
                      </div>
                      <div>
                        <label className="label">Founded Year</label>
                        <input
                          name="foundedYear"
                          type="number"
                          value={profile.foundedYear || ""}
                          onChange={onChange}
                          className="input input-bordered w-full"
                          placeholder="2012"
                        />
                      </div>
                      <div>
                        <label className="label">Company Size</label>
                        <input
                          name="companySize"
                          type="text"
                          value={profile.companySize || ""}
                          onChange={onChange}
                          className="input input-bordered w-full"
                          placeholder="1-10, 11-50, 51-200, ..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="label">Description</label>
                        <textarea
                          name="description"
                          value={profile.description || ""}
                          onChange={onChange}
                          className="textarea textarea-bordered w-full"
                          rows={4}
                          placeholder="Short company description"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* messages */}
                {error && !success && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-600">{success}</div>}

                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>

              {/* Resume upload */}
              <div className="mt-8 border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Resume (PDF)</h3>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    className="file-input file-input-bordered"
                  />
                  <button
                    onClick={uploadResume}
                    className="btn btn-outline"
                    disabled={uploadingResume || !resumeFile}
                  >
                    {uploadingResume ? "Uploading..." : "Upload PDF"}
                  </button>
                  {(profile.resumeFileUrl || profile.resumeUrl) && (
                    <a
                      className="btn btn-success"
                      href={profile.resumeFileUrl || profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Download Resume
                    </a>
                  )}
                </div>
                <p className="text-xs text-base-content/60 mt-2">
                  You can paste a public link (Resume URL) or upload a PDF here.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Image panel */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h3 className="text-xl font-semibold mb-2">Profile Image</h3>

              <div className="avatar mb-4">
                <div className="w-40 h-40 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2 overflow-hidden">
                  <img
                    src={
                      profile.avatarUrl?.trim()
                        ? profile.avatarUrl
                        : "https://i.ibb.co/Kb0Zf1w/avatar-placeholder.png"
                    }
                    alt="avatar"
                    className="object-cover w-40 h-40"
                    onError={(e) => {
                      e.currentTarget.src = "https://i.ibb.co/Kb0Zf1w/avatar-placeholder.png";
                    }}
                  />
                </div>
              </div>

              <label className="label">Image URL</label>
              <input
                name="avatarUrl"
                type="url"
                placeholder="https://example.com/your-image.jpg"
                value={profile.avatarUrl || ""}
                onChange={onChange}
                className="input input-bordered w-full"
              />
              <p className="text-xs text-base-content/60 mt-2">
                Paste a direct image link (JPG/PNG/WebP).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
