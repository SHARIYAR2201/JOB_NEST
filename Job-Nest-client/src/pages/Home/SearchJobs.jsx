import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";  // Use useLocation from react-router

const SearchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [category, setCategory] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const location = useLocation(); // Get the current location from the router
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q"); // Get search query from URL

  useEffect(() => {
    // Simulate fetching jobs
    const fetchedJobs = [
      { id: 1, title: "Frontend Developer", category: "Development", salary: 60000 },
      { id: 2, title: "Backend Developer", category: "Development", salary: 70000 },
      { id: 3, title: "Data Scientist", category: "Data", salary: 80000 },
    ];
    setJobs(fetchedJobs);
    setFilteredJobs(fetchedJobs);
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSalaryChange = (e) => {
    setSalaryRange(e.target.value);
  };

  useEffect(() => {
    let results = jobs.filter(job =>
      job.title.toLowerCase().includes(searchQuery?.toLowerCase() || "")
    );

    if (category) {
      results = results.filter(job => job.category === category);
    }

    if (salaryRange) {
      results = results.filter(job => job.salary >= Number(salaryRange));
    }

    setFilteredJobs(results);
  }, [searchQuery, category, salaryRange, jobs]);

  return (
    <div className="search-jobs">
      <h1>Search Jobs</h1>

      {/* Filters */}
      <div className="filters">
        <label>
          Category:
          <select onChange={handleCategoryChange} value={category}>
            <option value="">All</option>
            <option value="Development">Development</option>
            <option value="Data">Data</option>
          </select>
        </label>

        <label>
          Salary Range:
          <input
            type="number"
            placeholder="Min Salary"
            onChange={handleSalaryChange}
            value={salaryRange}
          />
        </label>
      </div>

      {/* Displaying the filtered jobs */}
      <div className="job-list">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.category}</p>
            <p>${job.salary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchJobs;
