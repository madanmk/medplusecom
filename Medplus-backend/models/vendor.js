const mongoose=require('mongoose');

const vendorSchema=mongoose.Schema({

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
        storeName:{
            type:String,
            required:true,
            unique:true
        },
        storeAddress:{
            type:String,
            required:true,
            maxLength:100
        },
        pinCode:{
            type:Number,
            required:true
        },
        panNumber:{
            type:String,
            required:true,
            unique:true
        },
        contact:{
            type:String,
            required:true,
            unique:true,
            maxLength:10,
            minLength:10
        },
        approved:{
            type:Boolean,
            required:true,
            default:false
        },
        blocked:{
            type:Object,
            required:true,
            default:{block:false,ts:Date.now()}
        }

},{timestamps:true})

const vendorModel=mongoose.model("vendors",vendorSchema);

module.exports=vendorModel;