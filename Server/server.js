import { Server } from "socket.io";
import users from "./users.js";

const io = new Server({
  cors: {
    origin: ["http://192.168.100.150:1414", "http://localhost:1414"], // allowed ip address of client to connect to the server
  },
});

// It obviously works to know which users are online,
// but more importantly to know which user to send a certain message to,
// because here are their socketIds to be able to emit.to()
// ** Here I can store multiple sockets for the same user
// ** making possible multiple connections from the same account
let onlineUsers = [];

let ringToEveryoneSeenBy = [];

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
  // If the user has only one socket id we delete the user along with its socket id
  onlineUsers.some((user) => user.socketID.length === 1)
    ? (onlineUsers = onlineUsers.filter(
        (user) => !user.socketID.find((eachSocketId) => eachSocketId === id)
      ))
    : // If the user has more than 1 socket id we just delete the indicated socket id
      // this is useful when the user closes one opened session
      onlineUsers.map((user) => {
        user.socketID = user.socketID.filter(
          (eachSocketId) => eachSocketId !== id
        );
        console.log("sockets-ids left : " + user.socketID);
      });
};

const addNewUserToSeenBy = (username) => {
  const ids = [];
  // we get the ids from onlineUsers
  onlineUsers.some((user) => {
    user.username === username &&
      user.socketID.map((eachID) => {
        ids.push(eachID);
      });
  });

  // If the user is not store in the array save it
  !ringToEveryoneSeenBy.some((user) => user.username === username) &&
    ringToEveryoneSeenBy.push({ username, socketID: ids });
};

const removeUserFromSeenBy = (id) => {
  // If the user has only one socket id we delete the username
  ringToEveryoneSeenBy.some((user) => user.socketID.length === 1)
    ? (ringToEveryoneSeenBy = ringToEveryoneSeenBy.filter(
        (user) => !user.socketID.find((eachSocketId) => eachSocketId === id)
      ))
    : // If the user has more than 1 socket id we just delete the indicated socket id
      // this is useful when the user closes one opened session
      ringToEveryoneSeenBy.map((user) => {
        user.socketID = user.socketID.filter(
          (eachSocketId) => eachSocketId !== id
        );
      });
};

const getUserData = (username) => {
  return users.find((user) => user.username === username);
};

const getSenderSocketsId = (sender) => {
  // notify to a range of socket ids
  return onlineUsers.find((user) => {
    user.username === sender && user.socketID;
  });
};

