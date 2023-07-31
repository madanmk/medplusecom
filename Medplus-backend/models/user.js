const mongoose=require('mongoose');

const userSchema=mongoose.Schema({

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
        gender:{
            type:String,
            required:true,
            enum:["male","female","other"]
        },
        contact:{
            type:String,
            required:true,
            unique:true
        },
        profilePic:{
            type:String,
            default:"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profilr_avatar_pla...",
            required:true,
        },
        addresses:[
            {
                address:String,
                landmark:String,
                pincode:String
            }
        ],
        blocked:{
            type:Object,
            required:true,
            default:{block:false,ts:Date.now()}
        },
       
},{timestamps:true})

const userModel=mongoose.model("users",userSchema);

module.exports=userModel;