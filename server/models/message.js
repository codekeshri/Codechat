const mongoose = require("mongoose");

const Codechat = new mongoose.Schema(
  {
    message: String,
    user: String,
  },
  {timestamps: false}
);

const Message = mongoose.model("Message", Codechat);

module.exports = Message;
