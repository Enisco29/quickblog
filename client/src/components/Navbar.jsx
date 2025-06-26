import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { navigate, role, logout } = useAppContext();
  const token = localStorage.getItem("token");
  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        src={assets.logo}
        alt="logo"
        onClick={() => navigate("/")}
        className="w-32 sm:w-44 cursor-pointer"
      />
      {!token && (
        <button
          onClick={() => navigate("/user-login")}
          className={`flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white max-md:px-5 px-10 py-2.5`}
        >
          login
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      )}

      {token && role === "user" && (
        <button
          onClick={logout}
          className={`flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white max-md:px-5 px-10 py-2.5`}
        >
          logout
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      )}

      {token && (role === "super-admin" || role === "admin") && (
        <button
          onClick={() => navigate("/!admin~~")}
          className={`flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white max-md:px-5 px-10 py-2.5`}
        >
          Admin
          <img src={assets.arrow} alt="arrow" className="w-3" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
