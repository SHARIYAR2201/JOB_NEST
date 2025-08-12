import Lottie from "lottie-react";
import React from "react";
import registerLottie from "../../assets/Lotties/register.json";

const Register = () => {

  const handleRegister = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const fullName = form.name.value;
    const mobileNumber = form.phone.value;
    const role = form.role.value;
    console.log("Registration Data:", { email, password, fullName, mobileNumber, role });
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        
        {/* Lottie Animation */}
        <div className="text-center lg:text-left w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <Lottie animationData={registerLottie} loop={true} />
          </div>
        </div>

        {/* Registration Form */}
        <div className="card bg-base-100 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-md shrink-0 shadow-2xl">
          <div className="card-body">
            <form className="fieldset" onSubmit={handleRegister}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Register now!</h1>
              
              {/* Full Name */}
              <label className="label">Full Name</label>
              <input name="name" type="text" className="input input-bordered w-full" placeholder="Your Name" required />
              
              {/* Email */}
              <label className="label">Email</label>
              <input name="email" type="email" className="input input-bordered w-full" placeholder="Email" required />
              
              {/* Mobile Number */}
              <label className="label">Mobile Number</label>
              <input name="phone" type="tel" className="input input-bordered w-full" placeholder="Phone Number" required />
              
              {/* Password */}
              <label className="label">Password</label>
              <input name="password" type="password" className="input input-bordered w-full" placeholder="Password" required />

              {/* Role Dropdown */}
              <label className="label">Role</label>
              <select name="role" className="select select-bordered w-full" required>
                <option value="" disabled selected>Select your role</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              
              {/* Terms */}
              <div className="form-control mt-2">
                <label className="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" className="checkbox checkbox-sm" required />
                  <span className="label-text">I agree to terms & conditions</span>
                </label>
              </div>
              
              {/* Submit Button */}
              <button className="btn btn-neutral mt-4 w-full" type="submit">Register</button>
              
              {/* Already have account */}
              <div className="text-center mt-4">
                <span className="text-sm">
                  Already have an account?{" "}
                  <a href="/login" className="link link-primary">Login</a>
                </span>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;
