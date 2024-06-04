const { Sequelize } = require('sequelize');

const sequelize  = new Sequelize('testdb', 'testuser', 'testpassword', {
  host: '192.168.177.134',
  dialect: 'mariadb'
});

module.exports = sequelize ;

