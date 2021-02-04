const models = require('../models')
const Cart = models.Cart
const CartProduct = models.CartProduct
const Product = models.Product
const cartRepository = require('../repository/carts')
const productRepository = require('../repository/product')

exports.getCart = async (req, res) => {
  const idUser = req.user.id
  const cart = await Cart.findOne({
    where: {
      user_id: idUser
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

  if (!cart) {
    return res.status(404).json({
      message: 'data kosong',
    })
  }

  return res.status(200).json({
    message: 'data berhasil dipanggil',
    data: cart
  })
}

exports.createCart = async (req, res) => {
  const productId = req.body.product_id
  let qty = req.body.qty || 1
  let price = req.body.total_price || 0
  let cartId = null
  let total = ''

  try {
    let cart = await cartRepository.carts(req.user.id)
    if (cart) {
      cartId = cart.id
      const product = await productRepository.get(productId)
      price = qty * product.price
      await CartProduct.create({
        cart_id: cartId,
        product_id: productId,
        qty: qty,
        total_price: price
      })
      const oldData = await cartRepository.getById(cartId)
      const oldTotal = parseInt(oldData.total)
      total = oldTotal + price
      await cartRepository.updateCart({ cartId, total })
      const data = await cartRepository.carts(req.user.id)
      return res.status(200).json({
        message: 'product berhasil ditambahkan ke cart',
        data: data
      })
    } else {
      let create = await Cart.create({
        user_id: req.user.id
      })
      const product = await productRepository.get(productId)
      price = qty * product.price
      let payload = {
        cart_id: create.id,
        product_id: productId,
        qty: qty,
        total_price: price
      }
      const saveData = await CartProduct.create(payload)
      await Cart.update({ total: saveData.total_price },
        {
          where: { id: create.id }
        }
      )
      const data = await cartRepository.carts(req.user.id)
      return res.status(200).json({
        message: 'cart berhasil dibuat',
        data: data
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.updateCartProduct = async (req, res) => {
  const cartProductId = req.body.id
  let qty = req.body.qty
  let total_price = ''
  let payload = ''
  let total = ''

  try {
    const cartProduct = await CartProduct.findOne({
      where: { id: cartProductId },
      include: [
        { model: Product }
      ]
    })
    const oldTotalPrice = cartProduct.total_price
    const cartId = cartProduct.cart_id
    const cartData = await cartRepository.getById(cartId)

    total_price = cartProduct.Product.price * qty
    payload = { qty, total_price }
    total = cartData.total - oldTotalPrice + total_price

    await cartRepository.UpdateQty({ cartProductId, payload })
    await cartRepository.updateCart({ cartId, total })

    const cart = await cartRepository.carts(req.user.id)
    return res.status(200).json({
      message: 'action success',
      data: cart
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.deleteItem = async (req, res) => {
  const idCartProduct = req.body.id
  let total = ''
  try {
    const data = await CartProduct.findOne({
      where: { id: idCartProduct }
    })
    const cartId = data.cart_id
    const cart = await cartRepository.getById(cartId)
    const oldTotal = cart.total
    const productPrice = data.total_price
    total = oldTotal - productPrice

    await CartProduct.destroy({ where: { id: idCartProduct } })
    await cartRepository.updateCart({ cartId, total })

    const resData = await cartRepository.carts(req.user.id)
    return res.status(200).json({
      message: 'data berhasil dihapus',
      data: resData
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}