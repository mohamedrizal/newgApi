const models = require('../models')
const Order = models.Order
const OrderProduct = models.OrderProduct
const Product = models.Product
const User = models.User

exports.getById = async (id) => {
  const order = await Order.findOne({
    where: { id: id }
  })
  return order
}

exports.createOrder = async (payload) => {
  const order = await Order.create(payload)
  return order
}

exports.createOrderProduct = async (payload) => {
  const orderProduct = await OrderProduct.create(payload)
  return orderProduct
}

exports.getByUniqId = async (uniqId) => {
  try {
    const order = await Order.findOne({
      where: { uniqId: uniqId },
      include: [
        {
          model: User
        },
        {
          model: OrderProduct,
          include: [{ model: Product, }]
        }
      ]
    })
    return order
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}