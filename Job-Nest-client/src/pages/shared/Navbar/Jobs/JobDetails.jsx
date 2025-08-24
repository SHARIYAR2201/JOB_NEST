import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

// 👇 point this to your Express server
const API_BASE = "http://localhost:3000";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${id}`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        if (mounted) setJob(data);
      } catch (e) {
        console.error(e);
        if (mounted) setErr("Job not found.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-gray-400">Loading...</div>
    );
  }

  if (err || !job) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-red-500">
        {err || "Job not found."}
        <div className="mt-4">
          <Link to="/jobs" className="text-blue-500 hover:underline">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans">
      <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Jobs
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-gray-100">{job.title}</h1>
      <p className="text-blue-600">{job.company}</p>
      {job.location && <p className="text-gray-500">{job.location}</p>}
      {job.salary && <p className="text-green-600 font-semibold mt-2">{job.salary}</p>}

      {job.description && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-100">Job Description</h2>
          <p className="text-gray-400 whitespace-pre-line">{job.description}</p>
        </div>
      )}

      {Array.isArray(job.requirements) && job.requirements.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-100">Requirements</h2>
          <ul className="list-disc pl-5 text-gray-400">
            {job.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(job.benefits) && job.benefits.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-100">Benefits</h2>
          <ul className="list-disc pl-5 text-gray-400">
            {job.benefits.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to={`/apply/${job._id}`}
        className="mt-8 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Apply Now
      </Link>
    </div>
  );
};

export default JobDetails;
