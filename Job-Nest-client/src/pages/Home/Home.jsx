import React from "react";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import heroAnim from "../../assets/Lotties/hero.json"; // your downloaded animation

const Home = () => {
  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section with Gradient & Lottie */}
      <section className="relative py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-blue-900 opacity-90"></div>
        <div className="relative max-w-3xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Find Your Dream Job
          </h1>
          <form className="max-w-xl mx-auto flex gap-2 mb-10">
            <input
              type="text"
              placeholder="Job title or keyword"
              className="flex-1 p-3 rounded-lg text-gray-900"
            />
            <input
              type="text"
              placeholder="Location"
              className="flex-1 p-3 rounded-lg text-gray-900"
            />
            <button className="px-6 bg-yellow-400 rounded-lg font-semibold hover:bg-yellow-500 transition">
              Search
            </button>
          </form>
          <div className="mx-auto w-64 sm:w-80 md:w-96">
            <Lottie animationData={heroAnim} loop autoplay />
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Example job card */}
          <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Software Engineer</h3>
            <p className="text-gray-600">Google · Dhaka, Bangladesh</p>
            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
              Apply Now
            </button>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Browse by Category
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Add appropriate Lottie here if desired */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold">Technology</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold">Marketing</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="font-semibold">Finance</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Top Employers */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Top Employers</h2>
        <div className="flex flex-wrap items-center justify-center gap-12">
          {/* Lottie or logos */}
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google"
            className="h-12"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Microsoft_logo_%282012%29.svg"
            alt="Microsoft"
            className="h-12"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            alt="Amazon"
            className="h-12"
          />
        </div>
      </section>

      {/* Career Advice */}
      <section className="py-16 bg-white px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Career Advice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">
              How to Ace Your Interview
            </h3>
            <p className="text-gray-600">
              Get tips from experts on how to impress employers.
            </p>
          </div>
          <div className="bg-gray-50 shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Building Your Resume</h3>
            <p className="text-gray-600">
              Learn how to create a resume that stands out.
            </p>
          </div>
          <div className="bg-gray-50 shadow-md p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">
              Career Growth Strategies
            </h3>
            <p className="text-gray-600">
              Discover how to grow and succeed in your career.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
