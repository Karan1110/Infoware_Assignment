const winston = require("winston");
const { Op } = require("sequelize");
const Message = require("../models/message");
const Employee = require("../models/employee");

module.exports = function (app) {
  require("express-ws")(app);

  // Store WebSocket connections for each chat room
  const chatRooms = {};

  app.ws("/chat/:chatRoom/", async (ws, req) => {
    try {
      winston.info("WebSocket connection established");
      const user_id = req.query.user_id;
      const chatRoom = req.params.chatRoom;

      if (!user_id) {
        return ws.close(4000, "Missing user_id");
      }

      // Check if the chat room exists, create a new one if it doesn't
      if (!chatRooms[chatRoom]) {
        chatRooms[chatRoom] = [];
      }

      // Add the WebSocket connection to the chat room
      chatRooms[chatRoom].push(ws);

      // Event listener for message updates
      Message.addHook("afterUpdate", async (updatedMessage) => {
        const chatRoomId = updatedMessage.chatRoom_id;

        // Check if the updated message belongs to the desired chatRoom
        if (chatRoomId === parseInt(chatRoom)) {
          // Send the updated message to all WebSocket connections in the chat room
          chatRooms[chatRoom].forEach(connection => {
            connection.send(
              JSON.stringify({
                message: updatedMessage.message,
                employee_id: updatedMessage.employee_id,
                isRead: updatedMessage.isRead,
              })
            );
          });
        }
      });

      await Employee.update(
        {
          isOnline: true,
        },
        {
          where: {
            id: req.query.user_id,
          },
        }
      );

      console.log(req.query.employeeId);
      // Get all messages for the current chat room
      const messages = await Message.findAll({
        where: {
          chatRoom_id: parseInt(chatRoom),
        },
      });

      // Send all messages to the WebSocket connection
      for (const msg of messages) {
        ws.send(
          JSON.stringify({
            message: msg.message,
            employee_id: msg.employee_id,
            isRead: msg.isRead,
          })
        );
      }

      // Handle incoming messages
      ws.on("message", async (msg) => {
        // Save the message to the database
        const m = await Message.create({
          message: msg,
          isRead: false,
          chatRoom_id: chatRoom,
          employee_id: req.query.user_id,
        });

        // Send the new message to all WebSocket connections in the chat room
        chatRooms[chatRoom].forEach(connection => {
          connection.send(
            JSON.stringify({
              message: msg,
              employee_id: req.query.user_id,
              isRead: false
            })
          );
        });

        // Send a confirmation message to the sender
        ws.send(JSON.stringify({ message: msg, m }));
      });

      ws.on("close", async () => {
        await Employee.update(
          {
            isOnline: false,
            last_seen: new Date(),
          },
          {
            where: {
              id: req.query.user_id,
            },
          }
        );

        // Remove the WebSocket connection from the chat room
        chatRooms[chatRoom] = chatRooms[chatRoom].filter(connection => connection !== ws);
      });
    } catch (ex) {
      winston.info(ex);
      ws.close(4000, ex.message);
    }
  });
};
