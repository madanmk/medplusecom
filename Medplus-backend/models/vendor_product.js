const mongoose=require('mongoose');

const vendorProductSchema=mongoose.Schema({

    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products"
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"vendors"
    },
    quantity:{
        type:Number,
        required:true,
        default:0
    },
   /* discount:{
        type:Number,
        default:0
    }*/

},{timestamps:true})

const  vendorProductModel=mongoose.model("vendors_products", vendorProductSchema);

module.exports= vendorProductModel;