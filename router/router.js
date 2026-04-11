const express = require('express')
const userController = require('../controller/userController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const { adminAccess, adminAllCustomerView } = require('../controller/adminController')


const route = express.Router()


// user Routes
 route.post('/register-user',userController.registerUser)
route.post('/user-login',userController.loginUser)
route.post('/googleLogin',userController.googleLogin)
route.get('/admin',jwtMiddleware,roleMiddleware('admin'),adminAccess)
// route.get('/admin-order-view-page',jwtMiddleware,roleMiddleware('admin'),adminAccess)

route.get('/admin-all-customer-views',jwtMiddleware,roleMiddleware('admin'),adminAllCustomerView)








module.exports=route