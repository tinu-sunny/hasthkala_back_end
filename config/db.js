const mongoose = require('mongoose')
// const connectionString ='mongodb+srv://skilly:skilly@cluster0.pzct9lz.mongodb.net/skilly?appName=Cluster0'
// connectionString='mongodb+srv://HASTHKALA:hasthkala123@cluster0.klo1tps.mongodb.net/HASTHKALA?appName=Cluster0'

mongoose.connect(process.env.CONNECTION_STRING).then(res=>{
    console.log("db connected");

    
})

.catch(err=>{
    console.log("error"+err);
    
})