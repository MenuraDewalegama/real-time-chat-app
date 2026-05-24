const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    from: String,
    to: String, // null = public chat
    text: String,
    time: Date
});

module.exports = mongoose.model("Message", MessageSchema);