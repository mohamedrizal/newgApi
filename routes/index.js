const router = require('express').Router()
const authRoutes = require('./auth')
const categoryRoutes = require('./category')
const productRoutes = require('./product')
const cartRoutes = require('./cart')
const orderRoutes = require('./order')
const { auth, requireAdminRole } = require('../middleware/index')

router.use('/newg/', authRoutes)
router.use('/newg/category', [auth, requireAdminRole()], categoryRoutes)
router.use('/newg/product', [auth], productRoutes)
router.use('/newg/cart', [auth], cartRoutes)
router.use('/newg/order', [auth], orderRoutes)

module.exports = router