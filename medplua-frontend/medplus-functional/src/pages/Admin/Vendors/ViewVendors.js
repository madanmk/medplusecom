import { useEffect,useState } from "react";
import path from '../../../paths.json';
import '../../../css/panel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBan, faEye, faUserCheck } from '@fortawesome/free-solid-svg-icons'

export default function ViewVendors()
{
        
       let [vendors,setVendors]=useState([]);

       useEffect(()=>{
              
               fetch(path.BASE_URL+path.FETCH_VENDORS)
               .then((res)=>res.json())
               .then((response)=>{
                    if(response.success===true)
                    {
                        setVendors(response.vendor);
                    }
               })
               .catch((err)=>{
                   console.log(err);
               })

       },[])

       return(

            <div className="panel-conatiner">
               
                <h2>All Vendors</h2>

                <div className='view-format'>
                    
                    <table className="table table-bordered">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Pin Code</th>
                                <th>Store Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                                {
                                    vendors.map((vendor,i)=>{
                                        return (
                                                <tr key={i}>
                                                <td>{i+1}</td>
                                                <td>{vendor.name}</td>
                                                <td>{vendor.email}</td>
                                                <td>{vendor.pinCode}</td>
                                                <td>{vendor.storeName}</td>
                                                <td className='actions'>
                                                    <FontAwesomeIcon icon={faEye} className='text-primary action-icon'/>
                                                    <FontAwesomeIcon icon={faUserCheck} className='text-muted action-icon'/>
                                                    <FontAwesomeIcon icon={faBan} className='text-muted action-icon'/>
                                                </td>
                                            </tr>
                                        )
                                    })
                               }
                            
                        </tbody>

                    </table>

                </div>

           </div>


       )

}