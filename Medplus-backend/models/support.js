const mongoose=require('mongoose');

const supportSchema=mongoose.Schema({

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
        chatList:[
               {
                type:mongoose.Schema.Types.ObjectId,
                ref:"users"
               }
        ],
        role:{
            type:String,
            default:"general"
        },
        status:{
            type:Number,
            default:0
        }
},{timestamps:true})

const supportModel=mongoose.model("supports",supportSchema);

module.exports=supportModel;