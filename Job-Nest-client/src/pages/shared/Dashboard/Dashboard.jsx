import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext/AuthContext";

const BACKEND_URL = "http://localhost:3000";

const roleToPath = (role) => {
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

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let ignore = false;

    const go = async () => {
      if (!user?.email) {
        setDone(true);
        return;
      }
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/users/role?email=${encodeURIComponent(user.email)}`
        );
        if (!ignore) {
          if (res.ok) {
            const data = await res.json();
            setRole(data.role);
          } else {
            setRole(null);
          }
          setDone(true);
        }
      } catch {
        if (!ignore) {
          setRole(null);
          setDone(true);
        }
      }
    };

    if (!loading) {
      go();
    }
    return () => { ignore = true; };
  }, [loading, user?.email]);

  if (loading || !done) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  const path = roleToPath(role);
  return <Navigate to={path} replace />;
};

export default Dashboard;
