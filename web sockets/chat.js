const Message = require("../models/message")
const Employee = require("../models/employee")
const Sequelize = require("sequelize")
const ChatRoom = require("../models/chatRoom")
const auth = require("./utils/auth")
const createChat = require("./utils/createChat")
const addToChats = require("./utils/addToChats")
const addToChannels = require("./utils/addToChannels")
const sendMessage = require("./utils/sendMessage")

module.exports = function (app) {
  require("express-ws")(app)

  // Store WebSocket connections for each chat room
  const chatRooms = {}

  app.ws("/chat/:chatRoom/:channel", auth, async (ws, req) => {
    try {
      const user_id = req.query.user_id
      let chatRoom = await ChatRoom.findByPk(req.params.chatRoom)
      const employee = await Employee.findByPk(req.user.id)
      if (!chatRoom) {
        chatRoom = await ChatRoom.create({
          id: req.params.chatRoom,
          employee_id: [req.query.user_id],
          channels: [req.params.channel],
          type: req.query.type,
          name: req.query.name,
        })
      }
      // console.log(chatRoom.dataValues)
      if (
        !chatRoom.dataValues.employee_id.includes(
          employee.dataValues.id || employee.id || req.query.user_id
        )
      ) {
        addToChats(
          ChatRoom,
          employee.id || employee.dataValues.id,
          chatRoom.id || chatRoom.dataValues.id
        )
      }

      if (
        !chatRoom.dataValues.channels.includes(req.params.channel || "general")
      ) {
        addToChannels(ChatRoom, req.params.channel, chatRoom.id)
      }

      if (!user_id) {
        return ws.close(4000, "Missing user_id")
      }

      // Check if the chat room exists, create a new one if it doesn't
      const chatRoomKey = `${req.params.chatRoom}_${req.params.channel}`
      if (!chatRooms[chatRoomKey]) {
        chatRooms[chatRoomKey] = []
      }

      // Add the WebSocket connection to the chat room
      chatRooms[chatRoomKey].push(ws)

      // Update user's online status
      if (!employee.dataValues.chats.includes(req.params.chatRoom)) {
        await Employee.update(
          {
            isOnline: true,
            chats: Sequelize.fn(
              "array_append",
              Sequelize.col("chats"),
              chatRoom.dataValues.id.toString() || chatRoom.id.toString()
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

      await Message.update(
        { isRead: true },
        {
          where: {
            chatRoom_id: parseInt(chatRoom.id),
          },
        }
      )

      // Get all messages for the current chat room
      const messages = await Message.findAll({
        where: {
          chatRoom_id:
            chatRoom.id || chatRoom.dataValues.id || req.params.chatRoom,
          channel: req.params.channel || "general",
        },
      })

      // Mark all messages as read

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
          req.params.channel,
          Message,
          req.params.chatRoom,
          req,
          ws
        )
      })
      // Handle WebSocket connection closure
      ws.on("close", async () => {
        await Employee.update(
          {
            isOnline: false,
            last_seen: new Date(),
          },
          {
            where: {
              id: req.query.user_id || employee.dataValues.id || employee.id,
            },
          }
        )

        // Remove the WebSocket connection from the chat room
        const chatRoomKey = `${req.params.chatRoom}_${req.params.channel}`
        chatRooms[chatRoomKey] = chatRooms[chatRoomKey].filter(
          (connection) => connection !== ws
        )
      })
    } catch (ex) {
      console.log("ERROR!!!")
      console.log(ex)
      ws.close(4000, ex.message)
    }
  })
}
