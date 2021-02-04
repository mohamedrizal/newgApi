const router = require('express').Router()
const productController = require('../controllers/productController')
const { imageUpload } = require('../middleware/fileUpload')
const { requireAdminRole } = require('../middleware/index')
const { validate } = require('../validator')
const { rules: ProductRule } = require('../validator/product/index')

router.post('/create',
  [
    imageUpload, requireAdminRole(),
    ProductRule, validate
  ], productController.createProduct)
router.get('/', productController.getProduct)
router.put('/update/:id', [imageUpload, requireAdminRole()], productController.updateProduct)
router.delete('/delete/:id', [requireAdminRole()], productController.deleteProduct)

module.exports = router