import { useParams } from "react-router-dom";
import { useEffect, useRef} from "react";

export default function Resetpassword()
{
    const params=useParams();
   // console.log(params);
    let password=useRef({});
    let token=useRef(params.token);

    function readValue(property,value)
    {
        password.current[property]=value;
    }

    useEffect(()=>{
       token.current=params.token;
       console.log("it got e: ",token.current);
    },[params])

    function reset()
    {
       if(password?.current.main_pass===password?.current.conf_pass)
       {
          fetch('http://localhost:8000/user/updatepassword',{
              method:"PUT",
              headers:{
                "Content-Type":"application/json",
              },
              body:JSON.stringify({password:password.current.main_pass,token:token.current})
          })
          .then((res)=>res.json())
          .then((response)=>{
            console.log(response);
          })
         .catch((err)=>{
            console.log(err);
          })
       }
    }

    return(
        <>
          <input placeholder="Enter Password"  onChange={(e)=>{
             readValue('main_pass',e.target.value)
          }} type='password'/>
          <input placeholder="Enter Password" onChange={(e)=>{
             readValue('conf_pass',e.target.value)
          }}  type='password'/>
          <button onClick={reset}>Reset Password</button>
        </>

    )
}