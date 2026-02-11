import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    imageUrl: "",
    totalSeats: "",
    upiId: "",
    isPaid: true
  });

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/events/${id}`
      );

      setForm({
        title: res.data.title || "",
        description: res.data.description || "",
        date: res.data.date ? res.data.date.substring(0, 10) : "",
        location: res.data.location || "",
        price: res.data.price || "",
        imageUrl: res.data.imageUrl || "",
        totalSeats: res.data.totalSeats || "",
        upiId: res.data.upiId || "",
        isPaid: res.data.isPaid
      });

    } catch (error) {
      console.log(error);
      alert("Failed to load event");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5000/api/events/update/${id}`,  // 🔥 Correct URL
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Event updated successfully");
      navigate("/admin/dashboard");

    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex justify-center items-center p-10">

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-3xl">

        <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">
          ✏ Edit Event
        </h2>

        <form onSubmit={handleUpdate} className="space-y-5">

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 rounded-xl border"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-3 rounded-xl border"
          />

          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full p-3 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-3 rounded-xl border"
          />

          <input
            type="number"
            placeholder="Total Seats"
            value={form.totalSeats}
            onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
            className="w-full p-3 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full p-3 rounded-xl border"
          />

          <select
            value={form.isPaid}
            onChange={(e) => setForm({ ...form, isPaid: e.target.value === "true" })}
            className="w-full p-3 rounded-xl border"
          >
            <option value="true">Paid Event</option>
            <option value="false">Free Event</option>
          </select>

          {form.isPaid && (
            <>
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-3 rounded-xl border"
              />

              <input
                type="text"
                placeholder="UPI ID"
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                className="w-full p-3 rounded-xl border"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl"
          >
            Update Event
          </button>

        </form>

      </div>

    </div>
  );
}

export default AdminEditEvent;
