const jwt=require('jsonwebtoken');

function verifyToken(req,res,next)
{
    let header=req.headers.authorization;

    if(header!==undefined)
    {   //we extract token from user sent by spliting on space and we take second index.
        let token=header.split(" ")[1];

        jwt.verify(token,"secretkey",(err,data)=>{
              if(!err)
              {
                next();
              }
              else{
                 res.send({message:"Incorrect Token please login again"});
              }

        })
    }
    else{
        res.send({message:"Token Not Found"});
    }
}

module.exports=verifyToken;