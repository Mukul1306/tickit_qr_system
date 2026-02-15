import { useState } from "react";
import axios from "axios";

function HelpPage() {

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/help/create",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Request sent successfully ✅");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });

    } catch (err) {
      alert("Failed to send request");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-10">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-xl">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Contact Support
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Your Name"
            value={form.name}
            onChange={(e)=>setForm({...form, name:e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e)=>setForm({...form, email:e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e)=>setForm({...form, phone:e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            placeholder="Subject"
            value={form.subject}
            onChange={(e)=>setForm({...form, subject:e.target.value})}
            className="w-full p-3 border rounded-lg"
            required
          />

          <textarea
            placeholder="Describe your issue..."
            value={form.message}
            onChange={(e)=>setForm({...form, message:e.target.value})}
            className="w-full p-3 border rounded-lg"
            rows="4"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
          >
            Submit Request
          </button>

        </form>

      </div>
    </div>
  );
}

export default HelpPage;
