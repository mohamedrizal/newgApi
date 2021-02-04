const { body } = require('express-validator')

exports.rules = (() => {
  return [
    body('fullName').notEmpty().withMessage('harap isi dengan benar'),
    body('email').notEmpty().isEmail().withMessage('harap isi dengan benar'),
    body('password').isLength({ min: 6 }).withMessage('password minimal 6 karakter'),
  ]
})()