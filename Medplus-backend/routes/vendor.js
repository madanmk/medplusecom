const express=require('express');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const vendorModel=require("../models/vendor");
const vendorProductModel=require("../models/vendor_product");
const productModel = require('../models/product');
const orderModel = require('../models/order');
const deliveryModel = require('../models/delivery');
const router=express.Router();

//getting vendor info based on token
router.get('/getinfo/:token',(req,res)=>{

       let token=req.params.token;

       jwt.verify(token,"secretkey",async (err,data)=>{
            if(!err)
            {
                let vendor=await vendorModel.findOne({email:data.email});//findone gives object and find gives array.
                let {email,_id,name}=vendor;//here we are storing values into object property.
                res.send({success:true,email:email,vendorid:_id,name:name});
            }
            else{
                res.send({message:"Incorrect Token please login again"});
            }
       })

})


router.post("/create",(req,res)=>{

    let data=req.body;
   
     bcryptjs.genSalt(10,(err,salt)=>{
        
         if(!err){
             bcryptjs.hash(data.password,salt,(err,newpass)=>{

                if(!err){
                    data.password=newpass;
                   
                    vendorModel.create(data)
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

//endpoint for vendor login
router.post("/login",(req,res)=>{
    let credentials=req.body;

    //based on email id we are finding user logined or not.
       vendorModel.findOne({email:credentials.email})
       .then((user)=>{

            if(user!==null)
            {  //we are comaparing encrypted pass in backend with frontend user entered pass.
                 bcryptjs.compare(credentials.password,user.password,(err,matched)=>{

                 if(matched===true)
                 { //when we login we generate token using sign() of jsonwebtoken
                   // sign(payload,"secretkey",()=>{}) payload ex:{email} is unique data of user.
                   jwt.sign({email:credentials.email},"secretkey",(err,token)=>{

                        if(!err){
                            res.status(200).send({success:true,token:token,vendor_id:user._id,email:user.email});
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

//endpoint to get all vendors
router.get("/vendors",async (req,res)=>{

      let vendor=await vendorModel.find();
      res.send({success:true,vendor});
})


//endpoint to update vendor
router.put("/update/:vendor_id",(req,res)=>{

    let vendor_id=req.params.vendor_id;
    let data=req.body;

    vendorModel.updateOne({_id:vendor_id},data)
    .then((info)=>{
         res.send({success:true,message:"vendor updated successfully"});
    })
    .catch((err)=>{
       console.log(err);
       res.send({message:"unable to Update vendor"});
    })

})

//endpoint to add a vednor product
router.post("/vendorproduct",(req,res)=>{

       let data=req.body;

       vendorProductModel.create(data)
       .then((doc)=>{
             res.send({success:true,message:"Product Added for Selling"});
       })
       .catch((err)=>{
             console.log(err);
             res.send({success:false,message:"Unable to add Product"});
       })

})

//endpoint to delete vendor product
router.delete("vendorproduct/:id",(req,res)=>{
         
         let id=req.params.id;
         vendorProductModel.findByIdAndDelete(id)
         .then((info)=>{
               res.send({success:true,message:"Vendor Product Delete Successfull"});
          })
         .catch((err)=>{
                console.log(err);
                res.send({success:false,message:"Unable to Delete Vendor Product"});
         })
      
})

//endpoint to update vendor produt
router.put("/vendorproduct/:id",(req,res)=>{
          
          let id=req.params.id;
          let data=req.body;

          vendorProductModel.findByIdAndUpdate(id,data)
          .then((info)=>{
                 res.send({success:true,message:"Vendor Product Update Successfull"});
           })
          .catch((err)=>{
                 console.log(err);
                 res.send({success:false,message:"Unable to Update vendor Product"});
            })


})

//endpoint to  search a product
router.get("/searchproduct/:proname",async (req,res)=>{

      let proname=req.params.proname;
      //to display only approved products in the search product and '$regex' is used for half/full match of the name to compare.
      let products=await productModel.find({name:{$regex:proname,$options:"i"},approved:true}).limit(5);
      res.send({success:true,products});

})

//endpoint to get orders for specific vendor
router.get("/orders/:vendorid",async (req,res)=>{
       
       let id=req.params.vendorid;
      // console.log('id is:',id);
       let orders=await orderModel.find({vendor:id}).populate('products.product').populate('user');
       //console.log('order is:',orders);
       res.send({success:true,orders});
})

//endpoint to change status of orders(just updating the package status so we use put() here)
router.put("/orders/:id",async (req,res)=>{
   
    let id=req.params.id;
    let data=req.body;
    let delivery=null;

    if(data.status===2)
    {
        let order=await orderModel.findOne({_id:id});

        delivery=await deliveryModel.aggregate([

            {
                $match:{pinCode:Number(order.deliveryAddress.pincode)}
            },
            {
                $sample:{size:1}
            }

        ])
        data['delivery']=delivery[0]._id;

    }

    orderModel.findByIdAndUpdate(id,data)
    .then((info)=>{
        res.send({success:true,message:"Order Updated"});
    })
    .catch((err)=>{
        console.log(err);
        res.send({success:false,message:"Some Problem"});
    })
})

module.exports=router;