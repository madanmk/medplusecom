const express=require('express');
const razorpay=require('razorpay');
const crypto=require('crypto');//to generate keys and signature.
const vendorModel=require("../models/vendor");
const orderModel = require('../models/order');
const cartModel=require('../models/cart');
const prescriptionModel = require('../models/prescription');

const router=express.Router();

//order creation
router.post('/order',async (req,res)=>{

      try{
         //we create razorpay object.
         const instance=new razorpay({
             key_id:process.env.KEY_ID,
             key_secret:process.env.KEY_SECRET
         })  
         
         //we create amt/price options to send to razorpay with below properties and multiple by 100 bcz
         // razorpay displays as(ex:450.00) which is 450 only.
        const options={
            amount:Number(req.body.amount*100),
            currency:"INR",
            receipt:crypto.randomBytes(10).toString("hex") //to generate receipts based on keys etc.
        }

        //to send request to rz server we use instance.orders.create().
        instance.orders.create(options,(err,order)=>{
            if(err)
            {
                console.log(err);
                res.status(500).send({success:false,message:"Some Problem"});
            }

            res.status(200).send({success:true,data:order});

        })

      }
      catch(err)
      {
          console.log(err);
          res.status(500).send({message:"Server Error"});
      }

})

//verification logic
router.post('/verify',async (req,res)=>{

    try
    {
      //to create signature logic we use destructing and request sent from FE with below 3 properties,
      //extract 3properties from req.body and store it in const {}.
      const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
      const sign=razorpay_order_id+"|"+razorpay_payment_id;
      //we generate below signature code internally using razorpay crypto() method based on sign and KEY_SECRET.
      const expectedSign=crypto.createHmac("sha256",process.env.KEY_SECRET).update(sign.toString()).digest("hex");
      
      if(razorpay_signature===expectedSign)
      {
        res.status(200).send({success:true,message:"Payment Verified Successfully"});
      }
      else
      {
        res.status(400).send({success:false,message:"Invalid Signature"});
      }

    }
    catch(err)
    {
        console.log(err);
          res.status(500).send({message:"Server Error"});
    }
})

router.post('/placeorder',async (req,res)=>{
       
      let order=req.body;

      let pincode=order.deliveryAddress.pincode;
      //we use aggregrate function to get random records based on the condition we give.Instead of
      //using findone() which gives only 1st record based on the match even lot of matched data present.
      let vendor=await vendorModel.aggregate([
          
          {
            $match:{pinCode:Number(pincode)}
          },
          {
            $sample:{size:1}
          },
      ])

      //aggregate function returns default array of object,so we use dot notation to extract data.
      order['vendor']=vendor[0]._id;
     
      //to store order in order collection
      orderModel.create(order)
      .then((doc)=>{
          //if it dont have pres_id data comes from cart model,if it has id data comes from pres model.
         if(order['pres_id']===undefined)
         {
         
              let proids=order.products.map((p)=>{
                return p.product;
            })
            cartModel.deleteMany({product:{$in:proids}})
            .then((info)=>{
            //console.log("Deleted item info:",info);
               res.send({success:true,message:"Order Placed"});
            })
            .catch((err)=>{
               console.log(err);
               res.send({success:false,message:"Unable to remove from cart"});
            }) 

         }
         else
         {
            prescriptionModel.findByIdAndUpdate(order['pres_id'],{status:3})
            .then(info=>{
              res.send({success:true,message:"Order Placed"});
            })
            .catch((err)=>{
               console.log(err);
               res.send({success:false,message:"Unable to update the Presc"});
            })
         }

          

      })
      .catch((err)=>{
           console.log(err);
           res.send({success:false,message:"Some Problem Occured while Placing Order"});
      })

     // res.send({message:"Order Placed"});

})


module.exports=router;