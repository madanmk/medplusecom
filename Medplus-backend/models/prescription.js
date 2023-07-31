const mongoose=require('mongoose');

const prescriptionSchema=mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
     },
     status:{
        type:Number,
        default:1
     },
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
    filePath:{
        type:String,
        required:true
    },
    totalPrice:{
       type:Number,
       default:0
    }  

},{timestamps:true})

const prescriptionModel=mongoose.model("prescriptions",prescriptionSchema);

module.exports=prescriptionModel;