io.on("connection", (socket) => {
  console.log(`Someone has connected ip: ${socket.conn.remoteAddress}`);

  socket.on("logIn", (username) => {
    if (getUserData(username)) {
      console.log("Login successful");
      console.log("Users connected: " + io.of("/").sockets.size);

      addNewUserToOnlineUsers(username, socket.id);
      const dataFromUser = getUserData(username);
      io.to(socket.id).emit("loginResponse", {
        loginStatus: true,
        userData: dataFromUser,
      });
      console.log("Array of online users:" + JSON.stringify(onlineUsers));
      // Notify all users how many users are online and pass their data
      io.emit("updateOnlineUsers", onlineUsers);
    } else {
      console.log("User not found");
      io.to(socket.id).emit("loginResponse", {
        loginStatus: false,
      });
    }
  });

  socket.on("ringAllUsers", ({ sender }) => {
    // tell to sender (all sessions) he is sending a ringing
    io.emit("ringReceived", {
      sender,
    });
  });

  // Notify to an user he is receiving a ringing
  socket.on("ringToUser", ({ sender, receiver, priority }) => {
    // Get Sockets id from the receiver
    const receiverSocketsId = [];
    onlineUsers.map((user) => {
      user.username === receiver &&
        user.socketID.filter((eachSocketId) =>
          receiverSocketsId.push(eachSocketId)
        );
    });

    console.log(
      "----sockets from receiver who is getting a ringing popup : " +
        receiverSocketsId
    );
    // notify to a range of socket ids with the same username of receiver because maybe the receiver has multiple sessions open
    receiverSocketsId?.map((eachSocketIdFromReceiver) => {
      // send notification to receiver
      io.to(eachSocketIdFromReceiver).emit("ringReceived", {
        sender,
        priority,
      });
    });

    const senderSocketsId = [];
    onlineUsers.map((user) => {
      user.username === sender &&
        user.socketID.filter(
          (eachSocketId) =>
            eachSocketId !== socket.id && senderSocketsId.push(eachSocketId)
        );
    });

    // Get username of all online users
    const receiversUsername = [];
    onlineUsers.map((user) => {
      user.username !== sender && receiversUsername.push(user.username);
    });

    // tell the sender in all his sessions he is sending a ringing
    senderSocketsId.map((eachSocketIdFromReceiver) => {
      console.log("each sender--------- " + eachSocketIdFromReceiver);
      io.to(eachSocketIdFromReceiver).emit("sendingRinging", {
        ringingTo: receiversUsername,
      });
    });
  });

  socket.on("ringingSeen", ({ sender, receiver, priority }) => {
    console.log(
      "ring from - " +
        sender +
        " - seen by: " +
        socket.id +
        " alias: " +
        receiver
    );

    // Get Sockets id from the sender/receiver
    const senderAndReceiverSocketsId = [];
    onlineUsers.map((user) => {
      if (user.username === sender || user.username === receiver) {
        user.socketID.filter((eachSocketId) =>
          senderAndReceiverSocketsId.push(eachSocketId)
        );
      }
    });

    // If it's a ring to everyone
    if (!priority) {
      console.log("Someone saw the ring that is for everyone");
      addNewUserToSeenBy(receiver);
      // Notify sender/receiver how many users saw the ring
      io.emit("updateRingToEveryoneSeenBy", ringToEveryoneSeenBy);
      console.log(
        "Users who have seen the ring to everyone: " +
          JSON.stringify(ringToEveryoneSeenBy)
      );
    } else {
      // notify to a range of socket ids with the same username of sender/receiver because maybe the sender/receiver have multiple sessions open
      senderAndReceiverSocketsId?.map((eachSocketId) => {
        // Notify sender/receiver that ring was seen
        io.to(eachSocketId).emit("ringSeen", receiver);
      });
    }
  });

  socket.on("cancelRinging", ({ sender, receiver }) => {
    console.log("Ring from - " + sender + " - canceled");

    // Get Sockets id from the sender/receiver
    const senderAndReceiverSocketsId = [];
    onlineUsers.map((user) => {
      if (user.username === sender || user.username === receiver) {
        user.socketID.filter((eachSocketId) =>
          senderAndReceiverSocketsId.push(eachSocketId)
        );
      }
    });

    // notify to a range of socket ids with the same username of sender/receiver because maybe the sender/receiver have multiple sessions open
    senderAndReceiverSocketsId?.map((eachSocketId) => {
      // Notify sender/receiver that ring was seen
      io.to(eachSocketId).emit("ringCanceled", receiver);
    });
  });

  socket.on("cancelRingToEveryone", () => {
    // Notify everyone the ring was canceled
    io.emit("ringCanceled");
    // Clear array
    ringToEveryoneSeenBy = [];
  });

  socket.on("logoutAllSessions", ({ username }) => {
    console.log("Closing all opened sessions of: " + username);
    // Get Sockets id from the user
    const userSocketsId = [];
    onlineUsers.map((user) => {
      if (user.username === username) {
        user.socketID.filter((eachSocketId) =>
          userSocketsId.push(eachSocketId)
        );
      }
    });

    // notify to a range of socket ids with the same username of sender/receiver because maybe the sender/receiver have multiple sessions open
    userSocketsId?.map((eachSocketId) => {
      // Notify sender/receiver that ring was seen
      io.to(eachSocketId).emit("loggedOutFromAllSessions");
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket.id : ${socket.id} left`);
    removeUserFromOnlineUsers(socket.id);
    // Notify all users how many users are online and pass their data
    io.emit("updateOnlineUsers", onlineUsers);
    console.log("Online users: " + JSON.stringify(onlineUsers));
    removeUserFromSeenBy(socket.id);
    // Notify sender/receiver how many users saw the ring
    io.emit("updateRingToEveryoneSeenBy", ringToEveryoneSeenBy);
    console.log(
      "Users who have seen the ring to everyone: " +
        JSON.stringify(ringToEveryoneSeenBy)
    );
  });
});

io.listen(1010);
