const winston = require("winston");
const Message = require("../models/message");

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
    // Get all messages for the current chat room
    const messages = await Message.findAll({
      where: {
        chatRoom: req.params.chatRoom,
        employee_id: [req.params.employee_id]
      },
    });


    if (!messages || messages.length === 0) return ws.send(`Starting of the conversation`)
  

    // Send all messages to the WebSocket connection
    messages.forEach((msg) => {
      ws.send(JSON.stringify({
        message: msg.message,
        username: msg.username,
        isRead: msg.isRead,
      }));
    });

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
      ws.send({ message: msg });
    });

    ws.on("close", () => {
      winston.info("WebSocket connection closed");

      // Remove the user from the online users object
      delete onlineUsers[msg.username];
    });

    // Handle the online event
    ws.on("online", () => {
      winston.info(`User ${ws.id} is online`);

      // Add the user to the online users object
      onlineUsers[ws.username] = ws.id;
    });

    // Handle the offline event
    ws.on("offline", () => {
      winston.info(`User ${ws.id} is offline`);

      // Remove the user from the online users object
      delete onlineUsers[ws.username];
    });
    // ws.username = req.query.username;
  });
}