const { DataTypes } = require('sequelize');
const db = require('./database');

const Task = db.define('Task', {
  // Define the attributes of the Task model
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Title is required'
      },
      notEmpty: {
        msg: 'Title cannot be empty'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // You can add more attributes as needed
});

module.exports = Task;
