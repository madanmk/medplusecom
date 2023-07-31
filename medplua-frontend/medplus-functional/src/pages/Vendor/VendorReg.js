import { useRef, useState } from "react";
import path from '../../paths.json';
import "../../css/vendor.css";

export default function VendorRegistration()
{   
    //we cant use noraml object bcz once u filled form,every property goes init but once u rerender the
    //component data is lost bcz that is normal object so we use useRef.
    let vendor=useRef({});
    let [message,setMessage]=useState(null);
    
     
     function readValue(property,value)
     {
        vendor.current[property]=value;
     }

     function register()
     {
           fetch(path.BASE_URL+path.VENDOR_REGISTRATION,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(vendor.current)
           })   
           .then((response)=>response.json())
           .then((data)=>{
                  if(data.success===true)
                  { 
                     setMessage({msg:"Registration Successfull",msgclass:"success-msg"});
                     
                 }
                  else{
                     setMessage({msg:data.message,msgclass:"error-msg"});
                     }

                setTimeout(()=>{
                        setMessage(null);
                },5000)

           })
           .catch((err)=>{
             console.log(err);
           })
       
     }

     return (
           <div className="login-container">

                   <div className='login'>
                        <h1>Vendor Registration</h1>
                       
                        <input type="text" className='form-control' placeholder="Enter Name" onChange={(e)=>{
                               readValue('name',e.target.value)
                        }}/>
                        <input type="text" className='form-control' placeholder="Enter Email" onChange={(e)=>{
                               readValue('email',e.target.value)
                        }}/>
                        <input type="password" className='form-control' placeholder="Enter Password" onChange={(e)=>{
                               readValue('password',e.target.value)
                        }}/>
                        <input type="text" className='form-control' placeholder="Enter Store Name" onChange={(e)=>{
                               readValue('storeName',e.target.value)
                        }}/>
                        <input type="text" className='form-control' placeholder="Enter Store Address" onChange={(e)=>{
                               readValue('storeAddress',e.target.value)
                        }}/>
                        <input type="text" className='form-control' placeholder="Enter Pin Code" onChange={(e)=>{
                               readValue('pinCode',e.target.value)
                        }}/>
                        <input type="text" className='form-control' placeholder="Enter Pan Number" onChange={(e)=>{
                               readValue('panNumber',e.target.value)
                        }}/>
                         <input type="text" className='form-control' placeholder="Enter Contact" onChange={(e)=>{
                               readValue('contact',e.target.value)
                        }}/>


                        <button className='btn btn-primary' onClick={register}>Register</button>
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