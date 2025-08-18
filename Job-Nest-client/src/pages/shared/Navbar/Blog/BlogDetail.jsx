// src/pages/BlogDetails.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AuthContext } from "../../../../contexts/AuthContext/AuthContext";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const BlogDetails = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  const [role, setRole] = useState(null);
  const isAdmin = (role || "").toLowerCase() === "admin";

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Editor
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState({ title: "", coverImageUrl: "", tags: "", content: "" });

  useEffect(() => {
    let ignore = false;
    const fetchRole = async (email) => {
      try {
        if (!email) return setRole(null);
        const res = await fetch(`${BACKEND_URL}/api/users/role?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (!ignore) setRole(res.ok ? data.role : null);
      } catch { if (!ignore) setRole(null); }
    };
    fetchRole(user?.email || "");
    return () => { ignore = true; };
  }, [user?.email]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/blogs/${id}`);
      if (!res.ok) throw new Error("Failed to load blog");
      const data = await res.json();
      setBlog(data);
    } catch (e) {
      nav("/blogs", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const startEdit = () => {
    if (!blog) return;
    setForm({
      title: blog.title || "",
      coverImageUrl: blog.coverImageUrl || "",
      tags: (Array.isArray(blog.tags) ? blog.tags : []).join(", "),
      content: blog.content || "",
    });
    setShowEditor(true);
  };

  const saveBlog = async () => {
    try {
      const payload = {
        title: form.title.trim(),
        coverImageUrl: form.coverImageUrl.trim(),
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        content: form.content, // plain text
      };
      const res = await fetch(`${BACKEND_URL}/api/blogs/${blog._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");
      await load();
      setShowEditor(false);
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteBlog = async () => {
    const yes = confirm("Delete this blog?");
    if (!yes) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/blogs/${blog._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      nav("/blogs", { replace: true });
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }
  if (!blog) return null;

  // Render blog body safely as plain text, preserving newlines
  const body = (blog.content || "");
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
      <div className="mb-6">
        <button className="btn btn-ghost" onClick={() => nav(-1)}>← Back</button>
      </div>

      {blog.coverImageUrl && (
        <img
          src={blog.coverImageUrl}
          alt={blog.title}
          className="w-full rounded-xl mb-6 object-cover max-h-[360px]"
        />
      )}

      <h1 className="text-3xl md:text-4xl font-bold mb-2">{blog.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {blog.author?.name ? <>By <span className="font-medium">{blog.author.name}</span> • </> : null}
        {new Date(blog.createdAt).toLocaleString()}
      </div>

      {Array.isArray(blog.tags) && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags.map((t, i) => (
            <span key={i} className="badge badge-outline">{t}</span>
          ))}
        </div>
      )}

      {/* Plain text content with newlines preserved */}
      <div className="prose max-w-none whitespace-pre-wrap">
        {body}
      </div>

      {isAdmin && (
        <div className="flex gap-2 mt-8">
          <button className="btn" onClick={startEdit}>Edit</button>
          <button className="btn btn-error" onClick={deleteBlog}>Delete</button>
        </div>
      )}

      {/* Admin Editor Drawer */}
      {isAdmin && showEditor && (
        <div className="fixed inset-0 bg-black/40 z-40 flex justify-end">
          <div className="w-full max-w-xl h-full bg-base-100 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Blog</h2>
              <button className="btn btn-ghost" onClick={() => setShowEditor(false)}>✕</button>
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
                  placeholder="Write your post in plain text. Newlines will be preserved."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button className="btn" onClick={() => setShowEditor(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveBlog}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogDetails;
