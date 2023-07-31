const express=require('express');
const mongooose=require('mongoose');
const cors=require('cors');
let PORT=process.env.PORT || 8000;//to considser port which is available in the server if 8000 is not available.
const dotenv=require('dotenv');//by default PORT var is available so to create new environment var we use dotenv.
const http=require('http');
const {Server}=require('socket.io');
const chatModel=require("./models/chat");

//to load all the environment var when application loads which we going to create,for that we use config().
dotenv.config();

//importing routes
let  adminRouter=require('./routes/admin');
let  categoryRouter=require('./routes/category');
let  productRouter=require('./routes/product');
let  supportRouter=require('./routes/support');
let  userRouter=require('./routes/user');
let  vendorRouter=require('./routes/vendor');
let  paymentRouter=require('./routes/payment');
let  deliveryRouter=require('./routes/delivery');
let  chatRouter=require('./routes/chat');

const app=express();
const httpserver=http.createServer(app);

//middleware setup
app.use(cors());
app.use(express.json());
//to declare products folders as public
app.use('/pro/images',express.static('./products'));
app.use('/pre/images',express.static('./prescriptions'));

//database connection
mongooose.connect("mongodb://localhost:27017/medplus")
.then(()=>{
    console.log("database connection success");
})

//setting up routes
app.use("/admin",adminRouter);
app.use("/category",categoryRouter);
app.use("/product",productRouter);
app.use("/support",supportRouter);
app.use("/user",userRouter);
app.use("/vendor",vendorRouter);
app.use("/payment",paymentRouter);
app.use("/delivery",deliveryRouter);
app.use('/chat',chatRouter);

//socket connection logic
let io=new Server(httpserver,{
    cors:{
        origin:['http://localhost:3000','http://localhost:3001'],
        methods:['POST','GET']
    }
})

io.on('connection',(socket)=>{

    socket.on('new_joining',(data)=>{
          console.log("Joined S");
          socket.join(data.id);
     })

    socket.on('to_server',(chat)=>{
          //console.log(chat);
          chatModel.create(chat)
          .then(async (doc)=>{

              let chat=await doc.populate('support');
              //to load chats of conversation we load chats of sender and receiver,from FE sender is customer and
              //receiver is server(support person) but from BE side sender is support person and receiver is customer and we send full conv in this socket
             /* let conversation=await chatModel.find({$or:[{sender:chat.sender,receiver:chat.receiver},{sender:chat.receiver,receiver:chat.sender}]});
                socket.emit('to_user',conversation);
                socket.to(chat.receiver).emit('to_user',conversation);*/

             //to send only new socket message what we receive
             socket.emit('to_user',doc);
             socket.to(chat.receiver).emit('to_user',doc);
             
              
             
          })
          .catch(err=>{
            console.log(err);
          })

    })

})


httpserver.listen(PORT,()=>{
     
      console.log("Server is up and running");

})