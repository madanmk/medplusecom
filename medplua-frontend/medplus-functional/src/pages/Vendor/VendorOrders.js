import { useEffect, useRef, useState } from "react"

export default function VendorProducts()
{
    
    let medplus_vendor=useRef(JSON.parse(localStorage.getItem('medplus_vendor'))).current;
    let [orders,setOrders]=useState([]);

    useEffect(()=>{

         fetch(`http://localhost:8000/vendor/orders/${medplus_vendor.vendor_id}`)
         .then((res)=>res.json())
         .then((response)=>{
              console.log(response);
              if(response.success===true)
              {
                setOrders(response.orders);
              }
           })
         .catch((err)=>{
            console.log(err);
          })

    },[])

    //function to change order status
    function changeOrderStatus(orderid,index)
    {
         fetch(`http://localhost:8000/vendor/orders/${orderid}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({status:2})
         })
         .then((res)=>res.json())
         .then((response)=>{
              
              if(response.success===true)
              {
                let tempOrders=[...orders];

                let order=tempOrders.find((order)=>{
                     return order._id===orderid;
                })
                
                order.status=2;
                tempOrders[index]=order;
                setOrders(tempOrders);

              }

         })
         .catch(err=>{
            console.log(err);
         })
    }

    return(
        
         <>
           
            <h2>All Products</h2>

                <div className='view-format'>
                    
                    <table className="table table-bordered">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Products</th>
                                <th>Order Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                    orders.map((order,i)=>{
                                        return (
                                                <tr key={i}>
                                                <td>{i+1}</td>
                                                <td>{order.user.name}</td>
                                                <td>
                                                    <ul>
                                                    {
                                                        order.products.map((pro,index)=>{
                                                            return <li key={index}>{pro.product.name} ({pro.quantity})</li>
                                                        })
                                                    }
                                                    </ul>
                                                </td>
                                                <td>{new Date(order.createdAt).toDateString()} {new Date(order.createdAt).toLocaleTimeString()}</td>
                                                <td className='actions'>
                                                     <button className="btn btn-primary" disabled={order.status===2} onClick={()=>{
                                                            changeOrderStatus(order._id,i);
                                                     }}>Packaging Started</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                            }
                            
                        </tbody>

                    </table>

                </div>

          
         </>

    )

}