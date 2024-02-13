const app = require('./app')                                // linea basica
const http = require('http')                                // linea basica
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, ()=>{                            // linea basica
  logger.info(`Server running on port: ${config.PORT}`)
})