import React, { useEffect, useState } from "react";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const { axios, setRole, navigate } = useAppContext();

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      // First check if token exists
      if (!token) {
        toast.error("Please login to access this page");
        navigate("/login");
        return;
      }

      // Fetch user role from token or API
      const decodedToken = jwtDecode(token); // You'll need jwt-decode package
      const userRole = decodedToken?.role;

      if (!userRole || (userRole !== "super-admin" && userRole !== "admin")) {
        toast.error("You are not authorized to view this page");
        return;
      }

      // Now make the API call
      const { data } = await axios.get("/api/admin/blogs", {
        headers: {
          Authorization: ` ${token}`, // Fixed: Added 'Bearer' prefix
        },
      });

      if (data.success) {
        setBlogs(data.blogs);
        setRole(userRole); // Set role from token, not from response
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pl-16 bg-blue-50/50">
      <h1>All blogs</h1>

      <div className="relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-600 text-left uppercase">
            <tr>
              <th scope="col" className="px-2 py-4 xl:px-6">
                #
              </th>
              <th scope="col" className="px-2 py-4">
                Blog Title
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Date
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Status
              </th>
              <th scope="col" className="px-2 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => {
              return (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={fetchBlogs}
                  index={index + 1}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
