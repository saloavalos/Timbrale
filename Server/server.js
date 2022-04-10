import { Server } from "socket.io";
import users from "./users.js";

const io = new Server({
  cors: {
    origin: "*", // to allow any ip address on same network to connect to the server
    // origin: "http://localhost:3000",
  },
});

// It obviously works to know which users are online,
// but more importantly to know which user to send a certain message to,
// because here are their socketIds to be able to emit.to()
// ** Here I can store multiple sockets for the same user
// ** making posible multiple connections from the same account
let onlineUsers = [];

const addNewUserToOnlineUsers = (username, id) => {
  // If the user is not store in the array save it
  !onlineUsers.some((user) => user.username === username)
    ? onlineUsers.push({ username, socketID: [id] })
    : // If the user is already logged in on another device, we add its socketId
      onlineUsers.some((user) => {
        user.username === username && user.socketID.push(id);
      });
};

const removeUserFromOnlineUsers = (id) => {
  // If the user has has only one socket id we delete the user along with its socket id
  onlineUsers.some((user) => user.socketID.length === 1)
    ? (onlineUsers = onlineUsers.filter(
        (user) => !user.socketID.find((eachSocketId) => eachSocketId === id)
      ))
    : // If the user has mora than 1 socket id we just delete the indicated socket id
      onlineUsers.map((user) => {
        user.socketID = user.socketID.filter(
          (eachSocketId) => eachSocketId !== id
        );
        console.log("sockets-ids restantes : " + user.socketID);
      });
};

const getOnlineUserData = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

const getUserData = (username) => {
  return users.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  console.log(`Someone has connected ip: ${socket.conn.remoteAddress}`);

  socket.on("logIn", (username) => {
    if (getUserData(username)) {
      console.log("Login exitoso");
      console.log("Users connected: " + io.of("/").sockets.size);

      addNewUserToOnlineUsers(username, socket.id);
      // const receiver = getOnlineUserData(username);
      io.to(socket.id).emit("loginResponse", {
        loginStatus: true,
        userData: getUserData(username),
      });
      console.log(
        "Arreglo de usuarios en linea:" + JSON.stringify(onlineUsers)
      );
      // Notify all users how many users are online and pass their data
      io.emit("onlineUsers", onlineUsers);
    } else {
      console.log("Usuario no encontrado");
      io.to(socket.id).emit("loginResponse", {
        loginStatus: false,
      });
    }
  });

  socket.on("ringToUser", ({ sender, receiver, priority }) => {
    // Get Sockets id from the receiver
    const receiverSocketsId = [];
    onlineUsers.map((user) => {
      user.username === receiver &&
        user.socketID.filter((eachSocketId) =>
          receiverSocketsId.push(eachSocketId)
        );
    });

    console.log("sockets del receiver : " + receiverSocketsId);
    // notify to a range of socket ids with the same username of receiver because maybe the reciver has multiple sessions open
    receiverSocketsId?.map((eachSocketIdFromReceiver) => {
      // send notification to receiver
      io.to(eachSocketIdFromReceiver).emit("rinReceived", { sender, priority });
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socketd.id : ${socket.id} left`);
    removeUserFromOnlineUsers(socket.id);
    // Notify all users how many users are online and pass their data
    io.emit("onlineUsers", onlineUsers);
    console.log("Online users: " + JSON.stringify(onlineUsers));
  });
});

io.listen(1010);
