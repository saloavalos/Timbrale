import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*", // to allow any ip address on same network to connect to the server
    // origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`Someone has connected: ${socket.id}`);

  io.on("disconnect", () => {
    console.log(`--${socket.id} disconnected: `);
  });
});

io.listen(1010);
