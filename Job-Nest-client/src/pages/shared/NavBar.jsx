import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext/AuthContext";

const BACKEND_URL = "http://localhost:3000";

// map role to dashboard path
const getDashboardPath = (role) => {
  switch ((role || "").toLowerCase()) {
    case "admin":
      return "/admin_dashboard";
    case "company":
      return "/company_dashboard";
    case "jobseeker":
      return "/user_dashboard";
    default:
      return "/login";
  }
};

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext); // firebase user + logout from context
  const [role, setRole] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchRole = async (email) => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/users/role?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (!ignore) {
          if (res.ok) setRole(data.role);
          else setRole(null);
        }
      } catch {
        if (!ignore) setRole(null);
      }
    };

    if (user?.email) {
      fetchRole(user.email);
    } else {
      setRole(null);
    }

    return () => {
      ignore = true;
    };
  }, [user?.email]);

  const dashPath = getDashboardPath(role);

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Left side */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li><Link to="/">Home</Link></li>
            <li><Link to="/jobs">Jobs</Link></li>
            <li><Link to="/blogs">Blog</Link></li>
            <li><Link to="/companies">Companies</Link></li>
            <li><Link to="/about">About</Link></li>
            {user && <li><Link to={dashPath}>Dashboard</Link></li>}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">JOB-NEST</Link>
      </div>

      {/* Center (desktop menu) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/jobs">Jobs</Link></li>
          <li><Link to="/blogs">Blog</Link></li>
          <li><Link to="/companies">Companies</Link></li>
          <li><Link to="/about">About</Link></li>
          {user && <li><Link to={dashPath}>Dashboard</Link></li>}
        </ul>
      </div>

      {/* Right side */}
      <div className="navbar-end">
        {!user ? (
          <>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary ml-2">Register</Link>
          </>
        ) : (
          <>
            <button onClick={logOut} className="btn btn-error ml-2">Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
