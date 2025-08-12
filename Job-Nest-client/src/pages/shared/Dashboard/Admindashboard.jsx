import React from "react";
import { FaUsers, FaBriefcase, FaClipboardList } from "react-icons/fa";

const stats = [
  {
    title: "Total Users",
    value: "1,245",
    icon: <FaUsers className="text-blue-600 text-3xl" />,
  },
  {
    title: "Total Jobs Posted",
    value: "342",
    icon: <FaBriefcase className="text-green-600 text-3xl" />,
  },
  {
    title: "Applications",
    value: "5,678",
    icon: <FaClipboardList className="text-yellow-600 text-3xl" />,
  },
];

const recentUsers = [
  { name: "John Doe", email: "john@example.com", role: "User" },
  { name: "Jane Smith", email: "jane@example.com", role: "Company" },
  { name: "Mike Johnson", email: "mike@example.com", role: "User" },
];

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-200">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
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

      {/* Recent Users Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
