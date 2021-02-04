const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const router = require('./routes')
const config = require('./config/app')
const path = require('path')

app.use(cors())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(router)
app.use('/uploads/product', express.static(path.join(__dirname + '/uploads/product')))

const port = config.appPort
app.listen(port, () => {
  console.log(`server up on port ${port}`)
})