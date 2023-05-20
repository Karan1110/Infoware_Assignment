const Sequelize = require("sequelize");
const db = require("../startup/db");
const Employee = require("./employee");

const Performance = db.define("Performance",
  {
    status: Sequelize.STRING,
    points: Sequelize.INTEGER,
    classification: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: Sequelize.literal(`
        CASE
          WHEN points > 80 THEN 'Above Average'
          WHEN points > 60 THEN 'Average'
          ELSE 'Below Average'
        END
      `)
    }
  },
  {
    indexes: [
      {
        unique: false,
        fields: ["status", "classification"],
      },
    ],
  }
);

const winston = require("winston");

Performance.hasMany(Employee, {
  as: "Employee",
  foreignKey: "performance_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Employee.belongsTo(Performance, {
  as: "Performance",
  foreignKey: "performance_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = Performance;