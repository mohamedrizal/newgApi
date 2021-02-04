const jwt = require('jsonwebtoken')
const config = require('../config/app')
const User = require('../models').User

exports.auth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      error: 'unauthorization user'
    })
  }

  jwt.verify(token, config.appKey, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: err
      })
    }
    req.user = user
  })
  next()
}

exports.requireAdminRole = () => {
  return function (req, res, next) {
    User.findByPk(req.user.id).then(user => {
      if (user && user.role === 'admin') {
        next()
      } else {
        return res.status(403).json({
          message: "acces forbidden"
        })
      }
    })
  }
}