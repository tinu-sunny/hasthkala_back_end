const roleMiddleware = (role)=>{

    return(req,res,next)=>{
        if(req.payload.role !== role){
            return res.status(403).json({message:"Access denied"})
        }

        next();
    }
}

module.exports=roleMiddleware;