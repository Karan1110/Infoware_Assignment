const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Performance = db.define(
  "Performance",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    status: Sequelize.STRING,
    points: {
      type: Sequelize.INTEGER,
      defaultValue : 0
    },
    classification: {
      type: Sequelize.VIRTUAL,
      get  (){
        const points = this.getDataValue('points')
        if (points > 60) {
          return "Below Average";
        } else if (points > 100) {
          return "Average";
        } else {
          return "Above Average";
        }
      },
    },
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["status", "points"],
      },
    ],
  }
);

Employee.belongsTo(Performance, {
  as: "Performance",
  foreignKey: "performance_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Performance;
