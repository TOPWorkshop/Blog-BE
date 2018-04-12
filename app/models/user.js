const axios = require('axios');
const crypto = require('crypto');

const { sequelize, Sequelize } = require('../libraries/db');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },

  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: Sequelize.TEXT,
    get() {},
    set(rawPassword) {
      const salt = crypto.randomBytes(30).toString('hex');
      this.setDataValue('salt', salt);

      const password = this.hashPassword(rawPassword);
      this.setDataValue('password', password);
    },
  },

  salt: {
    type: Sequelize.STRING,
    get() {},
    set() {},
  },
}, {
  hooks: {
    async beforeCreate(user) {
      const { email } = user;

      await axios.get(`http://www.google.it?email=${email}`);
    },
  },
});

User.prototype.hashPassword = function hasPassword(password) {
  const salt = this.getDataValue('salt') || 'salt';

  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, 'sha512')
    .toString('hex');
};

User.prototype.validatePassword = function validatePassword(rawPassword) {
  const password = this.hashPassword(rawPassword);

  return password === this.getDataValue('password');
};

module.exports = User;
