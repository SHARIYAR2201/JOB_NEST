import React from 'react';

const Home = () => {
  return (
    <div className="font-sans">
      <section className="bg-blue-1600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
        <form className="max-w-xl mx-auto flex gap-2">
          <input type="text" placeholder="Job title or keyword" className="flex-1 p-3 rounded-lg"/>
          <input type="text" placeholder="Location" className="flex-1 p-3 rounded-lg"/>
          <button className="px-6 bg-yellow-400 rounded-lg font-semibold">Search</button>
        </form>

      </section>
      <section className="max-w-7xl mx-auto py-12">
        <h2 className="text-3xl bg-gray-1000 font-bold mb-6">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
      </section>

      <section className="bg-gray-1000 py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-4"></div>
      </section>

      <section className="max-w-7xl mx-auto py-12">
        <h2 className="text-3xl font-bold mb-6">Top Employers</h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
        </div>
      </section>

      <section className="py-12 bg-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Career Advice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        </div>
      </section>
      
    </div>
  );
};

export default Home;
