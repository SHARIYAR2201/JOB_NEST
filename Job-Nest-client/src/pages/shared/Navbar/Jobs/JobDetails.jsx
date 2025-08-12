import React from "react";
import { useParams, Link } from "react-router-dom";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$100k - $120k",
    description:
      "Build and maintain responsive, user-friendly web interfaces using React and Tailwind CSS.",
    requirements: [
      "Proficient in React, Tailwind CSS, and JavaScript",
      "Strong understanding of responsive design",
      "Experience with Git and version control",
    ],
    benefits: [
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Remote work flexibility",
    ],
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "Amazon",
    location: "Seattle, WA",
    salary: "$110k - $140k",
    description:
      "Analyze large datasets to extract meaningful insights and improve decision-making.",
    requirements: [
      "Strong Python and SQL skills",
      "Experience with machine learning models",
      "Excellent data visualization skills",
    ],
    benefits: [
      "Paid parental leave",
      "Wellness programs",
      "Employee discounts",
    ],
  },
  {
    id: 3,
    title: "Cloud Engineer",
    company: "Microsoft",
    location: "Redmond, WA",
    salary: "$105k - $130k",
    description:
      "Design and manage scalable cloud infrastructure solutions using Azure.",
    requirements: [
      "Experience with Azure cloud services",
      "Infrastructure as Code knowledge",
      "Understanding of networking and security",
    ],
    benefits: [
      "Professional development allowance",
      "Flexible working hours",
      "Generous PTO policy",
    ],
  },
];

const JobDetails = () => {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === parseInt(id));

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-red-500">
        Job not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans">
      <Link
        to="/jobs"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Jobs
      </Link>

      <h1 className="text-3xl font-bold mb-2 text-gray-100">{job.title}</h1>
      <p className="text-blue-600">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>
      <p className="text-green-600 font-semibold mt-2">{job.salary}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-100">Job Description</h2>
        <p className="text-gray-400">{job.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-100">Requirements</h2>
        <ul className="list-disc pl-5 text-gray-400">
          {job.requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-100">Benefits</h2>
        <ul className="list-disc pl-5 text-gray-400">
          {job.benefits.map((benefit, idx) => (
            <li key={idx}>{benefit}</li>
          ))}
        </ul>
      </div>

      <Link
        to={`/apply/${job.id}`}
        className="mt-8 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        Apply Now
      </Link>
    </div>
  );
};

export default JobDetails;
