const { body } = require('express-validator')

exports.rules = (() => {
  return [
    body('categoryName').isLength({ min: 5 }).withMessage('harap isi')
  ]
})()