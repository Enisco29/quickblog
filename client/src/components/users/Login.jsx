import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";

const UserLogin = () => {
  const {
    axios,
    setToken,
    navigate,
    setUser,
    setShowUserLogin,
    setRole,
    token,
  } = useAppContext();

  const [state, setState] = useState("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `/api/users/${state}`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      ); //
      if (data.success) {
        navigate("/");
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setRole(data.user.role);
        axios.defaults.headers.common["Authorization"] = data.token;
        setUser(data.user);
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-between flex-col items-center h-screen  w-full">
      <img
        src={assets.logo}
        alt=""
        onClick={() => navigate("/")}
        className="w-32 mt-6"
      />
      <div className="flex items-center justify-center h-screen w-full">
        <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full py-6 text-center">
              <h1 className="text-3xl font-bold">
                <span className="text-primary">User</span>{" "}
                {state === "register" ? "register" : "Login "}{" "}
              </h1>
              <p className="text-center text-sm mb-2 mt-2">
                {state === "register"
                  ? "Create your account"
                  : "Login to your account!"}
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              onClick={(e) => e.stopPropagation()}
              className=" w-full sm:max-w-md text-gray-600"
            >
              {state === "register" && (
                <div className="flex flex-col">
                  <label>Name</label>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    type="text"
                    required
                    placeholder="your fullname "
                    className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <label>Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  required
                  placeholder="your email id "
                  className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                />
              </div>
              <div className="flex flex-col">
                <label>Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  required
                  placeholder="your password "
                  className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all"
              >
                {state}
              </button>
            </form>
          </div>

          {/**bottom form text */}
          {state === "register" ? (
            <p className="text-gray-500 text-center text-xs mt-4">
              Already have an account{" "}
              <span
                onClick={() => setState("Login")}
                className="text-primary cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-500 text-center text-xs mt-4">
              Don't have an account{" "}
              <span
                onClick={() => setState("register")}
                className="text-primary cursor-pointer hover:underline"
              >
                register
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
