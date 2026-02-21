const express = require('express')
const { registerUser } = require('../controller/userController')


const route = express.Router()

 route.post('/register-user',registerUser)









module.exports=route