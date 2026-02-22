const express = require('express')
const { registerUser, loginUser } = require('../controller/userController')


const route = express.Router()


// user Routes
 route.post('/register-user',registerUser)
route.post('/user-login',loginUser)








module.exports=route