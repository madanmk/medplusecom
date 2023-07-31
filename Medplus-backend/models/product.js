const mongoose=require('mongoose');

const productSchema=mongoose.Schema({

        name:{
            type:String,
             required:true,
            unique:true
            },
        price:{
            type:Number,
            required:true,
            
        },
        description:{
            type:String,
            required:true,
            maxLength:500,
            minLength:50
        },
        images:[{
            type:String
        }],
        pr_req:{
            type:Boolean,
            required:true,
            default:false
        },
        tags:[{
            type:String
        }],
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"categories"
        },
        approved:{
            type:Boolean,
            required:true,
            default:false
        },
        discount:{
            type:Number,
            required:true,
            default:0
        },
        reviews:[
            {
                user:{
                    type:mongoose.Schema.ObjectId,
                    ref:"user",
                    required:true
                },
                rating:{
                    type:Number,
                    required:true,
                },
                comment:{
                    type:String,
                    required:true
                }
            }
        ]
},{timestamps:true})

const productModel=mongoose.model("products",productSchema);

module.exports=productModel;