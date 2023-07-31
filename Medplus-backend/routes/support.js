const express=require('express');
const supportModel=require("../models/support");
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');


const router=express.Router();

//endpoint to create a support

router.post("/create",(req,res)=>{

      let data=req.body;
    
      bcryptjs.genSalt(10,(err,salt)=>{
        
         if(!err){
            bcryptjs.hash(data.password,salt,(err,newpass)=>{

                if(!err){
                    data.password=newpass;
                   
                    supportModel.create(data)
                    .then((doc)=>{
                        res.send({success:true,message:"Support Created Successfull"});
                    })
                    .catch((err)=>{
                        console.log(err);
                        res.send({success:false,message:"Support Creation Unsuccessfull try again"});
                    })

                }
                else
                {
                    console.log(err);
                    res.send({success:false,message:"Support Creation Unsuccessfull try again"});
                }

            })
        }
    })

})


router.post("/login",(req,res)=>{
    let credentials=req.body;

    //based on email id we are finding user logined or not.
       supportModel.findOne({email:credentials.email})
       .then((user)=>{

            if(user!==null)
            {  //we are comaparing encrypted pass in backend with frontend user entered pass.
                 bcryptjs.compare(credentials.password,user.password,(err,matched)=>{

                 if(matched===true)
                 { //when we login we generate token using sign() of jsonwebtoken
                   // sign(payload,"secretkey",()=>{}) payload ex:{email} is unique data of user.
                   jwt.sign({email:credentials.email},"secretkey",(err,token)=>{

                        if(!err){
                            res.send({success:true,token:token,email:user.email,userid:user._id,role:user.role});
                        } 
                        else{
                            console.log(err);
                            res.send({success:false,message:"Some Issue Happened try again"});
                        }   

                   })

                 }
                 else{
                    res.send({success:false,message:"Incorrect Password"});
                 }

           })
        }
        else{

            res.send({success:false,message:"Email Does NOt Exist"});
        }
    })

})

//endpoint to update support person (offline or online to check)
router.put('/updatesupport/:id',(req,res)=>{

     let id=req.params.id;
     let data=req.body;
    
     //console.log("for u:",data);
     supportModel.findByIdAndUpdate(id,data)
     .then((info)=>{
          res.send({success:true,message:"Support User Updated"});
     })
     .catch((err)=>{
        console.log(err);
        res.send({success:false,message:"Unable to Update User"});
     })


})


module.exports=router;
