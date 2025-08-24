import React from "react";
import { FaBriefcase, FaUsers, FaPlus } from "react-icons/fa";
import { Link } from "react-router";

const companyStats = [
  { title: "Jobs Posted", value: "15", icon: <FaBriefcase className="text-blue-600 text-3xl" /> },
  { title: "Total Applicants", value: "128", icon: <FaUsers className="text-green-600 text-3xl" /> },
];

const postedJobs = [
  { title: "Frontend Developer", applicants: 12, status: "Open" },
  { title: "UI/UX Designer", applicants: 8, status: "Closed" },
  { title: "Backend Developer", applicants: 20, status: "Open" },
];

const CompanyDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-200">Company Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        {companyStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between hover:shadow-lg transition">
            <div>
              <h2 className="text-gray-500 text-sm">{stat.title}</h2>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">My Job Posts</h2>
          <Link to="/jobs/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            <FaPlus /> Post New Job
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th>Job Title</th>
                <th>Applicants</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {postedJobs.map((job, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td>{job.title}</td>
                  <td>{job.applicants}</td>
                  <td>{job.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
