import { useRef, useState } from "react";
import path from '../../paths.json';
import "../../css/vendor.css";
import { useNavigate } from "react-router-dom"; 

export default function VendorLog()
{   
    //we cant use noraml object bcz once u filled form,every property goes init but once u rerender the
    //component data is lost bcz that is normal object so we use useRef.
    let vendorCred=useRef({});
    let [message,setMessage]=useState(null);
    let navigate=useNavigate();
    
     
     function readValue(property,value)
     {
        vendorCred.current[property]=value;
     }

     function login()
     {
           fetch(path.BASE_URL+path.VENDOR_LOGIN,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(vendorCred.current)
           })   
           .then((response)=>response.json())
           .then((data)=>{
                  if(data.success===true)
                  { 
                     localStorage.setItem('medplus_vendor',JSON.stringify(data));
                     setMessage(null);
                     navigate("/vendordashboard");
                    // navigate("/vendordashboard",{state:data}); is used to transfer data to other file using useLocation().
                     
                 }
                  else
                  {
                      setMessage({msg:data.message,msgclass:"error-msg"});
                      setTimeout(()=>{
                           setMessage(null);
                          },5000)
                  }
                
            })
           .catch((err)=>{
             console.log(err);
           })
       
     }

     return (
           <div className="login-container">

                   <div className='login'>
                        <h1>Vendor Login</h1>
                       
                      
                        <input type="text" className='form-control' placeholder="Enter Email" onChange={(e)=>{
                               readValue('email',e.target.value)
                        }}/>
                        <input type="password" className='form-control' placeholder="Enter Password" onChange={(e)=>{
                               readValue('password',e.target.value)
                        }}/>
                       
                        <button className='btn btn-primary' onClick={login}>Login</button>
                   </div>

                   {
                      message!==null?(
                      <div className={`message ${message.msgclass}`}>
                          {message.msg}
                      </div>
                      ):null
                    }

           </div>
     )


}