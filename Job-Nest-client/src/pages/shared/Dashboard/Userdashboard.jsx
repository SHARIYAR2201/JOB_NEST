import React from "react";
import { FaClipboardList, FaHeart } from "react-icons/fa";

const userStats = [
  {
    title: "Jobs Applied",
    value: "7",
    icon: <FaClipboardList className="text-blue-600 text-3xl" />,
  },
  {
    title: "Saved Jobs",
    value: "5",
    icon: <FaHeart className="text-pink-600 text-3xl" />,
  },
];

const appliedJobs = [
  { title: "Frontend Developer", company: "Google", status: "Interview Scheduled" },
  { title: "Backend Developer", company: "Amazon", status: "Pending" },
  { title: "UI/UX Designer", company: "Microsoft", status: "Rejected" },
];

const savedJobs = [
  { title: "Data Scientist", company: "Meta" },
  { title: "Cloud Engineer", company: "AWS" },
];

const UserDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-200">User Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {userStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between hover:shadow-lg transition"
          >
            <div>
              <h2 className="text-gray-500 text-sm">{stat.title}</h2>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      {/* Applied Jobs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Applied Jobs</h2>
        <ul className="divide-y">
          {appliedJobs.map((job, index) => (
            <li key={index} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
              <span className="text-sm text-gray-700">{job.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Saved Jobs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Saved Jobs</h2>
        <ul className="divide-y">
          {savedJobs.map((job, index) => (
            <li key={index} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
              <button className="text-blue-600 hover:underline">View</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
