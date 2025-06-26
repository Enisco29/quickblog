import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    setUser(null);
    setRole(null);
    navigate("/");
  };

  // In your AppContext.js
  useEffect(() => {
    fetchBlogs();
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      axios.defaults.headers.common["Authorization"] = token;

      // Immediately decode the token to get role
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Manual JWT decode
        setRole(decoded.role);
      } catch (error) {
        console.error("Token decode error:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { data } = await axios.get("/api/users/is-auth", {
          headers: { Authorization: token }, // No Bearer prefix
        });
        if (data.success && data.user) {
          setUser(data.user);
          setRole(data.user.role);
        }
      } catch (error) {
        console.error("Auth error:", error.message);
      }
    };

    fetchUser();
  }, []);

  const value = {
    axios,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    role,
    setRole,
    logout,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
