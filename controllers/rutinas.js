const rutinasRouter = require('express').Router()
const puppeteer = require('puppeteer')
const farmacias = require('../utils/farmacias').farmacias_lucena
const { Sequelize, DataTypes } = require('sequelize')
const Farmacia = require('../models/farmacia')

rutinasRouter.get('/', async (request, response) => {

  try {

    // Sincroniza el modelo con la base de datos
    await Farmacia.sync({ force: true }) // Utiliza { force: true } solo en desarrollo para re-crear la tabla

    // Crea un usuario de ejemplo
    await Farmacia.create({ name: 'Rafa Dev2', email: 'rrgarre@gsd.vom' })

    // Consulta todos los usuarios
    const users = await Farmacia.findAll()
    console.log('Usuarios encontrados:', JSON.stringify(users, null, 2))
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error)
  } finally {
    // Cierra la conexión al finalizar
    // await sequelize.close()
  }

  return response.send('Hola desde Router de Rutinas')
})

module.exports = rutinasRouter