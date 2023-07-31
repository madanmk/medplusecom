const express=require('express');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const deliveryModel=require("../models/delivery");
const orderModel=require("../models/order");
const router=express.Router();

router.post("/create",(req,res)=>{

    let data=req.body;
   
     bcryptjs.genSalt(10,(err,salt)=>{
        
         if(!err){
             bcryptjs.hash(data.password,salt,(err,newpass)=>{

                if(!err){
                    data.password=newpass;
                   
                    deliveryModel.create(data)
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

//endpoint for delivery login
router.post("/login",(req,res)=>{
    let credentials=req.body;

    //based on email id we are finding user logined or not.
       deliveryModel.findOne({email:credentials.email})
       .then((user)=>{

            if(user!==null)
            {  //we are comaparing encrypted pass in backend with frontend user entered pass.
                 bcryptjs.compare(credentials.password,user.password,(err,matched)=>{

                 if(matched===true)
                 { //when we login we generate token using sign() of jsonwebtoken
                   // sign(payload,"secretkey",()=>{}) payload ex:{email} is unique data of user.
                   jwt.sign({email:credentials.email},"secretkey",(err,token)=>{

                        if(!err){
                            res.status(200).send({success:true,token:token,delivery_id:user._id,email:user.email});
                        } 
                        else{
                            console.log(err);
                            res.status(500).send({success:false,message:"Some Issue Happened try again"});
                        }   

                   })

                 }
                 else{
                    res.status(401).send({success:false,message:"Incorrect Password"});
                   }

              })
           }
           else{

              res.status(404).send({success:false,message:"Email Does NOt Exist"});
               }
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send({success:false,message:"Some Problem with the Server"});
        })

})

//endpoint to get orders for delivery people
router.get("/orders/:deliveryid",async (req,res)=>{
       
    let id=req.params.deliveryid;
    let orders=await orderModel.find({delivery:id}).populate('vendor').populate('user');
    res.send({success:true,orders});
})

module.exports=router;