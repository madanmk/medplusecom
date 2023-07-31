import { useEffect, useRef, useState } from "react";
import "../../../css/panel.css";
import ProductNav from "./ProductNav";
import path from '../../../paths.json';

export default function CreateProduct() {
 
         let product=new FormData();
         let [categories,setCategories]=useState([]);

         let medplus_admin=useRef(JSON.parse(localStorage.getItem('medplus_admin'))).current;
          
         useEffect(()=>{
           
             fetch(path.BASE_URL+path.FETCH_CATEGORIES)
             .then((res)=>res.json())
             .then((response)=>{
                  console.log(response);
                  if(response.success===true)
                  {
                    setCategories(response.categories);
                  }
              })
         },[])

        function readValue(property,value) {
            product.append(property,value);
          // product[property] = value;
           // console.log("product.current", product.current);
          }

  function create() {
    //     const formData = new FormData();
    // formData.append("filename", ...product.current.images);
    // formData.append("destination", "images");
    // formData.append("create_thumbnail", true);
    // const config = {
    //   headers: {
    //     "content-type": "multipart/form-data"
    //   }
    // };
    // const data= product.current;
    // const API = "group_util_uploadImage";
    // const HOST = "https://us-central1-wisy-dev.cloudfunctions.net";
    // const url = `${HOST}/${API}`;

    // const result = await axios.post(url, formData, data, config);
    // console.log("REsult: ", result);
    // }

    //console.log("product", product);
    /* axios({
 
            // Endpoint to send files
            url: "http://localhost:8000/product/create",
            method: "POST",
            headers: {
                    'Content-Type': product.images0,
                // Add any auth token here
                authorization: "your token comes here",
            },
 
            // Attaching the form data
            data: product,
           })
 
            // Handle the response from backend here
            .then((res) => { })
 
            // Catch errors if any
            .catch((err) => { });*/

    // console.log(product);
    fetch("http://localhost:8000/product/create", {
                 method: "POST",
                 body: product
      })
      .then((res) => res.json())
      .then((Response) => {
        console.log(Response);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className="panel-container">
      <ProductNav />

      <h2>Create product</h2>

      <div className="create-form">
        <input
          type="text"
          placeholder="Enter Name"
          className="form-control"
          onChange={(e) => {
            readValue("name", e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Enter Price"
          className="form-control"
          onChange={(e) => {
            readValue("price", e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Description"
          className="form-control"
          onChange={(e) => {
            readValue("description", e.target.value);
          }}
        />
        <input
          type="file"
          className="form-control"
          onChange={(e) => {
             // for(let i=0;i<e.target.files.length;i++){
                readValue("images",e.target.files[0]);
             // }
            
          }} 
          
        />
        <input
          type="text"
          placeholder="Tags"
          className="form-control"
          onChange={(e) => {
            readValue("tags", e.target.value);
          }}
        />
        <select
          onChange={(e) => {
            readValue("category", e.target.value);
          }}
          className="form-control"
        >
          <option value="">Select Category</option>
          {
              categories.map((category,index)=>{
                  return(
                     <option key={index} value={category._id}>{category.name}</option>
                  )
              })
          }
        </select>
    
      {
          medplus_admin!==null && medplus_admin.role==="admin"?(
            <>
              Approved
              <input
                type="checkbox"
                className="check"
                onChange={(e) => {
                  readValue("approved", e.target.checked);
                }}
              />
            </>
          ):null
        }
        Prescription Required
        <input
          type="checkbox"
          className="check"
          onChange={(e) => {
            readValue("pr_req", e.target.checked);
          }}
        />
      </div>

      <button className="btn btn-primary form-btn" onClick={create}>
        Create Product
      </button>
    </div>
  )
}
