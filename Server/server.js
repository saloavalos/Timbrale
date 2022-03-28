import { Server } from "socket.io";
import users from "./users.js";

const io = new Server({
  cors: {
    origin: "*", // to allow any ip address on same network to connect to the server
    // origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`Someone has connected: ${socket.id}`);

  socket.on("Login", (username) => {
    if (username === "Max") {
      console.log("inicio exitoso");
    }
  });

  // If logged in successfully

  socket.on("disconnect", () => {
    console.log(`--${socket.id} left`);
  });
});

io.listen(1010);
