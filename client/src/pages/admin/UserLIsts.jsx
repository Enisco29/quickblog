import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    action: null,
    userId: null,
    userName: "",
  });

  const { axios } = useAppContext();

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("/api/admin/users");
      if (data.success) {
        setTimeout(() => {
          setUsers(data.users);
          setLoading(false);
        }, 10);
      }
    } catch (error) {
      toast.error("Error fetching users:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminStatus = async (userId) => {
    try {
      const { data } = await axios.post("/api/admin/toggle-admin", { userId });
      if (data.success) {
        toast.success(data.message);
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      toast.error(
        "Error toggling admin status: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const deleteUser = async (userId) => {
    try {
      const { data } = await axios.post("/api/admin/delete", { userId });
      if (data.success) {
        toast.success(`${confirmModal.userName} deleted successfully`);
        fetchUsers();
      }
    } catch (error) {
      toast.error(
        "Error deleting user: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const openConfirmation = (action, userId, userName) => {
    setConfirmModal({
      show: true,
      action,
      userId,
      userName,
    });
  };

  const handleConfirm = () => {
    if (confirmModal.action === "delete") {
      deleteUser(confirmModal.userId);
    } else if (confirmModal.action === "toggleAdmin") {
      toggleAdminStatus(confirmModal.userId);
    }
    setConfirmModal({ show: false, action: null, userId: null, userName: "" });
  };

  return (
    <div className="min-h-screen bg-blue-50/50 p-4 md:p-8 w-full">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          User Management
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role === "admin" && "Admin"}
                          {user.role === "super-admin" && "Super-Admin"}
                          {user.role === "user" && "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  font-medium">
                        <button
                          onClick={() =>
                            openConfirmation("toggleAdmin", user._id, user.name)
                          }
                          className={`mr-3 ${
                            user.role === "admin"
                              ? "text-yellow-600 hover:text-yellow-900"
                              : "text-blue-600 hover:text-blue-900"
                          }`}
                        >
                          {user.role !== "super-admin" &&
                            (user.role === "admin"
                              ? "Remove Admin"
                              : "Make Admin")}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm  font-medium">
                        {user.role !== "super-admin" && (
                          <button
                            onClick={() =>
                              openConfirmation("delete", user._id, user.name)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {users.map((user) => (
                <div key={user._id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role === "admin" && "Admin"}
                      {user.role === "super-admin" && "Super-Admin"}
                      {user.role === "user" && "User"}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between">
                    <button
                      onClick={() =>
                        openConfirmation("toggleAdmin", user._id, user.name)
                      }
                      className={`text-sm ${
                        user.role === "admin"
                          ? "text-yellow-600 hover:text-yellow-900"
                          : "text-blue-600 hover:text-blue-900"
                      }`}
                    >
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>
                    <button
                      onClick={() =>
                        openConfirmation("delete", user._id, user.name)
                      }
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {confirmModal.action === "delete"
                ? `Delete ${confirmModal.userName}?`
                : `Change ${confirmModal.userName}'s role?`}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmModal.action === "delete"
                ? "Are you sure you want to delete this user? This action cannot be undone."
                : `Are you sure you want to ${
                    confirmModal.action === "toggleAdmin"
                      ? users.find((u) => u._id === confirmModal.userId)
                          ?.role === "admin"
                        ? "remove admin privileges from"
                        : "make"
                      : ""
                  } this user?`}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setConfirmModal({
                    show: false,
                    action: null,
                    userId: null,
                    userName: "",
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-blue-50/50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-md text-white ${
                  confirmModal.action === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
