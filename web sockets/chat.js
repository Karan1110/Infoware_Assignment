const Message = require("../models/Message");

module.exports = function (app) {
  const expressWs = require("express-ws")(app);
  
  app.ws("chat/:chatRoom/:userIDs*", async (ws, req) => {
    winston.info("WebSocket connection established");
    const messages = await Message.findAll({
      where: {
        employee_id: [req.params.userIDs]
      }
    });
    messages.forEach((message) => {
      ws.send(`Message: ${message.message}, Read: ${message.read}`);
    });

    // Handle incoming messages
    ws.on("message", async (msg) => {
      winston.info(`Received message: ${msg}`);

      // Save the message to the database
      await Message.create({
        message: message,
        read: false
      });
      // Send a confirmation message to the sender
      ws.send(`${req.name} : ${msg}`);
    });

    // Handle the "read" event
    ws.on("read", async (msgId) => {
      // Update the status of the message in the database
      await Message.update({
        where: {
          id : msgId
        },
        data: {
          read : true
        }
      })
    });

    ws.on("close", () => {
      winston.info("WebSocket connection closed");
    });

  });
};