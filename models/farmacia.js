const { DataTypes } = require('sequelize')
const sequelize = require('../database')

// Define un modelo para una tabla de ejemplo
const Farmacia = sequelize.define(
  'Farmacia', 
  {
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'farmacias',
  },
)

module.exports = Farmacia