const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Todo;