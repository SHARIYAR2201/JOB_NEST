import React, { useState } from "react";
import { useNavigate } from "react-router";

// 👇 point this to your Express server
const API_BASE = "http://localhost:3000";

const initial = {
  title: "",
  company: "",
  location: "",
  salary: "",
  status: "Active",
  description: "",
  requirementsText: "",
  benefitsText: "",
};

const JobDetailsForm = () => {
  const [form, setForm] = useState(initial);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.company.trim()) return "Company is required";
    if (!form.description.trim()) return "Description is required";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);
    setErr("");
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim() || undefined,
        salary: form.salary.trim() || undefined,
        status: form.status || "Active",
        description: form.description.trim(),
        requirements: form.requirementsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        benefits: form.benefitsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch(`${API_BASE}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = "Failed to create job";
        try {
          msg = (await res.json()).error || msg;
        } catch {}
        throw new Error(msg);
      }
      await res.json();
      navigate("/jobs");
    } catch (e) {
      console.error(e);
      setErr(e.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Create a Job</h1>

      {err && (
        <div className="mb-4 text-sm text-red-400 bg-red-900/20 border border-red-700 rounded p-3">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-black"
            placeholder="e.g., Frontend Developer"
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company *</label>
            <input
              name="company"
              value={form.company}
              onChange={onChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-black"
              placeholder="Company name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              name="location"
              value={form.location}
              onChange={onChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-black"
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              name="salary"
              value={form.salary}
              onChange={onChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-black"
              placeholder="$100k - $120k"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-white text-black"
            >
              <option value="Active">Active</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={5}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-black"
            placeholder="Describe the role and responsibilities..."
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Requirements (one per line)</label>
            <textarea
              name="requirementsText"
              value={form.requirementsText}
              onChange={onChange}
              rows={4}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-black"
              placeholder={"React\nTailwind\nGit"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Benefits (one per line)</label>
            <textarea
              name="benefitsText"
              value={form.benefitsText}
              onChange={onChange}
              rows={4}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-black"
              placeholder={"Health insurance\nPension\nRemote friendly"}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Create Job"}
          </button>
          <button
            type="button"
            onClick={() => setForm(initial)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobDetailsForm;
