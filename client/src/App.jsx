import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddBlog from "./pages/admin/AddBlog";
import ListBlog from "./pages/admin/ListBlog";
import Comments from "./pages/admin/Comments";
import "quill/dist/quill.snow.css";
import UserLogin from "./components/users/Login";
import UserLIst from "./pages/admin/UserLIsts";
import { Toaster } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { token } = useAppContext();

  let decodedToken = null;
  if (token) {
    decodedToken = jwtDecode(token);
  }

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route
          path="/!admin~~"
          element={decodedToken ? <Layout /> : <UserLogin />}
        >
          <Route index element={<Dashboard />} />
          <Route path="addBlog" element={<AddBlog />} />
          <Route path="listBlogs" element={<ListBlog />} />
          <Route path="comments" element={<Comments />} />
          <Route path="usersList" element={<UserLIst />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
