const models = require('../models')
const Product = models.Product
const Category = models.Category

exports.update = async (data) => {
  try {
    const id = data.idProduct
    const payload = data.payload
    const [updated] = await Product.update(payload, {
      where: { id: id }
    })
    const updatedData = await this.get(id)
    return updatedData

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.get = async (id) => {
  const product = await Product.findOne({
    where: { id: id },
    include: [
      { model: Category }
    ]
  })
  return product
}