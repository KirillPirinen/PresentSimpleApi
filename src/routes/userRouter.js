const userController = require('../controllers/userController')
const upload = require('../middleware/uploadMulter')

const router = require('express').Router()

router.patch('/', upload.single('avatar'), userController.editUserData)

module.exports = router
