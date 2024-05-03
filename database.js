const config = require('./utils/config')

const { Sequelize } = require('sequelize');

let sequelize
try {
  // sequelize = new Sequelize(
  //   'u598717880_ejemplo1', 
  //   'u598717880_ejemplo1', 
  //   'c7@T&LKMX', 
  //   {
  //     host: 'srv1123.hstgr.io',
  //     dialect: 'mysql'
  //   }
  // )
  sequelize = new Sequelize(
    config.DDBB_NAME,
    config.DDBB_USER,
    config.DDBB_PASSWORD,
    {
      host: config.DDBB_HOST,
      dialect: 'mysql'
    }
  )
} catch (error) {
  console.log('ERROR en la conexion de Base de Datos: ', error)
}


// sequelize.authenticate()
//   .then((msg => console.log('Conexion establecida')))
//   .catch((error) => console.log('ERROR de auth en BD: ', error))


module.exports = sequelize;