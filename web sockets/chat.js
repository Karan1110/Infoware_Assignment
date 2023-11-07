const winston = require("winston")
const Message = require("../models/message")
const Employee = require("../models/employee")

module.exports = function (app) {
  require("express-ws")(app)

  // Store WebSocket connections for each chat room
  const chatRooms = {}

  app.ws("/chat/:chatRoom/", async (ws, req) => {
    try {
      // Log WebSocket connection establishment
      winston.info("WebSocket connection established")

      const user_id = req.query.user_id
      const chatRoom = req.params.chatRoom

      if (!user_id) {
        return ws.close(4000, "Missing user_id")
      }

      // Check if the chat room exists, create a new one if it doesn't
      if (!chatRooms[chatRoom]) {
        chatRooms[chatRoom] = []
      }

      // Add the WebSocket connection to the chat room
      chatRooms[chatRoom].push(ws)

      // Event listener for message updates
      Message.addHook("afterUpdate", async (updatedMessage) => {
        const chatRoomId = updatedMessage.chatRoom_id

        // Check if the updated message belongs to the desired chatRoom
        if (chatRoomId === parseInt(chatRoom)) {
          // Send the updated message to all WebSocket connections in the chat room
          chatRooms[chatRoom].forEach((connection) => {
            connection.send(
              JSON.stringify({
                message: updatedMessage.message,
                employee_id: updatedMessage.employee_id,
                isRead: updatedMessage.isRead,
              })
            )
          })
        }
      })

      // Update user's online status
      await Employee.update(
        {
          isOnline: true,
        },
        {
          where: {
            id: req.query.user_id,
          },
        }
      )

      // Get all messages for the current chat room
      const messages = await Message.findAll({
        where: {
          chatRoom_id: parseInt(chatRoom),
        },
      })

      // Mark all messages as read
      await Message.update(
        { isRead: true },
        {
          where: {
            chatRoom_id: parseInt(chatRoom),
          },
        }
      )

      // Send all messages to the WebSocket connection and mark them as read
      for (const msg of messages) {
        ws.send(
          JSON.stringify({
            message: msg.message,
            employee_id: msg.employee_id,
            isRead: true, // Mark as read
          })
        )
      }

      // Handle incoming messages
      ws.on("message", async (msg) => {
        // Save the message to the database
        let m = {
          message: msg,
          isRead: false, // Initially set as unread
          chatRoom_id: chatRoom,
          employee_id: req.query.user_id,
        }

        // Mark the message as read if other clients are online
        const otherClients = chatRooms[chatRoom].filter(
          (connection) => connection !== ws
        )

        if (otherClients.length > 0) {
          // If other clients are online, mark the message as read
          m.isRead = true
          await Message.create(m)
        }

        // Send the new message to all WebSocket connections in the chat room
        chatRooms[chatRoom].forEach((connection) => {
          connection.send(
            JSON.stringify({
              message: msg,
              employee_id: req.query.user_id,
              isRead: m.isRead,
            })
          )
        })
        console.log(otherClients)
      })

      // Handle WebSocket connection closure
      ws.on("close", async () => {
        // Update user's online status and last seen timestamp
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
        )

        // Remove the WebSocket connection from the chat room
        chatRooms[chatRoom] = chatRooms[chatRoom].filter(
          (connection) => connection !== ws
        )
      })
    } catch (ex) {
      // Handle exceptions and close the WebSocket with an error message
      console.error(ex)
      ws.close(4000, ex.message)
    }
  })
}
