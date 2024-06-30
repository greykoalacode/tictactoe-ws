const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { history, currentMove, handlePlay } = require("./board");

const app = express();
const server = createServer(app);
const io = new Server({
  ...server,
  cors: {
    origin: "http://localhost:3000",
  },
});

let userCount = 0;

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

io.on("connection", (socket) => {
  const users = io.of("/").sockets.size;
  if (users > 2) {
    socket.emit("play", "No players found");
    socket.disconnect(true);
  } else {
    socket.emit("play", `Welcome Player: ${userCount}`);
    socket.emit("move", JSON.stringify(history), currentMove);
    socket.on("registerMove", (squares) => {
        console.log(squares)
      handlePlay(squares);
      socket.emit("move", JSON.stringify(history), currentMove);
    });
    console.log("user connected");
  }
});

let result;

io.emit("result", result);

io.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
