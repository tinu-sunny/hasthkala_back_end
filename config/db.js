const mysql2 = require('mysql2')

const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"hasthkala"
})

db.connect((err)=>{
    if(err){
        console.log('db connection error',err);
        
    }

    else{
        console.log('db connected');
        
    }
})

module.exports = db;