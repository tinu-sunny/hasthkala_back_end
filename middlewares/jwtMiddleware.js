const jwt = require('jsonwebtoken');

const jwtMiddleware = (req,res,next)=>{

    console.log('hii');
    console.log(req.headers.authorization);
    
    
const token  = req.headers.authorization.slice(7);

try{
    const jwtVerification = jwt.verify(token,process.env.jwtkey);
    console.log(jwtVerification);

    const userData={
        userMail:jwtVerification.userMail,
        role:jwtVerification.role
    };
    req.payload=userData;
    

}
catch(err){
    res.status(401).json({message1:"authorization Error",message:"Please Login to Explore More",err})
}

next();

}

module.exports=jwtMiddleware;