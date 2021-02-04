const router = require('express').Router()
const authController = require('../controllers/authController')
const { validate } = require('../validator')
const { rules: registrationRule } = require('../validator/auth/register')
const { rules: loginRule } = require('../validator/auth/login')

router.post('/login', [loginRule, validate], authController.login);

router.post('/register', [registrationRule, validate], authController.register)

module.exports = router