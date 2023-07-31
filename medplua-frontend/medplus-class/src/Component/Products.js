import { useEffect, useRef, useState } from "react";
import Product from "./Product";

export default function Products(props)
{

    let [products,setProducts]=useState(props.products.products)
    let [totalPrice,setTP]=useState();
    let [tax,setTax]=useState();
    let [withtax,setWithTax]=useState();
    let [addresses,setAddresses]=useState([]);
    let address=useRef({});
    let [selectedAddress,setSelectedAddress]=useState({});
    let order=useRef({});
    let medplus_user=useRef(JSON.parse(localStorage.getItem("medplus_user"))).current;
    let [placeOrderModalV,setPlaceOMV]=useState(false);


    useEffect(()=>{
         //getting the user info
         fetch(`http://localhost:8000/user/singleuser/${medplus_user.user_id}`)
         .then(res=>res.json())
         .then(response=>{
            if(response.success===true)
            {
                setAddresses(response.user.addresses);
                setSelectedAddress(response.user.addresses[0]);
            }
         })
         .catch((err)=>{
            console.log(err);
        })
    },[])

    //useEffect is called whenever state products var changes and  calculate price.
    useEffect(()=>{

        console.log(products);

         let price=0;
         products.forEach((product,index) => {
              price+=product.price;
         });
         setTP(price);
         setTax(Math.round((2/100)*price)); //we are calculating tax 2% on total price.
         setWithTax(Math.round((2/100)*price)+price);
    },[products])

    function removeFromcart(id)
    {
        fetch(`http://localhost:8000/product/cart/${id}`,{
            method:"DELETE",
        })
        .then((res)=>res.json())
        .then((response)=>{
             
             let tempProducts=[...products];

             let index=tempProducts.findIndex((p)=>{return p.cartid===id});

             tempProducts.splice(index,1);
             setProducts(tempProducts);
            
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    //its called automatically inside handlepayment() when we receive response from rz.
    function initPayment(data)
    {
      //first create options with below inbuilt properties based on data we received from rz and again we
      //are sending request to rz server using async handler() function which receives response and
      //later response recived from rz to handler() function is passed to fetch verify api.
      
      const options={
          key:"rzp_test_zQJoRSiG3KujTv",
          amount:data.amount,
          currency:data.currency,
          name:"Some Products",
          description:"Test Transaction",
          image:"https://freepngimg.com/thumb/payment_method/5-2-payment-method-png-image.png",
          order_id:data.id,
          handler:async (response)=>{
              
                fetch('http://localhost:8000/payment/verify',{
                     method:"POST",
                     headers:{
                         "Content-Type":"application/json"
                     },
                     body:JSON.stringify(response)

                })
                .then(res=>res.json())
                .then(response=>{

                    if(response.success===true)
                    {
                        placeOrder();
                    }
                })

          },
          theme:{
             color:"#159972"
          }

      };

      //rz object created and we open rz checkout page and when u click payment it calls handler() function.
      const rzp=new window.Razorpay(options);//code for this we use <script> rz tag in index.html
      rzp.open();

    }

    function handlePayment()
    {
        fetch('http://localhost:8000/payment/order',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({amount:withtax})
        })
        .then(res=>res.json())
        .then(response=>{
            
             console.log(response.data);
             if(response.success===true)
             {
                initPayment(response.data);
             }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    function readValue(property,value)
    {
        address.current[property]=value;
    }

    function saveAddress()
    {
        let tempArray=[...addresses,address.current];
        //setAddresses(tempArray);

        fetch(`http://localhost:8000/user/update/${medplus_user.user_id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({addresses:tempArray})
        })
        .then((res)=>res.json())
        .then((response)=>{
            if(response.success===true)
            {
                setAddresses(response.addresses);
                setSelectedAddress(response.addresses[0]);
            }
        })
        .catch(err=>{
            console.log(err);
        })

    }

    //to store the selected address by the user while placing the order we use this below function.
    function selectAddress(i)
    {
        setSelectedAddress(addresses[i]);
       
    }

    function placeOrder()
    {   
        order.current['deliveryAddress']=selectedAddress;
        //In products state variable we have all the cart details so we use that here.
        order.current['products']=products.map((p,index)=>{
             return {product:p._id,quantity:p.quantity};
        })
       
        order.current['totalAmount']=withtax;

        order.current['user']=medplus_user.user_id;
        
        fetch("http://localhost:8000/payment/placeorder",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(order.current)
        })
        .then(res=>res.json())
        .then(response=>{
            console.log(response);
            setPlaceOMV(false);
        })
        .catch(err=>{
            console.log(err);
        })

    }


    return(

        <>
           
        {
          placeOrderModalV===true?(

               <div className="custom-modal-overlay" onClick={()=>{
                      setPlaceOMV(false);
               }}>

                    <div className="custom-modal-body" onClick={(e)=>{
                         e.stopPropagation();
                    }}>
                            <div>
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
                                            products.map((product,index)=>{
                                                return (
                                                    <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td>{product.name}</td>
                                                        <td>{product.quantity}</td>
                                                        <td>{product.price}</td>
                                                    </tr>
                                                        
                                                )

                                            })

                                        } 

                                        <tr>
                                            <td></td>
                                            <td>Some Tax</td>
                                            <td></td>
                                            <td>{tax} Rs (2%)</td>
                                        </tr>

                                        <tr>
                                            <td></td>
                                            <td><strong>Total Price(with taxes)</strong></td>
                                            <td></td>
                                            <td><strong>{withtax}&#8377;</strong></td>
                                        </tr>

                                    </tbody>
                                </table>

                                <h2>Your Addresses</h2>
                                {
                                    addresses.length!==0?(
                                        <div className="addresses">
                                        {
                                            addresses.map((add,index)=>{
                                                return (
                                                    <div key={index} className={`address ${selectedAddress._id===add._id?'selectedAddress':null}`} onClick={()=>{
                                                         selectAddress(index);
                                                    }}>
                                                          {add.address},{add.landmark},{add.pincode}
                                                    </div>
                                                )
                                            })
                                        }
    
                                         </div>

                                     ):(
                                        <div className="addresses">
                                            <div>
                                               No address yet
                                            </div>
                                         </div>
                                    )
                                }
                                

                            </div>

                        <form className="address-form">
                            <h2>Add New Delivery Address</h2>
                            <input placeholder="Enter Address" onChange={(e)=>{
                                  readValue('address',e.target.value);
                            }}/>
                            <input placeholder="Enter Closest Landmark"  onChange={(e)=>{
                                  readValue('landmark',e.target.value);
                            }}/>
                            <input placeholder="Enter Closest Pincode" onChange={(e)=>{
                                  readValue('pincode',e.target.value);
                            }}/>
                            <button type="button" className="btni card-btn" onClick={saveAddress}>Save Address</button>
                            <button type="button"  onClick={handlePayment} className="btni checkout-btn card-btn">Checkout</button>
                        </form>

                       
                        
                    </div>
                </div>
          ):null
       }


           <div className="container-fluid products">
               <div className="container">
                        <div className="products-header">
                            <h1 className="product-title">{props.products?.title}</h1>
                            {
                                props.cart!==true?(
                                    <button className="btni card-btn">See All</button>
                                ):null
                            }
                        
                            {
                                props.cart===true?(
                                    <div className="order-placement">
                                        <p className="total-price">
                                            Total Price:{totalPrice}&#8377;
                                        </p>
                                        <button className="btni card-btn" disabled={products.length===0} onClick={()=>{
                                            setPlaceOMV(true);
                                        }}>Place Order</button>
                                    </div>
                                ):null
                            }

                        </div>
                            
                    <div className="products-container">
                        {
                            products.map((product,index)=>{
                                return(
                                   <div  key={index} className="product-card">
                                      <Product product={product}/>

                                       {
                                            props.cart===true?(
                                               <button className="btn card-btn" style={{marginTop:"10px"}} onClick={()=>{
                                                   removeFromcart(product.cartid);
                                               }}>Remove from Cart</button>
                                            ):null
                                       }

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