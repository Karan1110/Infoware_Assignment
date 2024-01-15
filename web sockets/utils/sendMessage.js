module.exports = async (
  chatRooms,
  msg,
  channel,
  Message,
  chatRoom,
  req,
  ws
) => {
  // Save the message to the database
  let m = {
    message: msg,
    isRead: false, // Initially set as unread
    chatRoom_id: chatRoom.id,
    employee_id: req.user.id,
    channel: channel || "general",
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
        employee_id: req.query.user_id || req.user.id,
        isRead: m.isRead,
        channel: m.channel,
      })
    )
  })
  console.log(otherClients)
}
