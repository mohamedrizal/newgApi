const models = require('../models')
const Product = models.Product
const Category = models.Category
const productRepository = require('../repository/product')
const fs = require('fs')

exports.createProduct = async (req, res) => {

  if (req.file) {
    req.body.image = req.file.path
  } else if (!req.file) {
    return res.status(400).json({
      message: "harap sertakan gambar"
    })
  }

  try {
    const product = await Product.create(req.body)
    return res.status(201).json({
      message: 'data berhasil ditambah',
      data: product
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.getProduct = async (req, res) => {
  const currentPage = req.query.page || 1
  const perPage = 5

  const skip = (parseInt(currentPage) - 1) * parseInt(perPage)
  const limit = (parseInt(perPage))

  const product = await Product.findAndCountAll({
    include: [
      {
        model: Category
      }
    ],
    offset: skip,
    limit: limit,
    order: [['createdAt', 'DESC']]
  })

  return res.status(200).json({
    message: 'data berhasil dipanggil',
    data: product
  })
}

exports.updateProduct = async (req, res, next) => {
  const idProduct = req.params.id

  try {
    const data = await Product.findOne({
      where: { id: idProduct }
    })
    const payload = req.body
    if (req.file) {
      req.body.image = req.file.path
      removeImage(data.image)
    }
    let updateData = await productRepository.update({ payload, idProduct })
    if (updateData) {
      return res.status(200).json({
        message: 'data berhasil diupdate',
        data: updateData
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

exports.deleteProduct = async (req, res) => {
  const idProduct = req.params.id
  try {
    const data = await productRepository.get(idProduct)
    removeImage(data.image)
    const deleteData = await Product.destroy({
      where: {
        id: idProduct
      }
    })
    if (deleteData) {
      return res.status(200).json({
        message: 'data berhasil dihapus'
      })
    }
    return res.status(404).json({
      message: `data dengan id${idProduct} tidak ditemukan`
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

const removeImage = (filePath) => {
  fs.unlink(filePath, (err) => console.log(err))
}