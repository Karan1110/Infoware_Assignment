const winston = require("winston");
const Message = require("../models/message");

// Create an object to store online users
const onlineUsers = {};

module.exports = function (app) {
  require("express-ws")(app);
  app.ws("/chat/:chatRoom/:employeeId*", async (ws, req) => {
    winston.info("WebSocket connection established");
    const username = req.query.username;

    if (!username) {
      return ws.close(4000, "Missing username");
    }

    await Employee.update({
      socket_id: ws.id
    });

    // Add the user to the online users object
    onlineUsers[username] = ws.id;

    // Get all messages for the current chat room
    const messages = await Message.findAll({
      where: {
        chatRoom: req.params.chatRoom,
        employee_id: [req.params.employee_id]
      },
    });

    if (!messages || messages.length === 0) {
      ws.send("Starting of the conversation");
    } else {
      // Send all messages to the WebSocket connection
      messages.forEach((msg) => {
        ws.send(JSON.stringify({
          message: msg.message,
          username: msg.username,
          isRead: msg.isRead,
        }));
      });
    }

    // Send the list of online users
    ws.send(JSON.stringify({
      onlineUsers: Object.keys(onlineUsers),
    }));

    // Handle incoming messages
    ws.on("message", async (msg) => {
      winston.info(`Received message: ${msg}`);

      // Save the message to the database
      const message = await Message.create({
        message: msg.message,
        username: msg.username,
        isRead: false,
      });

      // Send a confirmation message to the sender
      ws.send(JSON.stringify({ message: msg }));
    });

    ws.on("close", () => {
      winston.info("WebSocket connection closed");

      // Remove the user from the online users object
      delete onlineUsers[username];
    });
  });
};
