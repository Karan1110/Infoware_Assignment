const winston = require("winston");
const Message = require("../models/message");
const ChatRoom = require("../models/chatRoom");
const Member = require("../models/member");

module.exports = function (app) {
  require("express-ws")(app);

  app.ws("/chat/:chatRoom/:employeeId*", async (ws, req) => {
    winston.info("WebSocket connection established");
    const user_id = req.query.user_id;

    if (!user_id) {
      return ws.close(4000, "Missing user_id");
    }

    await Employee.update(
      {
        socket_id: ws.id,
      },
      {
        where: {
          id: req.params.employeeId,
        },
      }
    );

    // Get all messages for the current chat room
    const messages = await Message.findAll({
      where: {
        chatRoom_id: req.params.chatRoom,
        employee_id: req.params.employeeId,
      },
    });

    if (!messages || messages.length === 0) {
      let chatRoom = await ChatRoom.findOne({
        where: { id: req.params.chatRoom },
      });

      if (!chatRoom) {
        chatRoom = await ChatRoom.create({
          id: req.params.chatRoom,
        });

        const employeeIds = req.params.employeeId.split(",");
        for (const id of employeeIds) {
          await Member.create({
            chatRoom_id: req.params.chatRoom,
            employee_id: id,
          });
        }

        let Members = chatRoom.members;
        ws.send(JSON.stringify({ Members: Members }));
      }
      ws.send("Starting of the conversation");
    } else {
      // Send all messages to the WebSocket connection
      for (const msg of messages) {
        ws.send(
          JSON.stringify({
            message: msg.message,
            username: msg.username,
            isRead: msg.isRead,
          })
        );

        const chatRoom = await ChatRoom.findOne({ where: { id: msg.chatRoom_id } });
        const Members = chatRoom.members;
        ws.send(JSON.stringify(Members));
      }
    }

    // Handle incoming messages
    ws.on("message", async (msg) => {
      winston.info(`Received message: ${msg}`);

      // Save the message to the database
      await Message.create({
        message: msg.message,
        isRead: false,
        chatRoom_id: req.params.chatRoom,
        employee_id: req.params.employeeId,
      });

      // Send a confirmation message to the sender
      ws.send(JSON.stringify({ message: msg }));
    });

    ws.on("online", async () => {
      await Member.update(
        {
          isOnline: true,
        },
        {
          where: {
            employee_id: user_id,
            chatRoom_id: req.params.chatRoom,
          },
        }
      );
    });

    ws.on("offline", async () => {
      await Member.update(
        {
          isOnline: false,
          last_seen: new Date(),
        },
        {
          where: {
            employee_id: user_id,
            chatRoom_id: req.params.chatRoom,
          },
        }
      );
    });
  });
};