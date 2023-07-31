//import React, { Component } from 'react';
import { useEffect, useState,useRef } from 'react';
//import { resolvePath } from 'react-router-dom';
import Header from '../Component/Header';

export default function Orders()
{
   
    let medplus_user=useRef(JSON.parse(localStorage.getItem("medplus_user"))).current;
    let [orders,setOrders]=useState([]); 
    let [invoiceModal,setIM]=useState(false);
    let [invoiceOrder,setIO]=useState({});

    useEffect(()=>{

         fetch(`http://localhost:8000/user/orders/${medplus_user.user_id}`)
         .then(res=>res.json())
         .then((response)=>{
            console.log(response);
            if(response.success===true)
            {
                setOrders(response.orders);
            }
         })
         .catch(err=>{
            console.log(err);
         })

    },[])

    return(
        <>
          <Header/>

          {
            invoiceModal===true?(
             
                  <div className='custom-modal-overlay' onClick={()=>{
                        setIM(false);
                  }}>

                        <div className='custom-modal-body' style={{flexDirection:"column",rowGap:"20px",alignItems:'flex-start'}} onClick={(e)=>{
                             e.stopPropagation();
                        }}>
                            
                            <div className='invoice'>

                             <h2>Your Order Details</h2>
                                <table className="order-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {
                                            invoiceOrder.products.map((product,index)=>{
                                                return (
                                                    <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td>{product.product.name}</td>
                                                        <td>{product.quantity}</td>
                                                        <td>{product.product.price}</td>
                                                    </tr>
                                                        
                                                )

                                            })

                                        } 

                                        <tr>
                                            <td></td>
                                            <td>Some Tax</td>
                                            <td></td>
                                            <td>120 Rs (2%)</td>
                                        </tr>

                                        <tr>
                                            <td></td>
                                            <td><strong>Total Price(with taxes)</strong></td>
                                            <td></td>
                                            <td><strong>{invoiceOrder.totalAmount}&#8377;</strong></td>
                                        </tr>

                                    </tbody>
                                </table>

                                <div className='extra-info'>

                                    <div>
                                        <h3>Shipping Address</h3>
                                        <br></br>
                                        <div className='invoice-address'>
                                            {invoiceOrder.deliveryAddress.address},{invoiceOrder.deliveryAddress.landmark},{invoiceOrder.deliveryAddress.pincode}
                                        </div>
                                    </div>

                                    <div>
                                        <h3>Vendor Address</h3>
                                        <br></br>
                                        <div className='invoice-address'>
                                           {invoiceOrder.vendor.storeAddress}
                                        </div>
                                     </div>

                                </div>

                            </div>

                            <button className='btni card-btn' onClick={()=>{
                                window.print();
                            }}>Download Invoice</button>

                        </div>

                  </div>

            ):null
          }

          <div className="container-fluid products">
               <div className="container">
                        <div className="order-products-header">
                            <h1 className="product-title">My Orders</h1>
                            {
                                orders.map((order,index)=>{
                                    return (
                                        <div key={index} className='single-order'>

                                                <div className='order-products'>

                                                   {
                                                    order.products.map((product,index)=>{
                                                        return(
                                                            <div key={index} className='order-product'>
                                                                 <img src='https://t4.ftcdn.net/jpg/02/81/42/77/360_F_281427785_gfahY8bX4VYCGo6jlfO8St38wS9cJQop.jpg' width="70px"/>
                                                                
                                                                <div>   
                                                                    <p>
                                                                      {product.product.name}
                                                                    </p>
                                                                    <strong>
                                                                        Quantity : {product.quantity}
                                                                    </strong>
                                                                 </div>

                                                            </div>
                                                        )
                                                    })
                                                   }
                                                    

                                                    <h2>Total Amount:{order.totalAmount} &#8377;</h2>

                                                </div>

                                                <div className='delivery-details'>
                                                    <div className='process'><span className={order.status===1?'state_highlight':null}>Order placed</span> {'---->'} <span className={order.status===2?'state_highlight':null}>Started Packing</span> {'---->'} <span className={order.status===3?'state_highlight':null}>Send For Delivery</span> {'---->'} <span className={order.status===4?'state_highlight':null}>Delivered</span></div>
                                                    <p>
                                                        Delivery Guy : <strong>{order.delivery?.name}</strong>
                                                    </p>
                                                    <p>
                                                        Expected By : <strong>27th March 2022</strong>
                                                    </p>
                                                    <p style={{color:'blue',cursor:"pointer"}} onClick={()=>{
                                                         setIM(true);
                                                         setIO(order);
                                                    }}>View Invoice</p>

                                                </div> 
                                             

                                        </div>
                                    )
                                })
                            }
                        </div>
                </div>
            </div>
        </>
    )
}