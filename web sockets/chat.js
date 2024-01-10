const Message = require("../models/message")
const jwt = require("jsonwebtoken")
const Employee = require("../models/employee")
const Sequelize = require("sequelize")
const ChatRoom = require("../models/chatRoom")

module.exports = function (app) {
  require("express-ws")(app)

  // Store WebSocket connections for each chat room
  const chatRooms = {}
  const auth = (ws, req, next) => {
    if (!req.query.xAuthToken) {
      return ws.close(4000, "No token provided.")
    }
    try {
      const token = req.query.xAuthToken
      const decoded = jwt.verify(token, "karan112010")
      req.user = decoded
      next()
    } catch (ex) {
      ws.close(4000, `${ex}`)
    }
  }

  app.ws("/chat/:chatRoom/", auth, async (ws, req) => {
    try {
      const user_id = req.query.user_id
      let chatRoom = await ChatRoom.findByPk(req.params.chatRoom)
      console.log(chatRoom)
      const employee = await Employee.findByPk(req.user.id)
      console.log("this is employee", employee)
      if (!chatRoom) {
        // Create a new ChatRoom and associate the current employee and channel
        chatRoom = await ChatRoom.create({
          employee_id: [85],
          channels: ["general"],
          type: "channel",
        })
      }
      console.log(chatRoom)

      if (!chatRoom.dataValues.employee_id.includes(employee.id)) {
        // Add the employee ID to the array using Sequelize.literal
        await ChatRoom.update(
          {
            employee_id: Sequelize.literal(
              `array_append(employee_id, '${employee.id}')`
            ),
          },
          {
            where: { id: chatRoom.id },
          }
        )
      }

      if (
        !chatRoom.dataValues.channels.includes(req.query.channel || "general")
      ) {
        await ChatRoom.update(
          {
            channels: Sequelize.literal(
              `array_append(channels, '${req.query.channel || "general"}')`
            ),
          },
          {
            where: { id: chatRoom.id },
          }
        )
      }

      if (!user_id) {
        return ws.close(4000, "Missing user_id")
      }

      // Check if the chat room exists, create a new one if it doesn't
      if (!chatRooms[chatRoom]) {
        chatRooms[chatRoom] = []
      }

      // Add the WebSocket connection to the chat room
      chatRooms[chatRoom].push(ws)

      // Update user's online status
      if (!employee.dataValues.chats.includes(req.params.chatRoom)) {
        await Employee.update(
          {
            isOnline: true,
            chats: Sequelize.fn(
              "array_append",
              Sequelize.col("chats"),
              req.query.user_id || req.user.id
            ),
          },
          {
            where: {
              id: req.query.user_id || req.user.id,
            },
          }
        )
      } else {
        await Employee.update(
          {
            isOnline: true,
          },
          {
            where: {
              id: req.query.user_id || req.user.id,
            },
          }
        )
      }

      // Get all messages for the current chat room
      const messages = await Message.findAll({
        where: {
          chatRoom_id: parseInt(chatRoom.id),
          channel: req.query.channel || "general",
        },
      })

      // Mark all messages as read
      await Message.update(
        { isRead: true },
        {
          where: {
            chatRoom_id: parseInt(chatRoom.id),
          },
        }
      )

      // Send all messages to the WebSocket connection and mark them as read
      for (const msg of messages) {
        ws.send(
          JSON.stringify({
            id: msg.id,
            message: msg.message,
            employee_id: msg.employee_id,
            isRead: true, // Mark as read
            channel: msg.channel,
          })
        )
      }

      // Handle incoming messages
      ws.on("message", async (msg) => {
        // Save the message to the database
        let m = {
          message: msg,
          isRead: false, // Initially set as unread
          chatRoom_id: chatRoom.id,
          employee_id: req.user.id,
          channel: req.query.channel || "general",
        }

        // Mark the message as read if other clients are online
        const otherClients = chatRooms[chatRoom].filter(
          (connection) => connection !== ws
        )

        if (otherClients.length > 0) {
          m.isRead = true
        }

        const current_msg = await Message.create(m)
        // Send the new message to all WebSocket connections in the chat room
        chatRooms[chatRoom].forEach((connection) => {
          connection.send(
            JSON.stringify({
              id: current_msg.id,
              message: msg,
              employee_id: req.query.user_id,
              isRead: m.isRead,
              channel: m.channel,
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
      console.log("this is ")
      ws.close(4000, ex.message)
    }
  })
}
