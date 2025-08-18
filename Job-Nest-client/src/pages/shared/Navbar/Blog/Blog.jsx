// src/pages/Blogs.jsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Blogs = () => {
  const { user } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [role, setRole] = useState(null);
  const isAdmin = (role || "").toLowerCase() === "admin";

  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [tag, setTag] = useState(searchParams.get("tag") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [limit] = useState(9);

  // Admin editor state
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    coverImageUrl: "",
    tags: "",
  });

  const totalPages = useMemo(() => Math.max(Math.ceil(total / limit), 1), [total, limit]);

  useEffect(() => {
    let ignore = false;
    const fetchRole = async (email) => {
      try {
        if (!email) return setRole(null);
        const res = await fetch(`${BACKEND_URL}/api/users/role?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!ignore) setRole(res.ok ? data.role : null);
      } catch {
        if (!ignore) setRole(null);
      }
    };
    fetchRole(user?.email || "");
    return () => { ignore = true; };
  }, [user?.email]);

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (tag) params.set("tag", tag);
      params.set("page", String(page));
      params.set("limit", String(limit));

      setSearchParams(Object.fromEntries(params));

      const res = await fetch(`${BACKEND_URL}/api/blogs?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch blogs (${res.status})`);
      const data = await res.json();
      setBlogs(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      setErr(e.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, tag]);
  const onSearch = (e) => { e.preventDefault(); setPage(1); load(); };

  const startCreate = () => {
    setEditingId(null);
    setForm({ title: "", content: "", coverImageUrl: "", tags: "" });
    setShowEditor(true);
  };

  const startEdit = (b) => {
    setEditingId(b._id);
    setForm({
      title: b.title || "",
      content: b.content || "",
      coverImageUrl: b.coverImageUrl || "",
      tags: (Array.isArray(b.tags) ? b.tags : []).join(", "),
    });
    setShowEditor(true);
  };

  const cancelEditor = () => {
    setShowEditor(false);
    setEditingId(null);
  };

  const saveBlog = async () => {
    const payload = {
      title: form.title.trim(),
      content: form.content, // store as plain text
      coverImageUrl: form.coverImageUrl.trim(),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      author: {
        name: user?.displayName || "Admin",
        email: user?.email || "",
      },
    };
    try {
      const url = editingId
        ? `${BACKEND_URL}/api/blogs/${editingId}`
        : `${BACKEND_URL}/api/blogs`;
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`${editingId ? "Update" : "Create"} failed`);
      await load();
      cancelEditor();
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteBlog = async (id) => {
    const yes = confirm("Delete this blog?");
    if (!yes) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold">Blogs</h1>
        {isAdmin && (
          <button className="btn btn-primary" onClick={startCreate}>
            + New Blog
          </button>
        )}
      </div>

      {/* Search / Filter */}
      <form className="flex flex-col md:flex-row gap-3 mb-6" onSubmit={onSearch}>
        <input
          className="input input-bordered flex-1"
          placeholder="Search blogs…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <input
          className="input input-bordered md:w-64"
          placeholder="Filter by tag (e.g. React)"
          value={tag}
          onChange={(e) => { setTag(e.target.value); setPage(1); }}
        />
        <button className="btn btn-neutral">Search</button>
      </form>

      {/* Content */}
      {loading ? (
        <div className="py-12 text-center">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : err ? (
        <div className="alert alert-error">{err}</div>
      ) : blogs.length === 0 ? (
        <div className="py-12 text-center text-gray-500">No blogs found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((b) => {
            // Build a safe plain-text preview
            const preview = (b.content || "").replace(/\r\n/g, "\n").split("\n").join(" ");
            const snippet = preview.length > 180 ? preview.slice(0, 180) + "…" : preview;

            return (
              <div key={b._id} className="card bg-base-100 shadow hover:shadow-lg transition">
                {b.coverImageUrl ? (
                  <figure className="max-h-48 overflow-hidden">
                    <img src={b.coverImageUrl} alt={b.title} className="w-full object-cover" />
                  </figure>
                ) : null}
                <div className="card-body">
                  <h2 className="card-title line-clamp-2">{b.title}</h2>
                  <p className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleString()}</p>
                  {Array.isArray(b.tags) && b.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 my-2">
                      {b.tags.map((t, i) => (
                        <span key={i} className="badge badge-outline">{t}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm line-clamp-3">{snippet}</p>
                  <div className="card-actions justify-between mt-4">
                    <Link to={`/blogs/${b._id}`} className="btn btn-sm btn-primary">Read more</Link>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <button className="btn btn-sm" onClick={() => startEdit(b)}>Edit</button>
                        <button className="btn btn-sm btn-error" onClick={() => deleteBlog(b._id)}>Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="join mt-8 flex flex-wrap">
          <button className="join-item btn" disabled={page <= 1} onClick={() => setPage(p => Math.max(p - 1, 1))}>
            «
          </button>
          <button className="join-item btn">Page {page} / {totalPages}</button>
          <button className="join-item btn" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))}>
            »
          </button>
        </div>
      )}

      {/* Admin Editor Drawer */}
      {isAdmin && showEditor && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-xl h-full bg-base-100 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{editingId ? "Edit Blog" : "New Blog"}</h2>
              <button className="btn btn-ghost" onClick={cancelEditor}>✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="label">Title</label>
                <input
                  className="input input-bordered w-full"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Cover Image URL</label>
                <input
                  className="input input-bordered w-full"
                  value={form.coverImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, coverImageUrl: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Tags (comma separated)</label>
                <input
                  className="input input-bordered w-full"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                />
              </div>
              <div>
                <label className="label">Content (plain text)</label>
                <textarea
                  className="textarea textarea-bordered w-full min-h-56"
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Write your post (plain text). Newlines will be preserved."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="btn" onClick={cancelEditor}>Cancel</button>
                <button className="btn btn-primary" onClick={saveBlog}>
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Blogs;
