import React from 'react';
import { Link } from 'react-router-dom'; // ✅ Added import for linking

const articles = [
  {
    id: 1, // ✅ Added unique ID
    slug: 'resume-writing-tips', // ✅ Added slug for routing
    title: '10 Resume Writing Tips to Land Your Dream Job',
    excerpt: 'Learn how to craft a resume that stands out to employers and gets you interviews.',
    image: 'https://ibb.co.com/21T3Hfr1',
    content: `Here goes the full detailed content for Resume Writing Tips...`
  },
  {
    id: 2,
    slug: 'job-market-trends-2025',
    title: '2025 Job Market Trends You Should Know',
    excerpt: 'Understand what roles are in demand and how to align your skills with market needs.',
    image: 'https://images.unsplash.com/photo-1581093588401-3b88364c0172?auto=format&fit=crop&w=800&q=80',
    content: `Here goes the full detailed content for Job Market Trends 2025...`
  },
  {
    id: 3,
    slug: 'mastering-remote-work',
    title: 'Mastering Remote Work in the Modern World',
    excerpt: 'Best practices for productivity, communication, and work-life balance when working remotely.',
    image: 'https://images.unsplash.com/photo-1580894747395-9c4c253f11ea?auto=format&fit=crop&w=800&q=80',
    content: `Here goes the full detailed content for Mastering Remote Work...`
  },
  {
    id: 4,
    slug: 'top-interview-questions',
    title: 'Top Interview Questions and How to Answer Them',
    excerpt: 'Prepare for common and tricky interview questions with confident, structured responses.',
    image: 'https://images.unsplash.com/photo-1611421440330-8155b0c1b735?auto=format&fit=crop&w=800&q=80',
    content: `Here goes the full detailed content for Top Interview Questions...`
  },
];

const Blog = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-4xl font-bold mb-10 text-gray-200">Career Advice & Blog</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <img
              src={article.image}
              alt={article.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{article.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
              <div className="flex gap-3">
                {/* ✅ Changed button to Link */}
                <Link
                  to={`/blogs/${article.slug}`}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                >
                  Read More
                </Link>
                <button className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition">
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
export { articles }; // ✅ Exported for BlogDetails page
