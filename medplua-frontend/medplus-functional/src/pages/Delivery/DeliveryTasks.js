import { useEffect, useRef, useState } from "react"

export default function DeliveryTasks()
{
    
    let medplus_delivery=useRef(JSON.parse(localStorage.getItem('medplus_delivery'))).current;
    let [orders,setOrders]=useState([]);

    useEffect(()=>{

         fetch(`http://localhost:8000/delivery/orders/${medplus_delivery.delivery_id}`)
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
    function changeOrderStatus(orderid,status,index)
    {
         fetch(`http://localhost:8000/vendor/orders/${orderid}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({status:status})
         })
         .then((res)=>res.json())
         .then((response)=>{
              
              if(response.success===true)
              {
                let tempOrders=[...orders];

                let order=tempOrders.find((order)=>{
                     return order._id===orderid;
                })
                
                order.status=status;
                tempOrders[index]=order;
                setOrders(tempOrders);

              }

         })
         .catch(err=>{
            console.log(err);
         })
    }

    function loadButtons(order,index)
    {
        if(order.status===2)
        {
            return(
                <button className="btn btn-primary" onClick={()=>{
                     changeOrderStatus(order._id,3,index);
                }}>Picked Up</button>
            )
        }
        else if(order.status===3)
        {
            return(
                <button className="btn btn-primary" onClick={()=>{
                     changeOrderStatus(order._id,4,index);
                }}>Delivered</button>
            )
        }
        else
        {
            return(
                <p>Delivery Done</p>
            )
        }

    }

    return(
        
         <>
           
            <h2>All Tasks</h2>

                <div className='view-format'>
                    
                    <table className="table table-bordered">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer Name</th>
                                <th>Customer Contact</th>
                                <th>Delivery Address</th>
                                <th>Vendor Name</th>
                                <th>Pickup Address</th>
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
                                                <td>{order.user.contact}</td>
                                                <td>{order.deliveryAddress.address},{order.deliveryAddress.landmark},{order.deliveryAddress.pincode} </td>
                                                <td>{order.vendor.name}</td>
                                                <td>{order.vendor.storeAddress}</td>
                                                <td className='actions'>
                                                     {loadButtons(order,i)}
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