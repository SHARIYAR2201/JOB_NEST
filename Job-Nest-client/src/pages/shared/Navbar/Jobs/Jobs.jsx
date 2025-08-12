import React, { useState } from "react";
import { Link } from "react-router-dom";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$100k - $120k",
    description:
      "Build and maintain responsive, user-friendly web interfaces using React and Tailwind CSS.",
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "Amazon",
    location: "Seattle, WA",
    salary: "$110k - $140k",
    description:
      "Analyze large datasets to extract meaningful insights and improve decision-making.",
  },
  {
    id: 3,
    title: "Cloud Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    salary: "$105k - $130k",
    description:
      "Design and manage scalable cloud infrastructure solutions using Azure.",
  },
];

const Jobs = () => {
  const [appliedJobs] = useState([]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans">
      <h1 className="text-4xl font-bold mb-10 text-gray-200">Available Jobs</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
            <p className="text-blue-600">{job.company}</p>
            <p className="text-gray-500 text-sm">{job.location}</p>
            <p className="text-green-600 font-semibold mt-2">{job.salary}</p>
            <p className="text-gray-600 text-sm mt-4">{job.description}</p>

            <div className="flex gap-3 mt-6">
              <Link
                to={`/jobs/${job.id}`}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
              >
                View Details
              </Link>
              <Link
                to={`/apply/${job.id}`}
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
