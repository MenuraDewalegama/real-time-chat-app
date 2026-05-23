const mongoose = require("mongoose");

// ✅ FIX 3: unique index prevents duplicate usernames even under concurrent load
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema);
