const router = require('express').Router()
const orderController = require('../controllers/orderController')
const { requireAdminRole } = require('../middleware/index')

router.post('/create', orderController.createOrder)
router.get('/check/:uniqId', [requireAdminRole()], orderController.checkOrder)
router.put('/update/:id', [requireAdminRole()], orderController.update)
router.get('/all', [requireAdminRole()], orderController.getOrder)

module.exports = router