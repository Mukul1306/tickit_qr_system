import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white">

      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-10 w-[400px]">

        <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* ROLE SELECTION */}
          <select
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="event_admin">Event Admin</option>
            <option value="volunteer">Volunteer</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition"
          >
            Register
          </button>

        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default Register;
