import React from "react";
import { Links } from "react-router";
import { Link } from "react-router";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/jobs">Jobs</Link></li>
            <li><Link to="/blogs">Blog</Link></li>
            <li><Link to="/companies">Companies</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/admin_dashboard">Dash-Board</Link></li>
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">JOB-NEST</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/jobs">Jobs</Link></li>
          <li><Link to="/blogs">Blog</Link></li>
          <li><Link to="/companies">Companies</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/admin_dashboard">Dash-Board</Link></li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link to="/login" className="btn btn-primary" to="/login">Login</Link>
        <Link to="/register" className="btn btn-secondary ml-2" to="/register">Register</Link>
      </div>
    </div>
  );
}

export default NavBar;