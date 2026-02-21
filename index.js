const express = require('express')
const  cors = require('cors')


require('./config/db')
const route = require('./router/router')

 const  hasthkala = express()

 hasthkala.use(cors())

 hasthkala.use(express.json())

 hasthkala.use(route)


const port = process.env.PORT || 3000



hasthkala.get("/", (req, res) => {
  res.send("Hasthkala Backend Running 🚀");
});



 hasthkala.listen(port,()=>{
    console.log(" app is runing on the port " ,port);
    
 })