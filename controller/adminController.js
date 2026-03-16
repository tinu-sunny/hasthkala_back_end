const db= require("../config/db")



exports.adminAccess=async(req, res) => {
    res.status(200).json({ message: "Welcome Admin" });
  }


  exports.adminAllCustomerView = async (req,res)=>{

    try{
         const selectQuery = `SELECT * FROM users WHERE role != ?`
         db.query(selectQuery,["admin"],async(err,result)=>{
          if(err){
            console.log(err);
            res.status(500).json({
              message:'Database Error ../',
              err
            })
 }
            else{
              res.status(200).json({
                message:"All users data ",
                result
              })
            }
            
         
         })


    }
    catch(err){
         
      res.status(500).json({
        message:"server Error",
        err
      })
    }
  }