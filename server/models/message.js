const mongoose = require("mongoose"); //table

const Codechat = new mongoose.Schema(
  {
    message: String,
    user: String,
  },
  {timestamps: false} //disables createdat and updatedat
);

const Message = mongoose.model("Message", Codechat);

module.exports = Message;
