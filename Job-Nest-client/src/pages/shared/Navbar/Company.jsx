import React from 'react';

const companies = [
  {
    name: 'Google',
    title: 'Software Engineer',
    review: 'An excellent place for innovation, collaboration, and career growth.',
  },
  {
    name: 'Microsoft',
    title: 'Cloud Solutions Architect',
    review: 'Strong work-life balance with great resources for learning and development.',
  },
  {
    name: 'Amazon',
    title: 'Data Analyst',
    review: 'High-paced environment with plenty of challenges and opportunities to grow.',
  },
  {
    name: 'Meta',
    title: 'Product Manager',
    review: 'Incredible teams and leadership. Focused on delivering user-first products.',
  },
];

const Company = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-10 text-gray-200">Company Profiles & Reviews</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {companies.map((company, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">{company.name}</h2>
            <p className="text-blue-600 mb-2">{company.title}</p>
            <p className="text-gray-600 text-sm">{company.review}</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Company;
