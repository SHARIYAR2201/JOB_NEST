import React, { useEffect, useState } from "react";
import { Link } from "react-router";

// 👇 point this to your Express server
const API_BASE = "http://localhost:3000";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const qs = q ? `?q=${encodeURIComponent(q)}` : "";
      const res = await fetch(`${API_BASE}/api/jobs${qs}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-200">Available Jobs</h1>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search title or company..."
            className="px-3 py-2 rounded bg-gray-800 text-black placeholder-gray-400 border border-gray-700"
          />
          <button
            onClick={load}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Search
          </button>
          <Link
            to="/jobs/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Post a Job
          </Link>
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {err && <p className="text-red-500">{err}</p>}
      {!loading && jobs.length === 0 && <p className="text-gray-400">No jobs found.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-blue-600">{job.company}</p>
            {job.location && <p className="text-gray-500 text-sm">{job.location}</p>}
            {job.salary && <p className="text-green-600 font-semibold mt-2">{job.salary}</p>}
            {job.description && (
              <p className="text-gray-600 text-sm mt-4 line-clamp-3">{job.description}</p>
            )}

            <div className="flex gap-3 mt-6">
              <Link
                to={`/jobs/${job._id}`}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
              >
                View Details
              </Link>
              <Link
                to={`/apply/${job._id}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                Apply Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
