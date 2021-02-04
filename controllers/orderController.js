const models = require('../models')
const Order = models.Order
const Product = models.Product
const User = models.User
const OrderProduct = models.OrderProduct
const cartRepository = require('../repository/carts')
const orderRepository = require('../repository/order')
const crypto = require('crypto')
const emailController = require('./email')

exports.getOrder = async (req, res) => {
  const currentPage = req.query.page || 1
  const perPage = 5

  const skip = (parseInt(currentPage) - 1) * parseInt(perPage)
  const limit = (parseInt(perPage))
  try {
    const order = await Order.findAndCountAll({
      include: [
        {
          model: User
        },
        {
          model: OrderProduct,
          include: [{ model: Product, }]
        }
      ],
      offset: skip,
      limit: limit,
      order: [['createdAt', 'DESC']]
    })

    if (!order) {
      return res.status(404).json({
        message: 'data order kosong'
      })
    }

    return res.status(200).json({
      message: 'data berhasil dipanggil',
      data: order
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.createOrder = async (req, res) => {
  try {
    const { cart_id } = req.body
    const user_id = req.user.id
    const email = req.user.email
    const uniqId = crypto.randomBytes(20).toString('hex')
    let productId = ''
    let qty = ''
    let total = ''
    let invoice = []

    const cart = await cartRepository.getById(cart_id)
    const subTotal = cart.total
    const create = await orderRepository.createOrder({ user_id, email, uniqId, subTotal })
    orderId = create.id

    const cartProduct = await cartRepository.getCartProductById(cart_id)
    for (let i = 0; i < cartProduct.length; i++) {
      if (cartProduct[i].cart_id === cart_id) {
        productId = cartProduct[i].product_id
        qty = cartProduct[i].qty
        total = cartProduct[i].total_price
        invoice.push({ "Name": cartProduct[i].Product.productName, "qty": cartProduct[i].qty, "total": cartProduct[i].total_price })
      }
      const payload = { orderId, productId, qty, total }
      orderProduct = await orderRepository.createOrderProduct(payload)
    }
    await emailController.emailing({ uniqId, email, invoice, subTotal })
    await cartRepository.deleteCart(cart_id)

    return res.status(200).json({
      message: 'order success',
      data: create
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.checkOrder = async (req, res) => {
  const uniqId = req.params.uniqId
  const order = await orderRepository.getByUniqId(uniqId)
  if (!order) {
    return res.status(404).json({
      message: 'data tidak ditemukan'
    })
  }
  return res.status(200).json({
    message: 'data berhasil dipanggil',
    data: order
  })
}

exports.update = async (req, res) => {
  const orderId = req.params.id
  try {
    const [updated] = await Order.update(req.body, {
      where: { id: orderId }
    })
    if (updated) {
      const data = await orderRepository.getById(orderId)
      return res.status(200).json({
        message: 'data berhasil diupdate',
        data
      })
    }
    return res.status(404).json({
      message: 'data tidak ditemukan'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}