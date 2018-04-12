const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', '..', 'blog.db'),
});

async function sync(options) {
  const modelFolder = path.join(__dirname, '..', 'models');

  fs
    .readdirSync(modelFolder)
    .filter(filename => filename.substr(-3) === '.js')
    .forEach((filename) => {
      const modelPath = path.join(modelFolder, filename);

      require(modelPath);
    });

  return sequelize.sync(options);
}

module.exports = { sequelize, Sequelize, sync };
