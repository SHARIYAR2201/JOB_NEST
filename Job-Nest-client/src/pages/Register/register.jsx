import Lottie from "lottie-react";
import React, { useState, useContext } from "react";
import registerLottie from "../../assets/Lotties/register.json";
import { AuthContext } from "../../contexts/AuthContext/AuthContext"; // adjust path

const BACKEND_URL = "http://localhost:3000"; // no API_BASE, as requested

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;
    const fullName = form.name.value.trim();
    const mobileNumber = form.phone.value.trim();
    const role = form.role.value;

    // client-side checks
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (!/^\+?\d{8,15}$/.test(mobileNumber)) return setError("Enter a valid phone number (8–15 digits, optional +).");
    if (!role) return setError("Please select a role.");

    try {
      setLoading(true);

      // 1) Create account in Firebase Auth
      const cred = await createUser(email, password);
      const fbUser = cred.user;

      // 2) Save to your backend (role, phone, name, etc.)
      const res = await fetch(`${BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, mobileNumber, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        // optional: rollback Firebase if backend rejects for some reason
        // await fbUser.delete();
        throw new Error(data?.error || "Registration failed!");
      }

      // 3) Cache minimal user info for UI/navigation (avoid storing password)
      localStorage.setItem(
        "jn_user",
        JSON.stringify({ email: data.email || email, role, fullName, mobileNumber })
      );

      setSuccess("Registration successful! You can now login.");
      form.reset();
    } catch (err) {
      setError(err?.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        {/* Lottie Animation */}
        <div className="text-center lg:text-left w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <Lottie animationData={registerLottie} loop />
          </div>
        </div>

        {/* Registration Form */}
        <div className="card bg-base-100 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md shrink-0 shadow-2xl">
          <div className="card-body">
            <form className="fieldset" onSubmit={handleRegister} noValidate>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Register now!</h1>

              <label className="label">Full Name</label>
              <input name="name" type="text" className="input input-bordered w-full" placeholder="Your Name" required />

              <label className="label">Email</label>
              <input name="email" type="email" className="input input-bordered w-full" placeholder="Email" required />

              <label className="label">Mobile Number</label>
              <input name="phone" type="tel" className="input input-bordered w-full" placeholder="+8801XXXXXXXXX" required />

              <label className="label">Password</label>
              <input name="password" type="password" className="input input-bordered w-full" placeholder="Password" required minLength={6} />

              <label className="label">Role</label>
              <select name="role" className="select select-bordered w-full" defaultValue="" required>
                <option value="" disabled>Select your role</option>
                <option value="jobseeker">Jobseeker</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>

              <div className="form-control mt-2">
                <label className="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" className="checkbox checkbox-sm" required />
                  <span className="label-text">I agree to terms & conditions</span>
                </label>
              </div>

              {error && <div className="text-red-500 mt-2">{error}</div>}
              {success && <div className="text-green-500 mt-2">{success}</div>}

              <button className="btn btn-neutral mt-4 w-full" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>

              <div className="text-center mt-4">
                <span className="text-sm">
                  Already have an account? <a href="/login" className="link link-primary">Login</a>
                </span>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
