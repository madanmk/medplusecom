const mongoose=require('mongoose');

const categorySchema=mongoose.Schema({

        name:{
            type:String,
            required:true,
            unique:true
            },
        description:{
            type:String,
            required:true,
             },
       
},{timestamps:true})

const categoryModel=mongoose.model("categories",categorySchema);

module.exports=categoryModel;