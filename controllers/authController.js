const User = require('../models').User
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/app')

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.scope('withPassword').findOne({
      where: {
        email: email
      }
    })

    if (!user) {
      return res.status(404).json({
        message: "user not found or incorect email"
      })
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        message: 'incorect password'
      })
    }

    const userWithToken = generateToken(user.get({ raw: true }))
    return res.send(userWithToken)

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.register = async (req, res) => {
  try {
    const registrasion = req.body
    const data = await User.findOne({
      where: { email: registrasion.email }
    })
    if (data) {
      return res.status(400).json({
        message: 'email sudah pernah digunakan'
      })
    }
    const user = await User.create(registrasion)
    const userWithToken = generateToken(user.get({ raw: true }))
    return res.send(userWithToken)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

const generateToken = (user) => {
  delete user.password
  const token = jwt.sign(user, config.appKey, { expiresIn: 864000 })
  return { ...{ user }, ...{ token } }
}