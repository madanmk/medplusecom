import { useEffect, useRef, useState } from "react";
import "../../../css/panel.css";
//import ProductNav from "../Products/ProductNav";
import path from '../../../paths.json';

export default function CreateSupport() {
 
        let support=useRef({});
        
       function readValue(property,value) {
            support.current[property]=value;
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
    fetch("http://localhost:8000/support/create", {
                 method: "POST",
                 headers:{
                    'Content-Type':"application/json"
                 },
                 body:JSON.stringify(support.current)
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

        {/*<ProductNav/>*/}
      
       <h2>Create Support Person</h2>

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
            type="email"
            placeholder="Enter Email"
            className="form-control"
            onChange={(e) => {
                readValue("email", e.target.value);
            }}
            />
            <input
            type="password"
            placeholder="Password"
            className="form-control"
            onChange={(e) => {
                readValue("password", e.target.value);
            }}
            />
            <select onChange={(e)=>{
                readValue('role',e.target.value)
            }}>
               <option value=''>Select Role</option>
               <option value='general'>General</option>
               <option value='super'>Super</option>
            </select>

      
      </div>

      <button className="btn btn-primary form-btn" onClick={create}>
        Create Support Person
      </button>
    </div>
  )
}
