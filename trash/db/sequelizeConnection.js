const { Sequelize } = require('sequelize');

// Create a new Sequelize instance with your MySQL credentials from environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
