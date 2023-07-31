import React,{Component} from 'react';
//import axios from 'axios';  
//import { useEffect, useState } from 'react';
import Header from '../Component/Header';
import Products from '../Component/Products';
import {useNavigate} from 'react-router-dom';

import io from 'socket.io-client';

let socket=io('http://localhost:8000');

class Homepage extends Component{

    
    constructor(props)
    {
        super(props);

        this.medplus_user=React.createRef();
        this.medplus_user.current=JSON.parse(localStorage.getItem('medplus_user'));

        this.chatInput=React.createRef();
        this.chatInput.current=null;

        this.lastChat=React.createRef();
        this.lastChat.current=null;

        this.chatOwner=React.createRef();
        this.chatOwner.current=null;


        this.state={
            products:{},
            visibleMargin:"-400px",
            support:{},
            message:"",
            conversation:[],
            newMessage:null,
            chatting:false
        }

    }

    sendMessage=()=>{
       let chat={
           sender:this.medplus_user.current.user_id,
           receiver:this.state.support._id,
           message:this.state.message,
           support:this.state.support._id
       }
       socket.emit('to_server',chat);

       this.chatInput.current.value='';
    }

    //It(componentDidMount) called after render happens.
    componentDidMount()
    {
           
           fetch("http://localhost:8000/product/products/homepage")
          .then(res=>res.json())
          .then((response)=>{
                console.log(response);
                if(response.success===true)
                {
                    this.setState({products:response});
                }
          })
          .catch((err)=>{
            console.log(err);

          })

          
          socket.emit("new_joining",{id:this.medplus_user.current.user_id});
          
          socket.on('to_user',(data)=>{
              this.setState({conversation:[...this.state.conversation,data]});
          })

         // this.loadInitialChats();

    } 

    componentDidUpdate(prevProps,prevState)
    {
      //if conv got changed scroll down
      if(this.state.conversation!==prevState.conversation)
      {
        this.lastChat.current.scrollIntoView();
      }
    }

    //here bcz i am the sender and i am the receiver bcz only one customer chatting  its me.
    loadInitialChats=()=>
    {
        console.log(this.state.support._id);
        console.log(this.medplus_user.current.user_id);
        fetch(`http://localhost:8000/chat/loadchats/${this.state.support._id}/${this.medplus_user.current.user_id}`)
        .then((res)=>res.json())
        .then((response)=>{
             console.log(response);
             if(response.success===true)
             {
               this.setState({conversation:response.conversation});
               this.setState({chatting:true});
             }
         })
        .catch(err=>{
           console.log(err);
        })
    }


    addchat=()=>
    {
        fetch("http://localhost:8000/chat/add",{
             method:"PUT",
             headers:{
                 "Content-Type":"application/json"
             },
             body:JSON.stringify({user_id:this.medplus_user.current.user_id})
        })
        .then(res=>res.json())
        .then((response)=>{
              console.log(response);
              if(response.success===true)
              {
                this.setState({support:response.support});
              }
        })
        .catch(err=>{
           console.log(err);
        })
       
    }

    talkSOE=()=>{
        //whenever we click on chat icon we get chatList which contains ids of customers who are added to
        //particular support,so we remove this particular customer ids in chatList and send back to backend.
        let support={...this.state.support};
        
        //we find index of customer_id where he is present in chatList and we will remove
        let index=support.chatList.findIndex((s,i)=>{
            return s===this.medplus_user.current.user_id;
        })

        support.chatList.splice(index,1);

       // console.log(support);

        fetch(`http://localhost:8000/chat/transfer/${this.state.support?._id}/${this.medplus_user.current.user_id}`,{
          method:"PUT",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify(support)
        }) 
        .then(res=>res.json())
        .then((response)=>{
              console.log(response);
              if(response.success===true)
              {
                this.setState({support:response.support});
              }
        }) 
        .catch(err=>{
          console.log(err);
       })

    }
    
    
    render()
      {
           
           return(
              
               <>

                <div className='chatbox' style={{right:this.state.visibleMargin}}>
                     
                     <div className='chat-icon' onClick={()=>{
                          
                          if(this.state.visibleMargin==='-400px')
                          {
                             this.addchat();
                             this.setState({visibleMargin:"0px"});
                          }
                          else
                          {
                            this.setState({visibleMargin:"-400px"});
                            this.setState({chatting:false});
                          }

                     }}>
                        <i className='fa-solid fa-headset'></i>
                     </div>
                     <div className='chat-area'>

                          <div className='support-person'>
                             <p>{this.state.support?.name}</p>
                              
                              {
                                  this.state.support.status===0?
                                  (
                                    <>
                                      <p className='offline'></p> ( Currently Offline)
                                    </>
                                  ):(
                                      <>
                                        <p className='online'></p> ( Online)
                                      </>
                                  )
                              }

                          </div>

                          <div className='conv'>
                               {
                                 this.state.chatting===false?(
                                    <>
                                      <button className='btni btn-card' disabled={this.state.support.status===0} onClick={this.loadInitialChats}>START CHATING</button>
                                      <button className='btni btn-card' onClick={this.talkSOE}>TALK TO SOMEONE ELSE</button>
                                    </>
                                 ):
                                 this.state.conversation.map((chat,index)=>{
                                    
                                    let chatON='';
                                    if(this.chatOwner.current===null || this.chatOwner.current?._id!==chat.support._id)
                                    {
                                      this.chatOwner.current=chat.support;
                                      chatON=this.chatOwner.current?.name+" chats ";
                                    }
                                    
                                    return(
                                        <>
                                          <p className='chat-owner'>{chatON}</p>
                                          <div className={`chat-message ${this.medplus_user.current.user_id===chat.sender?'my-message':null}`} key={index}>
                                              {chat.message}
                                              <p className='time'>
                                                {new Date(chat.createdAt).getHours()+" : "+new Date(chat.createdAt).getMinutes()}
                                              </p>
                                          </div>
                                        </>
                                      )

                                  })
                               }

                               <span ref={this.lastChat}></span>

                          </div>

                          <div className='chat-input'>
                                <input ref={this.chatInput} disabled={!this.state.chatting} onChange={(e)=>{
                                      this.setState({message:e.target.value});
                                }} placeholder='Message Here'/>
                                <button onClick={this.sendMessage}><i className='fa-sharp fa-solid fa-share'></i></button>
                          </div>

                     </div>


                </div>
                  
                <Header/>
                {
                      Object.keys(this.state.products).length!==0?(
                        <>
                         <Products products={this.state.products?.products_1}/>
                         <Products products={this.state.products?.products_2}/>
                        </>
                      ):null
                }
               
                  
               </>

           )

      }

}

export default Homepage;