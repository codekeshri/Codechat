const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const {Server} = require("socket.io");
const ACTIONS = require("./Actions");
const cors = require("cors");

const server = http.createServer(app);
const io = new Server(server);
const userSocketMap = {};

app.use(cors());

io.on("connection", (socket) => {
  console.log("socket started running");
  socket.on(ACTIONS.JOIN, (data) => {
    const {username, newIDE} = data;
    userSocketMap[socket.id] = username;

    socket.join(newIDE); // this new user joins code room

    const coders = getAllCoders(newIDE);

    coders.forEach(({socketId}) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        coders,
        username: username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({roomId, code}) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code}); // send all except creator
  });

  socket.on(ACTIONS.SYNC_CODE, ({socketId, code}) => {
    io.to(socketId).emit(ACTIONS.SYNC_CODE, {code}); // send all except creator
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((newIDE) => {
      socket.in(newIDE).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on("send-message", (data) => {
    console.log(data);
    io.emit("receive-message", (data) => {
      console.log("message recieved");
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});

function getAllCoders(newIDE) {
  return Array.from(io.sockets.adapter.rooms.get(newIDE) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}
