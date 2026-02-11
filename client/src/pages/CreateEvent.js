import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    price: "",
    imageUrl: "",
    upiId: "",
    totalSeats: 100,
    isPaid: true,
    customFields: []
  });

  const [field, setField] = useState({
    label: "",
    type: "text",
    required: false
  });

  // Add Custom Field
  const addField = () => {
    if (!field.label) return alert("Field label required");

    setForm({
      ...form,
      customFields: [...form.customFields, field]
    });

    setField({
      label: "",
      type: "text",
      required: false
    });
  };

  // Remove Custom Field
  const removeField = (index) => {
    const updated = [...form.customFields];
    updated.splice(index, 1);
    setForm({ ...form, customFields: updated });
  };

  const createEvent = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/events/create",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Event Created Successfully 🔥");
      navigate("/admin/dashboard");

    } catch (err) {
      console.log(err.response?.data);
      alert("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex justify-center items-center p-10">

      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 w-full max-w-2xl">

        <h2 className="text-3xl font-bold text-blue-500 mb-8 text-center">
          Create New Event
        </h2>

        <div className="space-y-5">

          {/* Basic Fields */}
          <input placeholder="Title"
            className="w-full p-3 rounded-xl border"
            onChange={e => setForm({...form, title: e.target.value})}
          />

          <textarea placeholder="Description"
            className="w-full p-3 rounded-xl border"
            onChange={e => setForm({...form, description: e.target.value})}
          />

          <input type="date"
            className="w-full p-3 rounded-xl border"
            onChange={e => setForm({...form, date: e.target.value})}
          />

          <input placeholder="Location"
            className="w-full p-3 rounded-xl border"
            onChange={e => setForm({...form, location: e.target.value})}
          />

          <input placeholder="Image URL"
            className="w-full p-3 rounded-xl border"
            onChange={e => setForm({...form, imageUrl: e.target.value})}
          />

          <select
            className="w-full p-3 rounded-xl border"
            onChange={e =>
              setForm({...form, isPaid: e.target.value === "paid"})
            }
          >
            <option value="paid">Paid Event</option>
            <option value="free">Free Event</option>
          </select>

          {form.isPaid && (
            <>
              <input placeholder="Price"
                className="w-full p-3 rounded-xl border"
                onChange={e => setForm({...form, price: e.target.value})}
              />

              <input placeholder="UPI ID"
                className="w-full p-3 rounded-xl border"
                onChange={e => setForm({...form, upiId: e.target.value})}
              />
            </>
          )}

          <input type="number" placeholder="Total Seats"
            className="w-full p-3 rounded-xl border"
            onChange={e => setForm({...form, totalSeats: e.target.value})}
          />

          {/* ========================= */}
          {/* 🔥 Custom Booking Fields */}
          {/* ========================= */}

          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              Booking Form Fields
            </h3>

            <input
              placeholder="Field Label (e.g. College ID)"
              className="w-full p-3 rounded-xl border mb-3"
              value={field.label}
              onChange={e => setField({...field, label: e.target.value})}
            />

            <select
              className="w-full p-3 rounded-xl border mb-3"
              value={field.type}
              onChange={e => setField({...field, type: e.target.value})}
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
            </select>

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => setField({...field, required: e.target.checked})}
              />
              Required
            </label>

            <button
              onClick={addField}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Add Field
            </button>

            {/* Show Added Fields */}
            <div className="mt-4">
              {form.customFields.map((f, index) => (
                <div key={index}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-lg mb-2">
                  <span>
                    {f.label} ({f.type}) {f.required && "*"}
                  </span>
                  <button
                    onClick={() => removeField(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Submit */}
          <button
            onClick={createEvent}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Create Event
          </button>

        </div>
      </div>
    </div>
  );
}

export default CreateEvent;