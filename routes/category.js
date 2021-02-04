const router = require('express').Router()
const categoryController = require('../controllers/categoryController')
const { validate } = require('../validator')
const { rules: categoryRule } = require('../validator/category/index')

router.post('/create',
    [
        categoryRule, validate
    ],
    categoryController.createCategory
)

router.get('/', categoryController.getCategory)
router.put('/update/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router