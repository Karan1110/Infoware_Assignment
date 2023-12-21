const Sequelize = require("sequelize");
const config = require("config");

module.exports = new Sequelize(config.get("dbURL"), {
    logging: false
<<<<<<< HEAD
});
=======
});
>>>>>>> 9403bcbb26062a45a5fea260b94d47eeeeb2aaa7
