import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      form
    );

    console.log(res.data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("name", res.data.name);
    localStorage.setItem("email", res.data.email);

    const role = res.data.role;

    if (role === "event_admin") {
      navigate("/admin/dashboard");
    } 
    else if (role === "super_admin") {
      navigate("/super-admin/dashboard");
    }
    else if (role === "volunteer") {
      navigate("/volunteer/dashboard");
    }
    else {
      navigate("/");
    }

  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Invalid credentials");
  }
};
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white">

      <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-3xl p-10 w-[380px]">

        <h2 className="text-3xl font-bold text-center text-blue-500 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 transition"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;
