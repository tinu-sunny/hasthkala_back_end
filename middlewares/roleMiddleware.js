const roleMiddleware = (role)=>{

    return(req,res,next)=>{
        console.log(req.payload);
        
        if(req.payload.role !== role){
            return res.status(403).json({message:"Access denied"})
        }

        next();
    }
}

module.exports=roleMiddleware;