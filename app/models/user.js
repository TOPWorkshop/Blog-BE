const { sequelize, Sequelize } = require('../libraries/db');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  email: {
    type: Sequelize.STRING,
  },

  password: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
