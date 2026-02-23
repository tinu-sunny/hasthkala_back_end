const express = require('express')
const { registerUser, loginUser, googleLogin } = require('../controller/userController')


const route = express.Router()


// user Routes
 route.post('/register-user',registerUser)
route.post('/user-login',loginUser)
route.post('/googleLogin',googleLogin)








module.exports=route