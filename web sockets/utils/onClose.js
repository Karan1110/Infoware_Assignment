module.exports = async (Employee, user_id, chatRooms, chatRoom, ws) => {
  // Update user's online status and last seen timestamp
  await Employee.update(
    {
      isOnline: false,
      last_seen: new Date(),
    },
    {
      where: {
        id: user_id,
      },
    }
  )

  // Remove the WebSocket connection from the chat room
  chatRooms[chatRoom] = chatRooms[chatRoom].filter(
    (connection) => connection !== ws
  )
}
