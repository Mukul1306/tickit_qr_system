import { useState } from "react";
import axios from "axios";
import "./CreateAd.css";

function CreateAd() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    link: ""
  });

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ads/create",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Ad submitted successfully 🎉");
      console.log(res.data);

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error creating ad");
    }
  };

  return (
    <div className="create-ad-wrapper">
      <div className="create-ad-card">
        <h2>Create Advertisement</h2>

        <form onSubmit={handleSubmit}>  {/* 🔥 MUST BE FORM */}

          <input
            placeholder="Ad Title"
            onChange={(e) => setForm({...form, title: e.target.value})}
          />

          <textarea
            placeholder="Description"
            onChange={(e) => setForm({...form, description: e.target.value})}
          />

          <input
            placeholder="Image URL"
            onChange={(e) => setForm({...form, imageUrl: e.target.value})}
          />

          <input
  placeholder="Redirect URL"
  onChange={(e) => setForm({...form, redirectUrl: e.target.value})}
/>

          <button type="submit" className="create-ad-btn">
            Submit Ad
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateAd;