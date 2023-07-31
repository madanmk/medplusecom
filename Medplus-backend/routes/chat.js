const express=require('express');
const chatModel=require('../models/chat');
const supportModel=require('../models/support');

const router=express.Router();

//endpoint to add someone in chat list
router.put('/add',(req,res)=>{
   
      let data=req.body;
     
      //to check whether the user present in any one of the  chatList array.
      supportModel.findOne({chatList:{$in:[data.user_id]}})
      .then(async (doc)=>{
          if(doc===null)
          { 
            console.log(doc);
            let supportUser=await supportModel.aggregate([
                 {
                    $match:{status:1} //only online available support person selected
                 },
                {
                    $sample:{size:1}
                }
            ])
           
            //aggregate returns array so we use dot notation to extract and id will be in object form so we convert it into string.
            supportUser[0].chatList.push(data.user_id)

            console.log(supportUser);

            await  supportModel.updateOne({_id:supportUser[0]._id.toString()},supportUser[0])

            res.send({success:true,message:"Added In List",support:supportUser[0]});
          }
          else
          {
            res.send({success:true,message:"Already In List",support:doc});
          }
      })
      .catch(err=>{
        console.log(err);
        res.send({success:false,message:"Dummy"});
      })
})

//endpoint to transfer the chat and support person
router.put('/transfer/:oldsupportid/:userid',(req,res)=>{

     let oldsupportid=req.params.oldsupportid;
     let userid=req.params.userid;
     let data=req.body;
     
     //first we update supportmodel and later we add new support person to the customer who was removed 
     //from the chatList in supportmodel
     supportModel.findByIdAndUpdate(oldsupportid,data)
     .then(async (info)=>{

            let supportUser=await supportModel.aggregate([
              {
                $match:{
                  status:1,
                  _id:{$not:{$eq:oldsupportid}}
                } //only online available support person selected and oldsupport person is not selected
              },
              {
                  $sample:{size:1}
              }
           ])
  
         //aggregate returns array so we use dot notation to extract and id will be in object form so we convert it into string.
         supportUser[0].chatList.push(userid);
         supportModel.updateOne({_id:supportUser[0]._id.toString()},supportUser[0])//in chat collection i have my chat inthat i may be sometime sender or receiver,so when customer was sender the sup was receiver and viceversa.so replace oldsup id by newsup id
         .then(async (info)=>{
            //we change oldsupport sender and receiver id to newsup id .
            await chatModel.updateMany({sender:userid},{receiver:supportUser[0]._id});
            await chatModel.updateMany({receiver:userid},{sender:supportUser[0]._id});

            res.send({success:true,message:"Chat Transfer S",support:supportUser[0]});

           })

     })
     .catch(err=>{
        console.log(err);
        res.send({success:false,message:'Unable to update support'});
     })

})

router.get('/chatlist/:id',async (req,res)=>{

      let id=req.params.id;
      let user=await supportModel.findOne({_id:id}).populate('chatList');
      res.send({success:true,user});

})

//endpoint to load a conversation for a user
router.get('/loadchats/:supportid/:customerid',async (req,res)=>{

      let sid=req.params.supportid;
      let cid=req.params.customerid;

      let conversation=await chatModel.find({$or:[{sender:sid,receiver:cid},{sender:cid,receiver:sid}]}).populate('support');

      res.send({success:true,conversation});

})

module.exports=router;