const express=require('express');
const categoryModel=require("../models/category");
const router=express.Router();


//endpoint to read all categories
router.get("/",async (req,res)=>{
      
     try{
        let categories=await categoryModel.find();
        res.send({success:true,categories})
     }
     catch(err){
        console.log(err);
        res.send({success:false,message:"Unable to fetch categories at the moment"});
     }
})

//endpoint to get a single category
router.get("/:category_id",async (req,res)=>{
     
    let category_id=req.params.category_id

    try{
       let category=await categoryModel.findById(category_id);//find({_id:product_id})
       res.send({success:true,category})
    }
    catch(err){
       console.log(err);
       res.send({success:false,message:"Unable to fetch Category at the moment"});
    }
})


//endpoint to create a category
router.post("/create",async (req,res)=>{

         let category=req.body;
        try{
                await categoryModel.create(category);  
                res.send({success:true,message:"Category Created"});
         }
         catch(err){
            console.log(err);
            res.send({success:false,message:"Unable to create category"});
         }

})

//endpoint to update a category
router.put("/update/:category_id",(req,res)=>{

       let category_id=req.params.category_id;
       let data=req.body;

       categoryModel.updateOne({_id:category_id},data)
       .then((info)=>{
            res.send({success:true,message:"Category Updated successfully"});
        })
      .catch((err)=>{
          console.log(err);
          res.send({message:"unable to Update Category"});
        })

})

//endpoint to delete a category
router.delete("/delete/:category_id",(req,res)=>{

    let category_id=req.params.category_id;
    
    categoryModel.findByIdAndDelete(category_id)
    .then((info)=>{
         res.send({success:true,message:"category Deleted successfully"});
     })
   .catch((err)=>{
       console.log(err);
       res.send({message:"unable to Delete Product"});
     })

})


module.exports=router;