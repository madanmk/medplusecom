import { useEffect, useState,useRef } from "react";
import paths from '../../paths.json';

export default function Prescription()
{

    let [prescriptions,setPresc]=useState([]);
    let [selectPMV,setSelectPMV]=useState(false);
    let [searchResults,setSearchResults]=useState([]);
    let searchInput=useRef();
    let [currentPrescIndex,setCurrentPI]=useState(null);
    let product=useRef({});

    useEffect(()=>{

        fetch('http://localhost:8000/user/prescriptions')
        .then((res)=>res.json())
        .then(response=>{
            console.log(response);
            if(response.success===true)
            {
                setPresc(response.prescription);
            }
        })
        .catch(err=>{
            console.log(err);
        })

    },[])

    function readValue(property,value){
        product.current[property]=value;
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
        let tempPresc=[...prescriptions];
        tempPresc[currentPrescIndex].products.push({...product.current});
        setPresc(tempPresc);
        setSelectPMV(false);
       // console.log(tempPresc);

    }

    function uploadPresc(id)
    {
        fetch(`http://localhost:8000/user/prescription/${id}`,{
             method:"PUT",
             headers:{
                 "Content-Type":"application/json"
             },
             body:JSON.stringify({prescription:prescriptions[currentPrescIndex]})
        })
        .then(res=>res.json())
        .then(response=>{
            if(response.success===true)
            {
                let tempPresc=[...prescriptions];
                tempPresc[currentPrescIndex].status=2;
                setPresc(tempPresc);

            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    
    return(
        
        <div className="panel-container">

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
                                                    searchResults.map((pro,index)=>{
                                                        return(
                                                            <p key={index} className="results" onClick={()=>{
                                                                
                                                                product.current['product']=pro._id;
                                                                product.current['name']=pro.name;
                                                                product.current['price']=pro.price;
                                                                searchInput.current.value=pro.name;
                                                                setSearchResults([]);
                                                               
                                                            }}>{pro.name}</p>
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

            
            <h2>All Prescriptions</h2>
            
            <div className='view-format'>
                    
                    <table className="table table-bordered">

                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer Name</th>
                                <th>Upload Date</th>
                                <th>Select Products</th>
                                <th>View</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                               {
                                    prescriptions.map((pres,i)=>{
                                        return (
                                                <tr key={i}>
                                                <td>{i+1}</td>
                                                <td>{pres.user.name}</td>
                                                <td>{new Date(pres.createdAt).toDateString()} {new Date(pres.createdAt).toLocaleTimeString()}</td>
                                                <td>
                                                    <ul>
                                                        {
                                                                pres.products.map((p,index)=>{
                                                                    return(
                                                                        <li key={index}>{p.name!==undefined?p.name:p.product.name} ({p.quantity})</li>
                                                                    )
                                                                })
                                                        }
                                                    </ul>

                                                    {
                                                        pres.status!==2?(
                                                            <button  className="btn btn-primary" disabled={pres.products.length===0 || pres.status===2} onClick={()=>{
                                                                uploadPresc(pres._id);
                                                         }}>Upload Prescription</button>
                                                        ):
                                                        null
                                                    }
                                                   

                                                   
                                                </td>
                                                <td>
                                                    <a href={pres.filePath} target='blank'>View Prescription</a>
                                                </td>
                                                <td className='actions'>

                                                    {
                                                        pres.status!==2?(
                                                            <button className="btn btn-primary" onClick={()=>{
                                                                // console.log(i);
                                                                 setCurrentPI(i);
                                                                 setSelectPMV(true);
                                                            }}>Select Products</button>
                                                        ):
                                                        (
                                                            <p>Prescription Acknowlegdement</p>
                                                        )
                                                    }
                                                   
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