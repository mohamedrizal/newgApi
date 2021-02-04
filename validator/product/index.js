const { body } = require('express-validator')

exports.rules = (() => {
  return [
    body('productName').isLength({ min: 5 }).withMessage('harap isi dengan benar'),
    body('price').notEmpty().withMessage('harap isi'),
    body('category_id').notEmpty().withMessage('harap isi'),
  ]
})()