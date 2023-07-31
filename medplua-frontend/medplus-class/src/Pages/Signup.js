import React,{Component} from 'react';
import {Link} from 'react-router-dom';


class Signup extends Component
{

    constructor(props)
    {
        super(props);
        this.user=React.createRef();//constructor checks 1st whether user var present or not,if it not present it creates variable as class scope internally like how we create variables(ex:name;).
        this.user.current={};
    }

    readValue=(property,value)=>
    {
        this.user.current[property]=value;
        console.log(this.user.current);
    }

    signup=()=>
    {
         
        fetch("http://localhost:8000/user/create",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(this.user.current)
        })
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    render(){

          return(
              
               <>
                    <div className='signup-container'>
                          
                          <div className='signup-place'>
                              <h1>Signup</h1>
                              <input type='text' className='form-control' placeholder='Enter Name' onChange={(e)=>{
                                  this.readValue('name',e.target.value);
                              }}/>

                              <input type='email' className='form-control' placeholder='Enter Email' onChange={(e)=>{
                                  this.readValue('email',e.target.value);
                              }}/>

                              <input type='tel' className='form-control' placeholder='Enter Contact No' onChange={(e)=>{
                                   this.readValue('contact',e.target.value);
                              }}/>

                             <input type='password' className='form-control' placeholder='Enter Password' onChange={(e)=>{
                                   this.readValue('password',e.target.value);
                              }}/>

                              <select className='form-control' onChange={(e)=>{
                                    this.readValue("gender",e.target.value);
                              }}>
                                 <option value=''> Select Gender</option>
                                 <option value='male'> Male</option>
                                 <option value='female'>Female</option>
                                 <option value='other'>Other</option>

                              </select>
                              
                              <button className='btn' onClick={this.signup}>Sign Up</button>
                              <p>
                                <Link to='/login'>
                                    Existing User?Login
                                 </Link>
                                </p>

                          </div>
                         
                     </div>
               </>
          )
    }
}

export default Signup;