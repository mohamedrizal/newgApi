const { body } = require('express-validator')

exports.rules = (() => {
  return [
    body('user_id').notEmpty().withMessage('harap isi')
  ]
})