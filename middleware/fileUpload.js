const fs = require('fs')
const multer = require('multer')

const getFileType = (file) => {
  console.log(file);
  const mimeType = file.mimetype.split('/')
  return mimeType[mimeType.length - 1]
}

const generateFileName = (req, file, cb) => {
  // const extension = getFileType(file)
  const name = file.originalname

  const filename = name
  cb(null, file.fieldname + '-' + filename)
}

const fileFilter = (req, file, cb) => {
  const extension = getFileType(file)

  const allowedType = /jpeg|jpg|png/
  const passed = allowedType.test(extension)

  if (passed) {
    return cb(null, true)
  }
  return cb(null, false)
}

exports.imageUpload = ((req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = 'uploads/product'

      fs.access(dest, (error) => {
        if (error) {
          return fs.mkdir(dest, (error) => {
            cb(error, dest)
          })
        } else {
          return cb(null, dest)
        }
      })
    },
    filename: generateFileName
  })
  return multer({ storage, fileFilter }).single('image')
})()

exports.test = ((req, res, next) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = 'uploads/product'

      fs.access(dest, (error) => {
        if (error) {
          return fs.mkdir(dest, (error) => {
            cb(error, dest)
          })
        } else {
          return cb(null, dest)
        }
      })
    },
    filename: generateFileName
  })
  return multer({ storage, fileFilter }).single('qr')
})()