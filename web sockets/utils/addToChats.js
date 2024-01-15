const Sequelize = require("sequelize")

module.exports = async (ChatRoom, employee_id, chatRoom_id) => {
  console.log(chatRoom_id)
  await ChatRoom.update(
    {
      employee_id: Sequelize.literal(
        `array_append(employee_id, '${employee_id}')`
      ),
    },
    {
      where: { id: chatRoom_id },
    }
  )
}
