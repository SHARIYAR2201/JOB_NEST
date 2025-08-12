import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

const Apply = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    location: "",
    image: null,
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Application Submitted:", formData, "For Job ID:", id);
    alert("Application submitted successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-sans">
      <Link to="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Jobs
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-gray-100">
        Apply for Job #{id}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            name="number"
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Your Phone Number"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            onChange={handleChange}
            required
            className="input input-bordered w-full"
            placeholder="Your Location"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Profile Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            required
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Resume (PDF)</label>
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            onChange={handleChange}
            required
            className="file-input file-input-bordered w-full"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default Apply;
