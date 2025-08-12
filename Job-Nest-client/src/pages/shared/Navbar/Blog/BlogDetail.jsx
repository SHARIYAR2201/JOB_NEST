import React from "react";
import { useParams } from "react-router-dom";
import { articles } from "./Blog.jsx"; // Import the articles array

const BlogDetails = () => {
  const { slug } = useParams();
  const blog = articles.find((a) => a.slug === slug);

  if (!blog) {
    return <div className="p-10 text-red-500">Blog not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">{blog.title}</h1>
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {blog.content}
      </p>
    </div>
  );
};

export default BlogDetails;
