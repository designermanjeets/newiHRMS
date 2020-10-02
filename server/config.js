// require('dotenv').config()

const env = {
  "PORT": "5000",
  "MONGODB_URI_IHRMS": "mongodb://localhost:27017/newihrms",
  "JWT_SECRET": "mscreativepixelms",
  "secret": "mscreativepixelms",
  "JWT_LIFE_TIME": "1d",
  "WORKERS": "1"
}

const PORT = env.PORT
const MONGODB_URI = env.MONGODB_URI_IHRMS
const WORKERS = env.WORKERS
const JWT_LIFE_TIME = env.JWT_LIFE_TIME
const JWT_SECRET = env.JWT_SECRET
const secret = env.JWT_SECRET

module.exports = {
  PORT,
  MONGODB_URI,
  WORKERS,
  JWT_LIFE_TIME,
  JWT_SECRET,
  secret
}
