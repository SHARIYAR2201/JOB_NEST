import {
  createBrowserRouter,
} from "react-router";

import RootLayout from '../layout/RootLayout.jsx';
import Home from '../pages/Home/Home.jsx';
import Register from "../pages/Register/register.jsx";
import Blog from "../pages/shared/Navbar/Blog/Blog.jsx";
import Company from "../pages/shared/Navbar/Company.jsx";
import Login from "../pages/shared/Login.jsx";
import Jobs from "../pages/shared/Navbar/Jobs/Jobs.jsx";
import About from "../pages/shared/Navbar/About.jsx";
import AdminDashboard from "../pages/shared/Dashboard/Admindashboard.jsx";
import BlogDetails from "../pages/shared/Navbar/Blog/BlogDetail.jsx";
import JobDetails from "../pages/shared/Navbar/Jobs/JobDetails.jsx";
import Apply from "../pages/shared/Navbar/Jobs/Apply.jsx";
import SearchJobs from "../pages/Home/SearchJobs.jsx";



const router = createBrowserRouter([
  { 
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home 
        },
        {
          path: "/register",
          Component: Register
        },
        {
          path: "/blogs",
          Component: Blog
        },
        {
          path: "/blogs/:slug",
          Component: BlogDetails
        },
        {
          path: "/companies",
          Component: Company 
        },
        {
          path: "/login",
          Component: Login
        },
        {
          path: "/jobs",
          Component: Jobs
        },
        {
          path: "/jobs/:id",
          Component: JobDetails
        },
        {
          path: "/apply/:id",
          Component: Apply
        },
        {
          path: "/about",
          Component: About
        },
        {
          path: "/admin_dashboard",
          Component: AdminDashboard
        },
        {
          path: "/search-jobs",  // New route for SearchJobs
          Component: SearchJobs // Link to SearchJobs component
        }
    ]    
  },
]);


export default router;
