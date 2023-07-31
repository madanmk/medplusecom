import '../../css/panel.css';
import {Outlet} from 'react-router-dom';
import {Link} from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import io from 'socket.io-client';

let socket=io('http://localhost:8000');

//export const vendorContext=createContext();

export default function SupportDashboard()
{
    
    let medplus_support=useRef(JSON.parse(localStorage.getItem('medplus_support'))).current;
    let [user,setUser]=useState({});
    let chatInput=useRef(null);
    let chatOwner=useRef(null);
    let [message,setMessage]=useState(null);
    let [currentCustomer,setCC]=useState(null);
    let [conversation,setC]=useState([]);
    let [newMessage,setNM]=useState(null);
    let conRef=useRef(null);//to keep scroll bar down we do dom manipulation and we create seperate child element in conversation area using span or div.
    let [notification,setN]=useState(null);
    let [notificationV,setNV]=useState(false);

    //here sender will be support person and but receiver is customer and can be any one ,
    //so based on the current customer(userid) which we get when support person clicks on 
    //customer icon(in h1 tag we select).
    function sendMessage()
    {

         let chat={
            sender:medplus_support.userid,
            receiver:currentCustomer._id,
            message:message,
            support:medplus_support.userid
         }

         socket.emit('to_server',chat);

         chatInput.current.value='';

    }

    useEffect(()=>{

        //to update conv chat based on proper user we use below condition (if we are in raju conv chat,but from FE
        //if nishu sends message only the nishu conv chat gets updated and to stop going into nishu conv chat
        // this we use below method to stay in raju conv chat)
        socket.on('to_user',(data)=>{
            
           /* this below used to load conv chat its not working to load only new chat so we use another method below
           if(currentCustomer._id===data[0].receiver || currentCustomer._id===data[0].sender)
            {
                console.log("it got exe only when raju s m if raju is currentcustomer or nishu vice versa");
                setC(data);
            }*/

            //to store only new message  which we receive from socket
            console.log(data);
            setNM(data);
           
        })

    },[socket])

    useEffect(()=>{

       if(newMessage!==null)
       {
          setN(`${newMessage?.sender} sent you a message`);
          setNV(true);
          setTimeout(()=>{
            setNV(false);
          },2000)
       }
        
       if(newMessage!==null &&  (currentCustomer?._id===newMessage.sender || currentCustomer?._id===newMessage.receiver))
       {
        setC([...conversation,newMessage])
       }

    },[newMessage])

    useEffect(()=>{

        socket.emit('new_joining',{id:medplus_support.userid});

    },[])

    useEffect(()=>{
        conRef.current?.scrollIntoView();
    },[conversation])

    useEffect(()=>{

         fetch(`http://localhost:8000/chat/chatlist/${medplus_support.userid}`)
         .then((res)=>res.json())
         .then((response)=>{
              console.log(response);
              if(response.success===true)
              {
                 setUser(response.user);
              }
         })
         .catch(err=>{
            console.log(err);
         })

    },[])

    function loadInitialChats(customer)
    {
        fetch(`http://localhost:8000/chat/loadchats/${medplus_support.userid}/${customer._id}`)
        .then((res)=>res.json())
        .then((response)=>{
             console.log(response);
             if(response.success===true)
             {
                setCC(customer);
                setC(response.conversation);
             }
         })
        .catch(err=>{
           console.log(err);
        })
    }

    //to update toggle button
    function updateUser()
    { 
       //data already in user we want to update that and we use deepcopy.
       let updateuser={...user};
       if(updateuser.status===0)
       {
        updateuser.status=1;
       }
       else{
        updateuser.status=0;
       }
        

       fetch(`http://localhost:8000/support/updatesupport/${medplus_support.userid}`,{
            method:"PUT",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(updateuser)
       })
       .then(res=>res.json())
       .then(response=>{
            console.log(response);
            if(response.success===true)
            {
                setUser(updateuser);
            }
       })
       .catch(err=>{
        console.log(err);
       })
    }

    return(
        
        <div className="dashboard-container">
        {/*dashboard header*/}
           <div className="dashboard-header">
                    <div className="dashboard-logo">
                          <p>Support Panel</p>
                    </div>  
           </div>

        {/*dashboard panel*/}
            <div className="dashboard-panel">
                  <div className="sidebar">
                        <Link to="/deliverydashboard/deliverytasks">
                           <div className="sidebar-option">Chats</div>
                         </Link>

                       {  
                            medplus_support.role==='super'?(
                                <Link to="/vendordashboard">
                                  <div className="sidebar-option">See Orders</div>
                               </Link>
                            ):null
                       }
                        
                         
                   </div>

                   {
                      notificationV===true?(
                        <div className='notification'>
                             {notification}
                        </div>
                      ):null
                   }
                  

                   <div className="main-panel chat-panel">
                          
                            <div className='chatbox'>
                                
                                <div className='chat-icon'>
                                   
                                     <div className='chat-item'>Chat List</div>

                                     {
                                        user.chatList?.map((customer,index)=>{
                                            return (
                                                <div className={`chat-item ${currentCustomer?._id===customer._id?'select-chat':null}`} onClick={()=>{
                                                     //setCC(customer);
                                                     loadInitialChats(customer);
                                                }} key={index}>{customer.name}</div>
                                            )
                                        })
                                     }

                                 </div>
                                <div className='chat-area'>

                                   
                                    <div className='conv'>

                                          {
                                            conversation.map((chat,index)=>{
                                                
                                               // console.log(chat);
                                                let chatON='';
                                                if(chatOwner.current===null || chatOwner.current?._id!==chat.support._id)
                                                {
                                                  chatOwner.current=chat.support;
                                                  chatON=chatOwner.current?.name+" chats ";
                                                }

                                                return(
                                                    <>
                                                        <p className='chat-owner'>{chatON}</p>
                                                        <div className={`chat-message ${medplus_support.userid===chat.sender?'my-message':null}`} key={index}>
                                                            {chat.message}
                                                            <p className='time'>
                                                               {new Date(chat.createdAt).getHours()+" : "+new Date(chat.createdAt).getMinutes()}
                                                            </p>
                                                        </div>
                                                    </>
                                                )
                                            })
                                         }

                                         <span ref={conRef}></span>

                                    </div>

                                    <div className='chat-input'>
                                            <input ref={chatInput} disabled={currentCustomer===null} onChange={(e)=>{
                                                setMessage(e.target.value);
                                            }} placeholder='Message Here'/>
                                            <button onClick={sendMessage}><i className='fa-sharp fa-solid fa-share'></i></button>
                                    </div>

                                </div>
                            </div>

                            <label className='button'>
                                   <input onChange={updateUser} checked={user.status===0?false:true} id='toggle' type='checkbox'/>
                                   <span  className='slider'></span>
                            </label>

                    </div>
              
                    

            </div>


    </div>
    )
}