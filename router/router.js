const express = require('express')
const userController = require('../controller/userController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const { adminAccess, adminAllCustomerView, addnewProduct, savedraft, deleteDraft, updateProduct, viewproductsadmin, deleteProduct, viewproductbyid } = require('../controller/adminController')
const multerConfig = require('../middlewares/multerMiddleware')

const route = express.Router()


// user Routes
 route.post('/register-user',userController.registerUser)
route.post('/user-login',userController.loginUser)
route.post('/googleLogin',userController.googleLogin)
route.get('/new-collections',viewproductsadmin)
route.get('/View-productById/:id',jwtMiddleware,viewproductbyid)

// Admin Routes
route.get('/admin',jwtMiddleware,roleMiddleware('admin'),adminAccess)
route.post('/save-draft-products',jwtMiddleware,savedraft)
route.post('/add-new-products',jwtMiddleware,roleMiddleware('admin'),addnewProduct)
route.put('/update-product',jwtMiddleware,roleMiddleware('admin'),updateProduct)
route.post('/delete-draft-products',jwtMiddleware,roleMiddleware('admin'),deleteDraft)
route.post('/admin-view-products',jwtMiddleware,roleMiddleware('admin'),viewproductsadmin)
route.post('/admin-delete-products',jwtMiddleware,roleMiddleware('admin'),deleteProduct)
route.post('/view-products/:id',jwtMiddleware,viewproductbyid)
// route.get('/admin-order-view-page',jwtMiddleware,roleMiddleware('admin'),adminAccess)

route.get('/admin-all-customer-views',jwtMiddleware,roleMiddleware('admin'),adminAllCustomerView)








module.exports=route