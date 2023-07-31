import React,{Component} from 'react';
import {Link, useNavigate} from 'react-router-dom';

class LoginComp extends Component
{

    constructor(props) {
        super(props)
        this.user=React.createRef();
        this.user.current={};
      
    }

    readValue=(property,value)=>
    {
        this.user.current[property]=value;
       // console.log(this.user.current);
    }

    login=()=>{

        fetch("http://localhost:8000/user/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(this.user.current)
        })
        .then((res)=>res.json())
        .then((response)=>{
            if(response.success===true)
            {
                localStorage.setItem("medplus_user",JSON.stringify(response));
               this.props.navigate("/homepage");
            }
            
        })
        .catch((err)=>{
            console.log(err);
        })

    }

    forgetPassword=()=>{

        fetch(`http://localhost:8000/user/forgetpassword/${this.user.current.email}`)
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response);
        })
        .catch((err)=>{
            console.log(err);
        })

    }

    render()
    {

         return(

            <>
                <div className='login-container'>
                    <div className='login-place'>
                         <input type='email' placeholder='Enter Email'  onChange={(e)=>{
                                  this.readValue('email',e.target.value);
                         }}/>
                           
                         <input type='password' placeholder='Enter Password'  onChange={(e)=>{
                                  this.readValue('password',e.target.value);
                         }}/>
                         <h3 onClick={this. forgetPassword}>Forgot Password</h3>
                         
                            <button onClick={this.login} className='btn'>Login</button>
                         
                         <p>
                            <Link to='/signup'>
                                Create an Account
                            </Link>
                         </p>

                    </div>
                </div>
            </>
         )
    }
}

export default function Login()
{
    const navigate=useNavigate();

     return(
         <LoginComp navigate={navigate}/>
     )

}