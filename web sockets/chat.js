const Message = require("../models/message")
const Employee = require("../models/employee")
const Sequelize = require("sequelize")
const ChatRoom = require("../models/chatRoom")
const auth = require("./utils/auth")
const createChat = require("./utils/createChat")
const addToChats = require("./utils/addToChats")
const addToChannels = require("./utils/addToChannels")
const sendMessage = require("./utils/sendMessage")
const onClose = require("./utils/onClose")

module.exports = function (app) {
  require("express-ws")(app)

  // Store WebSocket connections for each chat room
  const chatRooms = {}

  app.ws("/chat/:chatRoom/", auth, async (ws, req) => {
    try {
      const user_id = req.query.user_id
      let chatRoom = await ChatRoom.findByPk(req.params.chatRoom)
      const employee = await Employee.findByPk(req.user.id)
      if (!chatRoom) {
        chatRoom = await ChatRoom.create({
          employee_id: [req.query.user_id],
          channels: [req.query.channel],
          type: req.query.type,
        })
      }

      if (!chatRoom.dataValues.employee_id.includes(employee.id)) {
        addToChats(ChatRoom, employee.id, chatRoom.id)
      }

      if (
        !chatRoom.dataValues.channels.includes(req.query.channel || "general")
      ) {
        addToChannels(ChatRoom, req.query.channel, chatRoom.id)
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
        sendMessage(
          chatRooms,
          msg,
          req.query.channel,
          Message,
          chatRoom,
          req,
          ws
        )
      })
      // Handle WebSocket connection closure
      ws.on("close", async () => {
        onClose(Employee, req.user.id, chatRooms, chatRoom)
      })
    } catch (ex) {
      console.error(ex)
      ws.close(4000, ex.message)
    }
  })
}
