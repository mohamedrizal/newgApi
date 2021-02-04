const models = require('../models')
const Cart = models.Cart
const CartProduct = models.CartProduct
const Product = models.Product

exports.carts = async (id) => {
  const carts = await Cart.findOne({
    where: {
      user_id: id
    },
    include: [
      {
        model: CartProduct,
        include: [
          {
            model: Product
          }
        ]
      }
    ]
  })
  return carts
}

exports.getById = async (id) => {
  const carts = await Cart.findOne({
    where: { id: id },
    include: [
      {
        model: CartProduct,
        include: [
          {
            model: Product
          }
        ]
      }
    ]
  })
  return carts
}

exports.getCartProductById = async (id) => {
  const cartProduct = await CartProduct.findAll({
    include: [{ model: Product }]
  })
  return cartProduct
}

exports.UpdateQty = async (data) => {
  const payload = data.payload
  const id = data.cartProductId
  try {
    const update = await CartProduct.update(payload,
      {
        where: { id: id }
      })
  } catch (error) {
    console.log(error)
  }
}

exports.updateCart = async (data) => {
  const payload = data.total
  const id = data.cartId
  try {
    const [updated] = await Cart.update({ total: payload },
      { where: { id: id } })
    if (updated) {
      const resData = await this.getById(id)
      return resData
    } else {
      return 'data tidak ditemukan'
    }
  } catch (error) {
    console.log(error);
  }
}

exports.deleteCart = async (id) => {
  const cart = await Cart.destroy({
    where: { id: id }
  })
  return cart
}