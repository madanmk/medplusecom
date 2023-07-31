const express=require('express');
const fs=require('fs');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken');
const userModel=require("../models/user");
const orderModel=require('../models/order');
const prescriptionModel=require('../models/prescription');
const formidable=require('formidable');
const router=express.Router();
const nodemailer=require('nodemailer');

let transport=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"dummydummybatch8@gmail.com",
        pass:"cabjcrxhdcoggmek"

    }
})


router.post("/create",(req,res)=>{

    let data=req.body;
   
    bcryptjs.genSalt(10,(err,salt)=>{
        
        if(!err){
            bcryptjs.hash(data.password,salt,(err,newpass)=>{

                if(!err){
                    data.password=newpass;
                    
                    userModel.create(data)
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

//endpoint for user login
router.post("/login",(req,res)=>{
    let credentials=req.body;

    //based on email id we are finding user logined or not.
       userModel.findOne({email:credentials.email})
       .then((user)=>{

            if(user!==null)
            {  //we are comaparing encrypted pass in backend with frontend user entered pass.
                 bcryptjs.compare(credentials.password,user.password,(err,matched)=>{

                 if(matched===true)
                 { //when we login we generate token using sign() of jsonwebtoken
                   // sign(payload,"secretkey",()=>{}) payload ex:{email} is unique data of user.
                   jwt.sign({email:credentials.email},"secretkey",(err,token)=>{

                        if(!err){
                            res.status(200).send({success:true,token:token,user_id:user._id,email:user.email});
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

//endpoint to  send a forget password link
router.get('/forgetpassword/:email',(req,res)=>{
    let email=req.params.email;
    console.log('the e is: ',email);
    //1st we check user exit or not
    userModel.findOne({email:email})
    .then((user)=>{
        if(user!==null)
        {
            jwt.sign({email:user.email},"secretkey",{expiresIn:'1h'},(err,token)=>{

                if(!err)
                {

                    let mailbody={
                        from:"dummydummybatch8@gmail.com",
                        to:email,
                        subject:"Reset Password Link",
                        html:`
                            <p>Click on the link to reset ur password</p>
                            <a href='http://localhost:3000/resetpassword/${token}'>click here</a>
                        `
                    }
                    
                    transport.sendMail(mailbody,(err,info)=>{
                        if(!err){
                            res.send({success:true,message:"Plz Check ur RE for RL"});
                        }
                    })

                }

            })
        }
        else
        {
            res.send({success:false,message:"user doesnt exit"});
        }
    })
    .catch((err)=>{
        console.log(err);
        res.send({success:false,message:"Some Problem"});
    })
})

//endpoint to update password based on token verify when we click reset password and we encrypt pass before update
router.put('/updatepassword',(req,res)=>{
    let reqdata=req.body;
    console.log(reqdata);

    jwt.verify(reqdata.token,"secretkey",(err,data)=>{
        if(!err)
        {
            console.log(data);
            bcryptjs.genSalt(10,(err,salt)=>{

                 if(!err)
                 {
                    bcryptjs.hash(reqdata.password,salt,(err,encpass)=>{
                          
                        userModel.updateOne({email:data.email},{password:encpass})
                        .then(info=>{
                            res.send({success:true,message:"Password Updated please login again"});
                        })
                    })
                 }

            })

         
        }
        else{
           res.send({message:"Incorrect Token please try again"});
        }

    })

})

//endpoint to get a single user info
router.get("/singleuser/:id",async (req,res)=>{
     let id=req.params.id;

     let user=await userModel.findOne({_id:id});
     res.send({success:true,user});
})


//endpoint to update user
router.put("/update/:id",(req,res)=>{

    let id=req.params.id;
    let data=req.body;

    userModel.findByIdAndUpdate(id,data)
    .then(async (info)=>{
        let user=await userModel.findOne({_id:id});
        res.send({success:true,addresses:user.addresses,message:"User Update Successfull"});
     })
    .catch((err)=>{
        console.log(err);
        res.send({success:false,message:"Unable to Update User"});
      })

})

/*once we get user we get new prescription and we extract file and store in prescription folder and 
 new presc we update in old stored prescription.*/
router.post("/prescription",async (req,res)=>{

      // let id=req.params.id;
       //let user=await userModel.findById(id);

       const form=new formidable.IncomingForm();
       //fields is nothing but data.
       form.parse(req,(err,fields,files)=>{
         
                    if(!err) 
                    {

                       // console.log(fields,files);
                        let fileData = fs.readFileSync(files.file.filepath);
                        let ext = files.file.originalFilename.split(".")[1].toUpperCase();
                        let newPath = null;
                        let imagePath = null;
                        if(ext==="JPG" || ext==="JPEG" || ext==="PNG" || ext==="WEBP")
                        {
                            newPath="./prescriptions/"+files.file.newFilename+"."+ext;
                            imagePath ="http://localhost:8000/pre/images/" + files.file.newFilename + "." + ext;
                            fs.writeFileSync(newPath,fileData);
                            // product.images.push(imagePath);      
                            
                           fields['filePath']=imagePath;
                           prescriptionModel.create(fields)
                           .then((doc)=>{
                               res.send({success:true,message:"Presc U S"});
                           })
                           .catch((err)=>{
                               console.log(err);
                               res.send({success:false,message:"Presc NOT U S"});

                           })
                            
                        }
                        else
                        {
                            res.send({success:false,message:"File type is not allowed"});
                        }

                    }  
        })
       
})

//endpoint to get all prescriptions for admin
router.get('/prescriptions',async (req,res)=>{

     let prescription=await prescriptionModel.find().populate('products.product').populate('user');
     res.send({success:true,prescription});

})

//endpoint to get all prescriptions for a user
router.get('/prescriptions/:id',async (req,res)=>{
    let userid=req.params.id;
    let prescription=await prescriptionModel.find({user:userid}).populate('products.product').populate('user');
    res.send({success:true,prescription});

})


//endpoint to update prescription
router.put('/prescription/:id',(req,res)=>{

      let id=req.params.id;
      let data=req.body;
     
      data.prescription.products.map((pro)=>{
         data.prescription.totalPrice+=(pro.price*pro.quantity);
      })

      data.prescription.status=2;

      prescriptionModel.findByIdAndUpdate(id,data.prescription)
      .then(info=>{
            res.send({success:true,message:"Presc C S"});
      })
      .catch(err=>{
          console.log(err);
          res.send({success:false,message:"Presc C U"});
      })

})

//endpoint to get orders for specific user
router.get("/orders/:id",async (req,res)=>{
     
    let id=req.params.id;
    let orders=await orderModel.find({user:id}).populate('products.product').populate('delivery').populate('vendor');
    res.send({success:true,orders});
})

module.exports=router;