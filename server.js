const express = require("express");
const cors = require("cors");
const Room = require("./models/Room");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 9999;
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const modelsRouter = require("./routes/modelsRouter");
const studioRouter = require("./routes/studioRouter");
const roomsRouter = require("./routes/roomsRouter");
app.use("/rooms", roomsRouter);
app.use("/auth", authRouter);
app.use("/models", modelsRouter);
app.use("/studio", studioRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://Serhii:PureAngel1992@cluster0.o161e.mongodb.net/test-site?retryWrites=true&w=majority`
    );
    server.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();

io.on("connection", (socket) => {
  socket.on("ROOM:JOIN", async ({ roomId, userName }) => {
    socket.join(roomId);
    const dataRoom = await Room.findOne({ roomId });
    const isUserAlreadyInRoom = [...dataRoom.get("users").values()].some(
      (user) => user === userName
    );
    if (isUserAlreadyInRoom) {
      const usersInRoom = dataRoom.get("users").entries();
      for (const entry of usersInRoom) {
        if (entry.includes(userName)) {
          const userSocket = entry[0];
          dataRoom.get("users").delete(userSocket);
        }
      }
    }
    dataRoom.get("users").set(socket.id, userName);
    await dataRoom.save();
    const users = dataRoom.get("users");
    const messages = dataRoom.get("messages");
    io.in(roomId).emit("ROOM:SET_USERS", users);
    io.in(roomId).emit("ROOM:SET_MESSAGES", messages);
  });

  socket.on("ROOM:LEAVE", async ({ roomId, userName }) => {
    const dataRoom = await Room.findOne({ roomId });
    dataRoom.get("users").delete(socket.id, userName);
    await dataRoom.save();
    const users = dataRoom.get("users");
    io.in(roomId).emit("ROOM:SET_USERS", users);
  });

  socket.on("ROOM:NEW_MESSAGE", async ({ userName, text, roomId }) => {
    const obj = { userName, text };
    const dataRoom = await Room.findOne({ roomId });
    if (dataRoom.get("messages").length > 50) {
      dataRoom.get("messages").shift();
    }
    dataRoom.get("messages").push(obj);
    await dataRoom.save();
    const messages = dataRoom.get("messages");
    io.in(roomId).emit("ROOM:SET_MESSAGES", messages);
  });

  socket.on("disconnecting", async () => {
    const dataRooms = await Room.find();
    dataRooms.forEach(async (room) => {
      if (room.get("users").has(socket.id)) {
        room.get("users").delete(socket.id);
        await room.save();
        const users = room.get("users");
        io.in(room.roomId).emit("ROOM:SET_USERS", users);
      }
    });
  });
});


    // const connectMessage = {
    //   userName: "system message",
    //   text: `${userName} joined the chat`,
    // };
    // dataRoom.get("messages").push(connectMessage);