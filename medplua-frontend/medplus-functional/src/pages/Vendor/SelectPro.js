import { useContext, useEffect, useRef, useState } from "react";
import paths from '../../paths.json';

//import { vendorContext } from "./VendorDashboard";

export default function SelectPro()
{

    let [selectPMV,setSelectPMV]=useState(false);
    let vendorProduct=useRef({}); //to store the value of quantity when user type in I/P field of select product.
    let [searchResults,setSearchResults]=useState([]);
   // let [selectedProduct,setSelectedProduct]=useState({});//to store selected products.
    let searchInput=useRef();//to fill the value in I/p field, when user clicks bcz we are not writing here we are selecting.
   // let vendorinfo=useContext(vendorContext);
    let [vendor,setVendor]=useState({});
    let medplus_vendor=useRef(JSON.parse(localStorage.getItem('medplus_vendor'))).current;

   useEffect(()=>{

         fetch("http://localhost:8000/vendor/getinfo/"+medplus_vendor.token)
         .then(res=>res.json())
         .then((response)=>{
              if(response.success===true)
              {
                  setVendor(response);
                  vendorProduct.current['vendor']=response.vendorid;
              }
               
         })
         .catch((err)=>{
            console.log(err);
         })
       
     },[])
    

      function readValue(property,value){
         vendorProduct.current[property]=value;
      }

    function searchProducts(value)
    {
        //to execute only if texts present inside I/P tag.
         if(value.trim().length!==0)
         {
          // console.log("val is:",value);
           fetch(paths.BASE_URL+paths.SEARCH_PRODUCTS+value)
           .then((res)=>res.json())
           .then((response)=>{
                 if(response.success===true)
                 {
                     setSearchResults(response.products);

                 }
           })
           .catch((err)=>{
                console.log(err);
           })
         }
         else{
            setSearchResults([]);
         } 
    }

    function selectProduct()
    {
        fetch(paths.BASE_URL+paths.CREATE_VENDOR_PRODUCT,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(vendorProduct.current)
        })
        .then((res)=>res.json())
        .then(response=>{
            console.log(response);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    return(

         <div className="panel-container">
        
           {/*select products modal */}

           {
                selectPMV===true?(
                    <div className="select-modal" onClick={()=>{
                         setSelectPMV(false);
                      }}>
                        <div className="select-modal-child" onClick={(e)=>{e.stopPropagation()}}>
                              
                              <div className="search">
                                    <input ref={searchInput} className="form-control" type="search" placeholder="Start Typing Medicine Name" onChange={(e)=>{
                                         searchProducts(e.target.value);
                                    }}/>

                                {
                                    searchResults.length!==0?(
                                        <div className="search-results">
                                            {
                                                searchResults.map((product,index)=>{
                                                     return(
                                                        <p key={index} className="results" onClick={()=>{
                                                            //  setSelectedProduct(product);
                                                              //to store product id in vendor collection property 
                                                              vendorProduct.current['product']=product._id;
                                                              searchInput.current.value=product.name;
                                                              setSearchResults([]);
                                                        }}>{product.name}</p>
                                                     )
                                                })
                                                
                                            }
                                        </div>
                                    ):null
                                } 
                               </div>
                                  <input className="form-control" type="Number" placeholder="Quantity" onChange={(e)=>{
                                        readValue("quantity",e.target.value);
                                  }}/>
                                  <button className="btn btn-primary" onClick={selectProduct}>Select Product</button>
                        </div>
                    </div>
                ):null

           }

             <div className="select-header">
                 <h2>Select Products for Selling</h2>
                 <button className="btn btn-primary" onClick={()=>{
                         setSelectPMV(true);
                 }}>Select Product</button>
             </div>
           
          </div>
    )
}