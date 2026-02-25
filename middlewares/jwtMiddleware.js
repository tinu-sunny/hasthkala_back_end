const jwt = require('jsonwebtoken');

const jwtMiddleware = (req,res,next)=>{

const token  = req.header.authorization.slice(7);

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
    res.status(401).json({message:"authorization Error",err})
}

next();

}

module.exports=jwtMiddleware;