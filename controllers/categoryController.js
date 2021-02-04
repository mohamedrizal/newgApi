const Category = require('../models').Category

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body)
    return res.status(201).json({
      message: 'data berhasil ditambah',
      data: category
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.getCategory = async (req, res) => {
  const category = await Category.findAll()
  return res.status(200).json({
    message: 'data berhasil dipanggil',
    data: category
  })
}

exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id
  try {
    const [updated] = await Category.update(req.body,
      {
        where: {
          id: categoryId
        }
      }
    )
    if (updated) {
      const category = await Category.findOne(
        {
          where: {
            id: categoryId
          }
        }
      )
      return res.status(200).json({
        message: 'data berhasil diupdate',
        data: category
      })
    } else if (!updated) {
      return res.status(404).json({
        message: `data dengan id${categoryId} tidak ditemukan`
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id
  try {
    const deleteData = await Category.destroy({
      where: {
        id: categoryId
      }
    })
    if (deleteData) {
      return res.status(200).json({
        message: 'data berhasil dihapus'
      })
    }
    return res.status(404).json({
      message: `data dengan id${categoryId} tidak ditemukan`
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: error.message
    })
  }
}