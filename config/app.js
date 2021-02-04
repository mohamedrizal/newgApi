require('dotenv').config()

module.exports = {
  appUrl: process.env.APP_URL,
  appPort: process.env.APP_PORT,
  appKey: process.env.APP_KEY,
  appEmail: process.env.EMAIL,
  appEmailPass: process.env.EMAIL_PASSWORD
}