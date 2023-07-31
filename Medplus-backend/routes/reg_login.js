const express=require('express');
const bcryptjs=require('bcryptjs');//to encrypt the plaintext password came in request.
const jwt=require('jsonwebtoken');

const userModel=require('../models/user');
const adminModel=require('../models/admin');
const vendorModel=require('../models/vendor');

const router=express.Router();

//function created to know which role we need to select
function selectModel(role){
      if(role==="admin"){
             return adminModel;
      }
      else if(role==="vendor"){
            return vendorModel;
      }

      return userModel;
}

router.post("/register",(req,res)=>{

    let data=req.body;
    let model=selectModel(data.role);

    bcryptjs.genSalt(10,(err,salt)=>{
        
        if(!err){
            bcryptjs.hash(data.password,salt,(err,newpass)=>{

                if(!err){
                    data.password=newpass;
                    //we are adding just password in Database so delete role property from data object.
                    delete data.role;

                    model.create(data)
                    .then((doc)=>{
                        res.send({success:true,message:"Registration Successfull"});
                    })
                    .catch((err)=>{
                        console.log(err);
                        res.send({success:false,message:"Registration Unsuccessfull try again"});
                    })

                }
                else
                {
                    console.log(err);
                    res.send({success:false,message:"Registration Unsuccessfull try again"});
                }

            })
        }
    })
})

router.post("/login",(req,res)=>{
    let credentials=req.body;

    let model=selectModel(credentials.role);
    //based on email id we are finding user logined or not.
    model.findOne({email:credentials.email})
    .then((user)=>{

        if(user!==null)
        {  //we are comaparing encrypted pass in backend with frontend user entered pass.
           bcryptjs.compare(credentials.password,user.password,(err,matched)=>{

                 if(matched===true)
                 { //when we login we generate token using sign() of jsonwebtoken
                   // sign(payload,"secretkey",()=>{}) payload ex:{email} is unique data of user.
                   jwt.sign({email:credentials.email},"secretkey",(err,token)=>{

                        if(!err){
                            res.send({success:true,token:token,email:user.email,userid:user._id});
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



module.exports=router;