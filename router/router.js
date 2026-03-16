const express = require('express')
const { registerUser, loginUser, googleLogin } = require('../controller/userController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const { adminAccess, adminAllCustomerView } = require('../controller/adminController')


const route = express.Router()


// user Routes
 route.post('/register-user',registerUser)
route.post('/user-login',loginUser)
route.post('/googleLogin',googleLogin)
route.get('/admin',jwtMiddleware,roleMiddleware('admin'),adminAccess)
// route.get('/admin-order-view-page',jwtMiddleware,roleMiddleware('admin'),adminAccess)

route.get('/admin-all-customer-views',jwtMiddleware,roleMiddleware('admin'),adminAllCustomerView)








module.exports=route