const mongoose=require('mongoose');

const cartSchema=mongoose.Schema({

        product:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"products"
       },
       user:{
            type:mongoose.Schema.Types.ObjectId,
             ref:"users"
       },
       quantity:{
             type:Number,
            default:1
       }


},{timestamps:true})

const cartModel=mongoose.model("carts",cartSchema);

module.exports=cartModel;