const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["super_admin", "event_admin", "volunteer", "user"],
    default: "user"
  },

    isSuspended: { type: Boolean, default: false },

},

{ timestamps: true });

module.exports = mongoose.model("User", userSchema);
