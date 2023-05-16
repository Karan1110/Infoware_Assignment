const winston = require("winston");
const Message = require("../models/message");

module.exports = function (app) {
  const expressWs = require("express-ws")(app);

  app.ws("chat/:chatRoom/:userIDs*", async (ws, req) => {
    winston.info("WebSocket connection established");

    const messages = await Message.findAll({
      where: {
        employee_id: [req.params.userIDs],
      },
    });

    messages.forEach((message) => {
      const message = {
        message: message.message,
        username: name,
        read: message.read,
      };
      ws.send(message);
    });

    // Handle incoming messages
    ws.on("message", async (msg) => {
      winston.info(`Received message: ${msg}`);

      // Save the message to the database
      await Message.create({
        message: msg.message,
        read: false,
        username : msg.username
      });
      // Send a confirmation message to the sender
      ws.send({message : msg});
    });

    // Handle the "read" event
    ws.on("read", async (msgId) => {
      // Update the status of the message in the database
      await Message.update({
        where: {
          id: msgId
        }
      }, {
        read: true
      });
    });

    ws.on("close", () => {
      winston.info("WebSocket connection closed");
    });
  });
};
