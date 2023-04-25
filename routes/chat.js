const express = require("express");
const app = express();
const expressWs = require("express-ws")(app);

app.ws("/chat/:chatRoom/:userIDs*", async (ws, req) => {
  winston.info("WebSocket connection established");

  // Retrieve all messages from the database
  const {messages} = await req.db.query(`
    SELECT * FROM Messages WHERE chatRoom = ${req.params.chatRoom}
  `);

  // Send all messages to the client
  messages.forEach((message) => {
    ws.send(`Message: ${message.message}, Read: ${message.read}`);
  });

  // Handle incoming messages
  ws.on("message", async (msg) => {
    winston.info(`Received message: ${msg}`);

    // Save the message to the database
    await req.db.query(`
      INSERT INTO Messages(message,read)
      VALUES($1,$2)
    `, [msg,false]);

    // Send a confirmation message to the sender
    ws.send(`You said: ${msg}`);
  });

  // Handle the "read" event
  ws.on("read", async (msgId) => {
    // Update the status of the message in the database
    await req.db.query(`
      UPDATE messages
      SET read = true
      WHERE id = $1
    `, [msgId]);
  });

  ws.on("close", () => {
    winston.info("WebSocket connection closed");
  });
});
