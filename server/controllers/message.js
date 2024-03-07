const express = require("express");
const Message = require("../models/message");
const routes = express.Router();
// const AWS = require("aws-sdk");
// AWS.config.update({region: "ap-south-1"});

routes.post("/send", async (req, res) => {
  console.log("/chat/send route ok", req.body);

  try {
    const {user, message} = req.body;
    const newMessage = new Message({user, message});
    await newMessage.save();
    res.status(201).json({message: "Message sent successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Server unable to send message to db"});
  }
});

module.exports = routes;
