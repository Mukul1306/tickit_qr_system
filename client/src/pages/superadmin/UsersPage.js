import { useEffect, useState } from "react";
import axios from "axios";

function UsersPage() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/super-admin/users",
        config
      );
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const suspendUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/super-admin/suspend-user/${id}`,
        {},
        config
      );
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const activateUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/super-admin/activate-user/${id}`,
        {},
        config
      );
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/super-admin/delete-user/${id}`,
        config
      );
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">All Users</h2>

      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">
                {u.isSuspended ? "Suspended" : "Active"}
              </td>

              <td className="p-3 space-x-2">
                {u.role !== "super_admin" && (
                  <>
                    {u.isSuspended ? (
                      <button
                        onClick={() => activateUser(u._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={() => suspendUser(u._id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Suspend
                      </button>
                    )}

                    <button
                      onClick={() => deleteUser(u._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;