const { DataTypes } = require('sequelize')
const sequelize = require('../database')

// Define un modelo para una tabla de ejemplo
const Farmacia = sequelize.define(
  'Farmacia', 
  {
    ciudad: {
      type: DataTypes.STRING
    },
    fecha: {
      type: DataTypes.STRING
    },
    horarioDia: {
      type: DataTypes.STRING
    },
    listadoDia: {
      type: DataTypes.STRING
    },
    horarioNoche: {
      type: DataTypes.STRING
    },
    listadoNoche: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'farmacias-Lucena-14900',
  },
)

module.exports = Farmacia