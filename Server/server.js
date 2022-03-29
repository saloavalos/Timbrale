import { Server } from "socket.io";
import users from "./users.js";

const io = new Server({
  cors: {
    origin: "*", // to allow any ip address on same network to connect to the server
    // origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

// if (onlineUsers) socket.emit("onlineUserUpdated", onlineUsers);

const findUser = (username) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const getUserData = (username) => {
  return users.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  console.log("Users connected: " + io.of("/").sockets.size);
  console.log(`Someone has connected ip: ${socket.conn.remoteAddress}`);

  socket.on("LogIn", (username) => {
    if (getUserData(username)) {
      console.log("Login exitoso");
      socket.emit("loginResponse", {
        loginStatus: true,
        userData: getUserData(username),
      });
    } else {
      console.log("Usuario no encontrado");
      socket.emit("loginResponse", { loginStatus: false });
    }
  });

  // If logged in successfully

  socket.on("disconnect", () => {
    console.log(`--${socket.id} left`);
  });
});

io.listen(1010);
