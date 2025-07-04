import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const Sidebar = () => {
  const { role } = useAppContext();

  return (
    <div className="flex flex-col border-r border-gray-200 min-h-full pt-6">
      {role === "super-admin" && (
        <NavLink
          end={true}
          to="/!admin~~"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
              isActive && "bg-primary/10 border-r-4 border-primary"
            }`
          }
        >
          <img src={assets.home_icon} alt="home-icon" className="min-w-4 w-5" />
          <p className="hidden md:inline-block">Dashboard</p>
        </NavLink>
      )}

      {role === "super-admin" ||
        (role === "admin" && (
          <NavLink
            to="/!admin~~/addBlog"
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
                isActive && "bg-primary/10 border-r-4 border-primary"
              }`
            }
          >
            <img
              src={assets.add_icon}
              alt="home-icon"
              className="min-w-4 w-5"
            />
            <p className="hidden md:inline-block">Add Blogs</p>
          </NavLink>
        ))}

      {role === "super-admin" && (
        <NavLink
          to="/!admin~~/listBlogs"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
              isActive && "bg-primary/10 border-r-4 border-primary"
            }`
          }
        >
          <img src={assets.list_icon} alt="home-icon" className="min-w-4 w-5" />
          <p className="hidden md:inline-block">Blog lists</p>
        </NavLink>
      )}

      {role === "super-admin" && (
        <NavLink
          to="/!admin~~/comments"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
              isActive && "bg-primary/10 border-r-4 border-primary"
            }`
          }
        >
          <img
            src={assets.comment_icon}
            alt="home-icon"
            className="min-w-4 w-5"
          />
          <p className="hidden md:inline-block">Comments</p>
        </NavLink>
      )}

      {role === "super-admin" && (
        <NavLink
          to="/!admin~~/usersList"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
              isActive && "bg-primary/10 border-r-4 border-primary"
            }`
          }
        >
          <img src={assets.user_icon} alt="home-icon" className="min-w-4 w-5" />
          <p className="hidden md:inline-block">Users list</p>
        </NavLink>
      )}
    </div>
  );
};

export default Sidebar;
