import { useRef, useState ,useEffect} from "react";
import Header from "../Component/Header";

export default function Prescription()
{
    let medplus_user=useRef(JSON.parse(localStorage.getItem("medplus_user"))).current;
    let formdata=useRef(new FormData());
    let [prescriptions,setPresc]=useState([]);
    let order=useRef({});
    let [addresses,setAddresses]=useState([]);
    let address=useRef({});
    let [selectedAddress,setSelectedAddress]=useState({});
    let [placeOrderModalV,setPlaceOMV]=useState(false);
    let [products,setProducts]=useState();
    let [totalPrice,setTotalPrice]=useState(null);

    //function to select prescription file
    function handleFile(e)
    {
       formdata.current.append('file',e.target.files[0]);
    }

    //function to upload pres to the DB
    function uploadPresc()
    {
        formdata.current.append('user',medplus_user.user_id);
        fetch('http://localhost:8000/user/prescription',{
            method:"POST",
            body:formdata.current
        })
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response);
        })
        .catch(err=>{
            console.log(err);
        })
    }

    //function to get userinfo and set all his addresses and initial address.
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

   //function when the user selects any address.
   function selectAddress(i)
   {
       setSelectedAddress(addresses[i]);
      
   }

   //function to read ip values while creating the new
   function readValue(property,value)
   {
       address.current[property]=value;
   }
    
   //function to save the new address in db and load it back.
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

    //function to load all the user prescriptions
    useEffect(()=>{
        
        fetch(`http://localhost:8000/user/prescriptions/${medplus_user.user_id}`)
        .then((res)=>res.json())
        .then((response)=>{
            if(response.success===true)
            {
                setPresc(response.prescription);
            }
        })
        .catch(err=>{
            console.log(err);
        })

    },[])
    
    function placeOrder()
    {   
         
          order.current['deliveryAddress']=selectedAddress;
          order.current['products']=products.map((p,index)=>{
             return {product:p.product._id,quantity:p.quantity};
          })
       
          order.current['totalAmount']=totalPrice;

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

    function handlePayment()
    {
        fetch('http://localhost:8000/payment/order',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({amount:totalPrice})
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

    function initPayment(data)
    {
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

      
      const rzp=new window.Razorpay(options);
      rzp.open();

    }

    return(
  
        <>
         
           <Header/>

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
                                            <td><strong>{totalPrice}&#8377;</strong></td>
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
                            <button type="button" onClick={handlePayment} className="btni checkout-btn card-btn">Checkout</button>
                        </form>

                       
                        
                    </div>
                </div>
          ):null
       }

           <div className="container-fluid products">
                <div className="container">
                    <div className="prescription-header">
                        <h1 className="product-title">Prescription Orders</h1>

                        <div>
                           <input type='file' onChange={handleFile}/>
                           <button className="btn card-btn" onClick={uploadPresc}>Upload Prescription</button>
                        </div>

                    </div>

                    <div className='prescriptions'>

                        {
                            prescriptions.map((pres,index)=>{

                                return(

                                  <div key={index} className="prescription">

                                       <h2>Prescription {index+1}</h2>

                                       <div className="prescription-details">
                                         
                                            <div className="pres-child">
                                                <img className="pres-img" src={pres.filePath}/>
                                            </div>

                                            <div className="pres-child">
                                               
                                                    {
                                                        pres.products.length!==0?
                                                            
                                                            pres.products.map((pro,ind)=>{
                                                                
                                                                return(
                                                                
                                                                    <div key={ind} className="pres-product">
                                                                        <img width="50px" src={'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?cs=srgb&dl=pexels-pixabay-208512.jpg&fm=jpg'}/>
                                                                        <div>
                                                                             <p>{pro.product.name}</p>
                                                                             <p><strong>Quantity : {pro.quantity}</strong></p>
                                                                             <p><strong>Price : {pro.product.price} &#8377;</strong></p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })

                                                        :(
                                                            <h2>Not Yet Acknowledged</h2>
                                                        )

                                                    }
                                                
                                            </div>

                                            <div className="pres-child">
                                                <h1>Total Amount : {Math.floor(Number(pres.totalPrice))} &#8377;</h1>

                                                {
                                                    pres.status!==3?(
                                                        <button className="btni card-btn" onClick={()=>{
                                                            setPlaceOMV(true);
                                                            setProducts(pres.products);
                                                            setTotalPrice(Math.floor(Number(pres.totalPrice)));
                                                            order.current['pres_id']=pres._id
                                                        }}>Place Order</button>
                                                    ):null
                                                }
                                                
                                            </div>

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