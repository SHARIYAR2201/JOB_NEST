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
  const { user, logOut } = useContext(AuthContext); // firebase user + logout
  const [role, setRole] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [displayName, setDisplayName] = useState("");

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

    const fetchProfile = async (email) => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/users/by-email?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) {
          if (!ignore) {
            // fallback to Firebase fields only
            setAvatarUrl(user?.photoURL || null);
            setDisplayName(user?.displayName || "");
          }
          return;
        }
        const data = await res.json();
        if (!ignore) {
          setAvatarUrl(
            (user?.photoURL && user.photoURL.trim()) ||
              (data?.avatarUrl && data.avatarUrl.trim()) ||
              null
          );
          setDisplayName(
            (data?.fullName && String(data.fullName)) ||
              user?.displayName ||
              ""
          );
        }
      } catch {
        if (!ignore) {
          setAvatarUrl(user?.photoURL || null);
          setDisplayName(user?.displayName || "");
        }
      }
    };

    if (user?.email) {
      fetchRole(user.email);
      fetchProfile(user.email);
    } else {
      setRole(null);
      setAvatarUrl(null);
      setDisplayName("");
    }

    return () => {
      ignore = true;
    };
  }, [user?.email, user?.photoURL, user?.displayName]);

  const dashPath = getDashboardPath(role);
  const avatarFallback =
    "https://i.ibb.co/Kb0Zf1w/avatar-placeholder.png"; // nice neutral placeholder

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
            {user && <li><Link to="/profile">Profile</Link></li>}
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
      <div className="navbar-end gap-2">
        {!user ? (
          <>
            <Link to="/login" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn btn-secondary ml-2">Register</Link>
          </>
        ) : (
          <>
            {/* Avatar -> /profile */}
            <Link
              to="/profile"
              className="btn btn-ghost btn-circle avatar"
              title={displayName || user.email}
            >
              <div className="w-10 rounded-full overflow-hidden ring ring-base-200">
                <img
                  src={avatarUrl || avatarFallback}
                  alt="User avatar"
                  onError={(e) => {
                    e.currentTarget.src = avatarFallback;
                  }}
                />
              </div>
            </Link>
            <button onClick={logOut} className="btn btn-error">Logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
