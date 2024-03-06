const express = require("express");
const Message = require("../models/message");
const routes = express.Router();
const path = require("path");
const bodyParser = require("body-parser");
// const AWS = require("aws-sdk");
// AWS.config.update({region: "ap-south-1"});
require("dotenv").config();

routes.post("/send", async (req, res) => {
  try {
    const {username, newMessage} = req.body;
    const message = new Message({username, newMessage});
    await message.save();
    res.status(201).json({message: "Message sent successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Server unable to send message to db"});
  }
});

module.exports = routes;
