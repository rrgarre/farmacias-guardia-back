require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
if(process.env.NODE_ENV === "test"){
  console.log('estamos en modo test:..............')
  const MONGODB_URI = process.env.MONGODB_URI_TEST
}
const SECRET_FOR_JWT = process.env.SECRET_FOR_JWT

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET_FOR_JWT
}