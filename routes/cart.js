const router = require('express').Router()
const cartController = require('../controllers/cartController')

router.post('/add', cartController.createCart)
router.get('/', cartController.getCart)
router.put('/update', cartController.updateCartProduct)
router.delete('/delete', cartController.deleteItem)

module.exports = router