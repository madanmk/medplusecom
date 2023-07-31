const mongoose=require('mongoose');

const adminSchema=mongoose.Schema({

        name:{
            type:String,
            required:true
            },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
},{timestamps:true})

const adminModel=mongoose.model("admins",adminSchema);

module.exports=adminModel;