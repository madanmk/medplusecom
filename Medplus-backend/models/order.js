const mongoose=require('mongoose');

const orderSchema=mongoose.Schema({

        products:[
        
            {
              product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"products"
                },
              quantity:{
                  type:Number,
                  default:1
              }
            }
        ],
       user:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"users"
       },
        vendor:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"vendors"
        },
        delivery:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"deliveries",
          default:null
        },
        deliveryAddress:{
            type:Object,
            required:true
        },
        totalAmount:{
            type:Number,
            required:true
        },
        status:{
          type:Number,
          default:1
        }
       
},{timestamps:true})

const orderModel=mongoose.model("orders",orderSchema);

module.exports=orderModel;