import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import '../../css/admin.css';
import path from '../../paths.json';

function AdminLogin()
{
     let adminCredentials={};
     let [message,setMessage]=useState(null);
     const navigate=useNavigate();
      
      function readValue(property,value)
      {
         adminCredentials[property]=value;
      }

      function Login()
      {
            fetch(path.BASE_URL+path.ADMIN_LOGIN,{
                 method:"POST",
                 headers:{
                     "Content-Type":"application/json"
                 },
                 body:JSON.stringify(adminCredentials)
            })   
            .then((response)=>response.json())
            .then((data)=>{
                   if(data.success===true)
                   { 
                      setMessage(null);
                      localStorage.setItem('medplus_admin',JSON.stringify(data));
                      navigate("/admindashboard");
                     
                   }
                   else{
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
            <div className="admin-login-container">

                    <div className='admin-login'>
                         <h1>Admin Login</h1>
                         <input type="text" className='form-control' placeholder="Enter Email" onChange={(e)=>{
                                readValue('email',e.target.value)
                         }}/>
                         <input type="password" className='form-control' placeholder="Enter Password" onChange={(e)=>{
                                readValue('password',e.target.value)
                         }}/>
                         <button className='btn btn-primary' onClick={Login}>Login</button>
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

export default AdminLogin;