const mongoose=require('mongoose');

const chatSchema=mongoose.Schema({

    sender:{
        type:mongoose.Schema.Types.ObjectId,
    },
   receiver:{
        type:mongoose.Schema.Types.ObjectId,
    },
    support:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"supports"
    },
   message:{
        type:String
    }

},{timestamps:true})

const chatModel=mongoose.model("chats",chatSchema);

module.exports=chatModel;