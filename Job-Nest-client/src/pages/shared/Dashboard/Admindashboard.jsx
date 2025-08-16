import React, { useEffect, useMemo, useState } from "react";

// Use Vite env or fallback
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", company: "", status: "Active" });

  // Derived stats (you can replace with real counts from API later)
  const stats = useMemo(() => ([
    { title: "Total Jobs", value: jobs.length },
    { title: "Applications", value: 540 },
    { title: "Companies", value: new Set(jobs.map(j => j.company)).size },
    { title: "Users", value: 1500 },
  ]), [jobs]);

  const loadJobs = async (q = "") => {
    try {
      setLoading(true);
      setErr("");
      const url = q ? `${API_BASE}/api/jobs?q=${encodeURIComponent(q)}` : `${API_BASE}/api/jobs`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch jobs (${res.status})`);
      const data = await res.json();
      setJobs(data);
    } catch (e) {
      setErr(e.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadJobs(); }, []);

  const startEdit = (job) => {
    setEditingId(job._id);
    setEditForm({ title: job.title, company: job.company, status: job.status || "Active" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ title: "", company: "", status: "Active" });
  };

  const saveEdit = async () => {
    try {
      if (!editingId) return;
      const res = await fetch(`${API_BASE}/api/jobs/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error(`Update failed (${res.status})`);
      const updated = await res.json();
      setJobs(prev => prev.map(j => j._id === updated._id ? updated : j));
      cancelEdit();
    } catch (e) {
      alert(e.message || "Could not update job");
    }
  };

  const delJob = async (id) => {
    const yes = confirm("Delete this job?");
    if (!yes) return;
    try {
      const res = await fetch(`${API_BASE}/api/jobs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setJobs(prev => prev.filter(j => j._id !== id));
    } catch (e) {
      alert(e.message || "Could not delete job");
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    loadJobs(search.trim());
  };

  return (
    <div className="flex min-h-screen bg-[#1e2329] text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#252b32] shadow-md p-6 hidden md:block">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li className="hover:text-yellow-400 cursor-pointer">📊 Dashboard</li>
          <li className="hover:text-yellow-400 cursor-pointer">💼 Manage Jobs</li>
          <li className="hover:text-yellow-400 cursor-pointer">👥 Users</li>
          <li className="hover:text-yellow-400 cursor-pointer">📄 Applications</li>
          <li className="hover:text-yellow-400 cursor-pointer">⚙️ Settings</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <form onSubmit={onSearch} className="flex gap-2 w-1/2">
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full bg-[#2d333b] text-gray-100 placeholder-gray-400 border-gray-600"
            />
            <button className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400">
              Search
            </button>
          </form>
          <div className="flex items-center gap-4">
            <span className="font-medium">Admin</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-yellow-400"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-[#252b32] shadow-md rounded-lg p-6 text-center">
              <h3 className="text-gray-400">{stat.title}</h3>
              <p className="text-2xl font-bold text-yellow-400">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Jobs Table */}
        <div className="bg-[#252b32] shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-yellow-400">Manage Jobs</h2>
            <button
              onClick={() => alert("Hook this up to your job create form/page")}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              + New Job
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400">Loading jobs…</div>
          ) : err ? (
            <div className="py-12 text-center text-red-400">{err}</div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center text-gray-400">No jobs found.</div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#2d333b] text-left">
                  <th className="p-3">Job Title</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const isEditing = editingId === job._id;
                  return (
                    <tr key={job._id} className="border-b border-gray-700 hover:bg-[#2d333b]">
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="w-full bg-[#1e2329] border border-gray-600 rounded px-2 py-1"
                            value={editForm.title}
                            onChange={(e) => setEditForm(f => ({ ...f, title: e.target.value }))}
                          />
                        ) : job.title}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            className="w-full bg-[#1e2329] border border-gray-600 rounded px-2 py-1"
                            value={editForm.company}
                            onChange={(e) => setEditForm(f => ({ ...f, company: e.target.value }))}
                          />
                        ) : job.company}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <select
                            className="bg-[#1e2329] border border-gray-600 rounded px-2 py-1"
                            value={editForm.status}
                            onChange={(e) => setEditForm(f => ({ ...f, status: e.target.value }))}
                          >
                            <option>Active</option>
                            <option>Closed</option>
                          </select>
                        ) : (
                          <span className={`font-medium ${job.status === "Active" ? "text-green-400" : "text-red-400"}`}>
                            {job.status || "Active"}
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(job)}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => delJob(job._id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
