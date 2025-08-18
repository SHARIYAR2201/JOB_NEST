// src/pages/ResumeBuilder.jsx
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";

const BACKEND_URL = "http://localhost:3000";

const ResumeBuilder = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Minimal fields persisted to backend user profile (for convenience)
  const [headline, setHeadline] = useState("");
  const [skills, setSkills] = useState(""); // comma separated
  const [resumeUrl, setResumeUrl] = useState("");

  // Rich resume structure (stored as generatedResume on backend)
  const [summary, setSummary] = useState("");
  const [experience, setExperience] = useState([{ role: "", company: "", period: "", details: "" }]);
  const [education, setEducation] = useState([{ degree: "", school: "", year: "" }]);
  const [projects, setProjects] = useState([{ name: "", link: "", about: "" }]);
  const [links, setLinks] = useState([{ label: "Portfolio", url: "" }]);

  const printableRef = useRef(null);

  useEffect(() => {
    let ignore = false;

    const bootstrap = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/users/by-email?email=${encodeURIComponent(user.email)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (!ignore) {
            setUserId(data._id);
            setUserProfile(data);
            // prefill some fields
            setHeadline(data.headline || "");
            setSkills(Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills || ""));
            setResumeUrl(data.resumeUrl || "");
            // If they already have a generatedResume, you could prefill here too:
            if (data.generatedResume) {
              const g = data.generatedResume;
              setSummary(g.summary || "");
              setExperience(Array.isArray(g.experience) ? g.experience : [{ role: "", company: "", period: "", details: "" }]);
              setEducation(Array.isArray(g.education) ? g.education : [{ degree: "", school: "", year: "" }]);
              setProjects(Array.isArray(g.projects) ? g.projects : [{ name: "", link: "", about: "" }]);
              setLinks(Array.isArray(g.links) ? g.links : [{ label: "Portfolio", url: "" }]);
            }
          }
        }
      } catch (e) {
        // ignore
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    bootstrap();
    return () => { ignore = true; };
  }, [user?.email]);

  const parsedSkills = useMemo(
    () => (skills || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean),
    [skills]
  );

  const addExp = () => setExperience(prev => [...prev, { role: "", company: "", period: "", details: "" }]);
  const addEdu = () => setEducation(prev => [...prev, { degree: "", school: "", year: "" }]);
  const addProj = () => setProjects(prev => [...prev, { name: "", link: "", about: "" }]);
  const addLink = () => setLinks(prev => [...prev, { label: "", url: "" }]);

  const onSaveResume = async () => {
    if (!userId) {
      setNotice("Could not determine your user record. Make sure you are logged in.");
      return;
    }

    // Decide whether to replace an existing resume
    const hasExisting =
      Boolean(userProfile?.resumeFileUrl) || Boolean(userProfile?.generatedResume);

    let replaceExisting = false;
    if (hasExisting) {
      replaceExisting = window.confirm(
        "A resume already exists in your profile. Do you want to replace it with the new one? (The old one will be deleted)"
      );
      if (!replaceExisting) {
        setNotice("Kept existing resume. New resume was not saved.");
        setTimeout(() => setNotice(""), 3000);
        return;
      }
    }

    try {
      setSaving(true);
      setNotice("");

      // 1) Save generated resume object
      const payload = {
        generatedResume: {
          headline,
          skills: parsedSkills,
          summary,
          experience,
          education,
          projects,
          links,
        },
        replaceExisting,
      };

      const res = await fetch(`${BACKEND_URL}/api/users/${userId}/resume-generated`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save resume");
      const saved = await res.json();

      // 2) Also store convenience fields on profile (headline/skills/resumeUrl) if you want:
      const res2 = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, skills: parsedSkills, resumeUrl }),
      });
      // Don't show raw backend errors; only show success when ok
      if (!res2.ok) {
        console.warn("Profile convenience update failed");
      }

      setUserProfile(saved.user);
      setNotice("Resume saved to profile successfully");
    } catch (e) {
      setNotice(e.message || "Failed to save");
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(""), 3000);
    }
  };

  const printResume = () => {
    if (!printableRef.current) return;
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" type="button" onClick={printResume}>
            Print / Save as PDF
          </button>
          <button className={`btn btn-primary ${saving ? "btn-disabled" : ""}`} onClick={onSaveResume}>
            {saving ? "Saving..." : "Save Resume"}
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-4">
          <div className="alert alert-info">{notice}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder form */}
        <form className="space-y-6">
          {/* Basic */}
          <div className="card bg-base-100 shadow p-4">
            <h2 className="text-xl font-semibold mb-3">Basics</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="form-control">
                <label className="label">Headline</label>
                <input
                  className="input input-bordered"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Frontend Developer | React, TypeScript"
                />
              </div>
              <div className="form-control">
                <label className="label">Skills (comma separated)</label>
                <input
                  className="input input-bordered"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>
            <div className="form-control mt-3">
              <label className="label">Public Resume Link (optional)</label>
              <input
                className="input input-bordered"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://example.com/your-resume.pdf"
              />
            </div>
            <div className="form-control mt-3">
              <label className="label">Professional Summary</label>
              <textarea
                className="textarea textarea-bordered min-h-24"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A brief summary about you and your goals."
              />
            </div>
          </div>

          {/* Experience */}
          <div className="card bg-base-100 shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-3">Experience</h2>
              <button type="button" className="btn btn-sm" onClick={addExp}>+ Add</button>
            </div>
            <div className="space-y-4">
              {experience.map((exp, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-3">
                  <input
                    className="input input-bordered"
                    placeholder="Role (e.g., Frontend Developer)"
                    value={exp.role}
                    onChange={(e) =>
                      setExperience(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], role: e.target.value };
                        return next;
                      })
                    }
                  />
                  <input
                    className="input input-bordered"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) =>
                      setExperience(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], company: e.target.value };
                        return next;
                      })
                    }
                  />
                  <input
                    className="input input-bordered"
                    placeholder="Period (e.g., 2023–Present)"
                    value={exp.period}
                    onChange={(e) =>
                      setExperience(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], period: e.target.value };
                        return next;
                      })
                    }
                  />
                  <textarea
                    className="textarea textarea-bordered"
                    placeholder="Key accomplishments, responsibilities…"
                    value={exp.details}
                    onChange={(e) =>
                      setExperience(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], details: e.target.value };
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="card bg-base-100 shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-3">Education</h2>
              <button type="button" className="btn btn-sm" onClick={addEdu}>+ Add</button>
            </div>
            <div className="space-y-4">
              {education.map((ed, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-3">
                  <input
                    className="input input-bordered"
                    placeholder="Degree"
                    value={ed.degree}
                    onChange={(e) =>
                      setEducation(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], degree: e.target.value };
                        return next;
                      })
                    }
                  />
                  <input
                    className="input input-bordered"
                    placeholder="School"
                    value={ed.school}
                    onChange={(e) =>
                      setEducation(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], school: e.target.value };
                        return next;
                      })
                    }
                  />
                  <input
                    className="input input-bordered"
                    placeholder="Year"
                    value={ed.year}
                    onChange={(e) =>
                      setEducation(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], year: e.target.value };
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="card bg-base-100 shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-3">Projects</h2>
              <button type="button" className="btn btn-sm" onClick={addProj}>+ Add</button>
            </div>
            <div className="space-y-4">
              {projects.map((p, i) => (
                <div key={i} className="grid md:grid-cols-3 gap-3">
                  <input
                    className="input input-bordered"
                    placeholder="Project Name"
                    value={p.name}
                    onChange={(e) =>
                      setProjects(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], name: e.target.value };
                        return next;
                      })
                    }
                  />
                  <input
                    className="input input-bordered"
                    placeholder="Link (optional)"
                    value={p.link}
                    onChange={(e) =>
                      setProjects(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], link: e.target.value };
                        return next;
                      })
                    }
                  />
                  <textarea
                    className="textarea textarea-bordered md:col-span-3"
                    placeholder="What is this project about?"
                    value={p.about}
                    onChange={(e) =>
                      setProjects(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], about: e.target.value };
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="card bg-base-100 shadow p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold mb-3">Links</h2>
              <button type="button" className="btn btn-sm" onClick={addLink}>+ Add</button>
            </div>
            <div className="space-y-4">
              {links.map((l, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-3">
                  <input
                    className="input input-bordered"
                    placeholder="Label (e.g., GitHub, LinkedIn)"
                    value={l.label}
                    onChange={(e) =>
                      setLinks(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], label: e.target.value };
                        return next;
                      })
                    }
                  />
                  <input
                    className="input input-bordered"
                    placeholder="URL"
                    value={l.url}
                    onChange={(e) =>
                      setLinks(prev => {
                        const next = [...prev];
                        next[i] = { ...next[i], url: e.target.value };
                        return next;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Preview (printable) */}
        <div className="card bg-base-100 shadow p-6" ref={printableRef}>
          <div className="border-b pb-4 mb-4">
            <h2 className="text-2xl font-bold">
              {user?.displayName || user?.email?.split("@")[0] || "Your Name"}
            </h2>
            <p className="text-sm text-gray-600">{headline}</p>
            {parsedSkills.length > 0 && (
              <div className="mt-2 text-sm text-gray-700">
                <span className="font-semibold">Skills:</span>{" "}
                {parsedSkills.join(" • ")}
              </div>
            )}
          </div>

          {summary && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Summary</h3>
              <p className="text-sm">{summary}</p>
            </div>
          )}

          {experience.some(e => e.role || e.company || e.details) && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Experience</h3>
              <div className="space-y-3">
                {experience.map((e, i) => (
                  <div key={i}>
                    <p className="font-medium">{e.role} {e.company && `• ${e.company}`}</p>
                    {e.period && <p className="text-xs text-gray-500">{e.period}</p>}
                    {e.details && <p className="text-sm mt-1">{e.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.some(ed => ed.degree || ed.school || ed.year) && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Education</h3>
              <div className="space-y-2">
                {education.map((ed, i) => (
                  <p key={i} className="text-sm">
                    <span className="font-medium">{ed.degree}</span>
                    {ed.school && ` — ${ed.school}`}
                    {ed.year && ` (${ed.year})`}
                  </p>
                ))}
              </div>
            </div>
          )}

          {projects.some(p => p.name || p.about) && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Projects</h3>
              <div className="space-y-3">
                {projects.map((p, i) => (
                  <div key={i}>
                    <p className="font-medium">
                      {p.name}{" "}
                      {p.link && (
                        <a className="link link-primary text-sm ml-2" href={p.link} target="_blank" rel="noreferrer">
                          {p.link}
                        </a>
                      )}
                    </p>
                    {p.about && <p className="text-sm">{p.about}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {links.some(l => l.url) && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Links</h3>
              <ul className="text-sm list-disc ml-5">
                {links.map((l, i) => l.url ? (
                  <li key={i}>
                    <a className="link link-primary" href={l.url} target="_blank" rel="noreferrer">
                      {l.label || l.url}
                    </a>
                  </li>
                ) : null)}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Print CSS */}
      <style>
        {`@media print {
          body * { visibility: hidden; }
          .card, .card * { visibility: visible; }
          .card { position: absolute; left: 0; top: 0; width: 100%; }
          .btn, .navbar, .menu, form { display: none !important; }
        }`}
      </style>
    </div>
  );
};

export default ResumeBuilder;
