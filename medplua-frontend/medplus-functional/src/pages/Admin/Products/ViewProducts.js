import '../../../css/panel.css';
import ProductNav from './ProductNav';
import path from '../../../paths.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faIndianRupeeSign, faEye, faFilePen, faTrashCan, faCircleXmark, faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react';

export default function ViewProducts()
{
      let [products,setProducts]=useState([]);
      let [productModalVisible,setProductModalV]=useState(false);//to hold value of visible when we click icons.
      let [updateModalVisible,setUpdateModalV]=useState(false);
   // let [product,setProduct]=useState({});//to store object when we click view product icon and to display it in on FE.
      let [categories,setCategories]=useState([]);
      let product=useRef();//to store object when we click view product icon and to display it in on FE.
      let addNewFile=useRef();  
      
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


      useEffect(()=>{
            fetch(path.BASE_URL+path.FETCH_PRODUCTS)
            .then((res)=>res.json())
            .then((response)=>{
                  if(response.success===true){
                        setProducts(response.products);
                  }
            })
            .catch((err)=>{
                  console.log(err);
            })
      },[])

      //code to close the viewproduct window
    /*  useEffect(()=>{
           
            let keylistener=(event)=>{
                  if(event.code==="Escape")
                  {
                        setProductModalV(false);
                  }
            }
            window.addEventListener("keyup",keylistener)

             return()=>{
                  console.log("listener removed");
                  window.removeEventListener("keyup",keylistener);
             }
      },[])*/

      //we pass product id and index of product also to delete product in FE using index when we click the delete icon.
      function deleteProduct(pro_id,pro_index)
      {
            fetch(path.BASE_URL+path.DELETE_PRODUCT+pro_id,{
                  method:"DELETE",
            })
            .then((res)=>res.json())
            .then((response)=>{
                  if(response.success===true)
                  {
                        let temProducts=[...products];
                        temProducts.splice(pro_index,1);
                        setProducts(temProducts);
                  }
            })
            .catch((err)=>{
                  console.log(err);
            })
      }

      function viewProduct(pro){
            setProductModalV(true);
            product.current={...pro};
      }

      function setupUpdate(pro){
            setUpdateModalV(true);
            product.current={...pro};
      }

      function readValue(pr,value)
      {
           product.current[pr]=value;
      }

      function updateProduct()
      {
            fetch(path.BASE_URL+path.UPDATE_PRODUCT+product.current._id,{
                  method:"PUT",
                  headers:{
                        "Content-Type":"application/json"
                  },
                  body:JSON.stringify(product.current)
            })
            .then((res)=>res.json())
            .then((response)=>{
                  if(response.success===true)
                  {
                      //When we load product, category will be in object form and when we click on update icon again category is object but when we change category,
                      //old category object is replaced with just category id so we use this below condition to get category as object.
                      if(typeof product.current.category!=="object")
                      {
                        product.current.category=categories.find((cat,ind)=>{
                              return cat._id===product.current.category;
                        })
                      }

                      let temProducts=[...products];

                      let index=temProducts.findIndex((pro,ind)=>{
                        return pro._id===product.current._id;
                      })

                      temProducts[index]=product.current;

                      console.log(temProducts);

                      setProducts(temProducts);

                      setUpdateModalV(false);

                  }
            })
            .catch((err)=>{
                  console.log(err);
            })
      }


      //function to click file IP based on a button
      //when u click plus icon it internally clicks input field choose option using click() method.
      function clickFileField()
      {
            addNewFile.current.click();
      }

      function uplSinImg(pid,file)
      {
            let formData=new FormData();
            formData.append("image",file);
            console.log("file is:",file);

            fetch(path.BASE_URL+path.SINGLE_IMAGE_UPLOAD+pid,{
                  method:"PUT",
                  body:formData
            })
            .then((res)=>res.json())
            .then((response)=>{
                  console.log(response);
                  //whole products is stored in products array but when we click on edit icon the 
                  //product is stored in product array so we need to make changes in products also.
                  if(response.success===true)
                  {
                        let temProducts=[...products];

                        let pro=temProducts.find((p,ind)=>{
                              return p._id===pid
                        })

                        pro.images.push(response.image);
                        
                        setProducts(temProducts);
                        //product.current.images.push(response.image);
                  }
            })
            .catch((err)=>{
                  console.log(err);
            })
      }

      function deleteSinImg(pid,imagePath)
      {
              fetch(path.BASE_URL+path.SINGLE_IMAGE_DELETE+pid,{
                   method:"PUT",
                   headers:{
                        "Content-Type":"application/json"
                   },
                   body:JSON.stringify({image:imagePath})
              })
              .then((res)=>res.json())
              .then((response)=>{
                    console.log(response);

                    if(response.success===true)
                    {
                          let temProducts=[...products];
  
                          let pro=temProducts.find((p,ind)=>{
                                return p._id===pid
                          })

                          let index=pro.images.findIndex((img,ind)=>{
                              return img===imagePath;
                          })

                          pro.images.splice(index,1);
                          
                          setProducts(temProducts);
                          
                    }

              })
              .catch((err)=>{
                  console.log(err);
              })
      }

      return(
       
            <div className='panel-container'>

               {/*view modal*/}
                  {
                        productModalVisible===true?(
                              <div className='product-modal'onClick={()=>{
                                    setProductModalV(false);
                                 }}>

                                     <div className='product-modal-child' onClick={(e)=>{
                                          e.stopPropagation();
                                         }}>
      
                                          <h2>{product.current.name}</h2>
                                          <h3>{product.current.price} <FontAwesomeIcon icon={faIndianRupeeSign}/></h3>
                                          <p>{product.current.description}</p>
                                          <div>
                                                <p>Category</p>
                                                <h4>{product.current.category.name}</h4>
                                          </div>
                                          <div>
                                                <p>Approved</p>
                                                <strong>{product.current.approved===true?"yes":"no"}</strong>
                                          </div>
                                          <div>
                                                <p>Prescription Required</p>
                                                <strong>{product.current.pr_req===true?"yes":"no"}</strong>
                                          </div>
                                          <div className='images'>
                                                   
                                                   {
                                                      product.current.images.map((img,ind)=>{
                                                            return (
                                                              <img key={ind} src={img} alt="Pic of tablet" height="50px" width="50px"/>
                                                              )

                                                      })
                                                   }
                                          </div>

                                     </div>
                              </div>
                        ):null
                  }

                  {/*update modal*/}

                  {
                        updateModalVisible===true?(
                              <div className='update-modal' onClick={()=>{
                                    setUpdateModalV(false);
                              }}>
                                    <div className='update-modal-child' onClick={(e)=>{
                                          e.stopPropagation();
                                    }}>

                                     <h1>Update Product</h1>     

                                    <div className="create-form">
                                          <input
                                          type="text"
                                          placeholder="Enter Name"
                                          defaultValue={product.current.name}
                                          className="form-control"
                                          onChange={(e) => {
                                                readValue("name", e.target.value);
                                          }}
                                          />
                                          <input
                                          type="number"
                                          placeholder="Enter Price"
                                          defaultValue={product.current.price}
                                          className="form-control"
                                          onChange={(e) => {
                                                readValue("price", e.target.value);
                                          }}
                                          />
                                          <input
                                          type="text"
                                          placeholder="Description"
                                          defaultValue={product.current.description}
                                          className="form-control"
                                          onChange={(e) => {
                                                readValue("description", e.target.value);
                                          }}
                                          />
                                        { /*<input
                                          type="file"
                                          className="form-control"
                                          onChange={(e) => {
                                                // for(let i=0;i<e.target.files.length;i++){
                                                readValue("images",e.target.files[0]);
                                                // }
                                                
                                          }} 
                                          
                                          /> */}

                                         { /*Tags we passed as string but in BE we converted into array ,so again we need to convert into string*/}

                                          <input
                                          type="text"
                                          placeholder="Tags"
                                          defaultValue={product.current.tags.toString()}
                                          className="form-control"
                                          onChange={(e) => {
                                                readValue("tags", e.target.value);
                                          }}
                                          />
                                          <select defaultValue={product.current.category._id}
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

                                          <input
                                          type="number"
                                          placeholder="Discount Percentage"
                                          defaultValue={product.current.discount}
                                          className="form-control"
                                          onChange={(e) => {
                                                readValue("discount", e.target.value);
                                          }}
                                          />

                                          Approved
                                          <input
                                          type="checkbox"
                                          className="check"
                                          defaultChecked={product.current.approved}
                                          onChange={(e) => {
                                                readValue("approved", e.target.checked);
                                          }}
                                          />
                                          Prescription Required
                                          <input
                                          type="checkbox"
                                          className="check"
                                          defaultChecked={product.current.pr_req}
                                          onChange={(e) => {
                                                readValue("pr_req", e.target.checked);
                                          }}
                                          />
                                          </div>

                                          <button className="btn btn-primary form-btn" onClick={updateProduct}>
                                                Update Product Data
                                                </button>

                                          <div className='images'>

                                                {
                                                      product.current.images.map((image,ind)=>{
                                                             return(
                                                                <div key={ind}  className="up-img" > 
                                                                   <FontAwesomeIcon icon={faCircleXmark} onClick={()=>{
                                                                          deleteSinImg(product.current._id,image);
                                                                      }

                                                                   } className='delete-image'/>
                                                                   <img  alt="" src={image} height="170px"/>
                                                                </div>
                                                             )
                                                      })
                                                }

                                                <div className='add-image' onClick={clickFileField}>
                                                        <FontAwesomeIcon icon={faPlus}/>
                                                </div>
                                                 
                                          </div>

                                          <input type="file" onChange={(e)=>{
                                                uplSinImg(product.current._id ,e.target.files[0])
                                          }} className='single-pic-upl' ref={addNewFile}/>

                                    </div>

                              </div>
                        ):null
                  }

                   <ProductNav/>

                    <h2>View Products</h2>

                     <div className='view-format'>
                         
                          <table className="table table-bordered">

                                <thead>
                                    <tr>
                                      <th>#</th>
                                      <th>Name</th>
                                      <th>Price</th>
                                      <th>Category</th>
                                      <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {
                                          products.map((p,i)=>{
                                                return (
                                                      <tr key={i}>
                                                      <td>{i+1}</td>
                                                      <td>{p.name}</td>
                                                      <td>{p.price}</td>
                                                      <td>{p.category.name}</td>
                                                      <td className='actions'>
                                                            <FontAwesomeIcon icon={faEye} onClick={()=>
                                                                        {viewProduct(p)} 
                                                                  } className='text-primary action-icon'/>
                                                            <FontAwesomeIcon icon={faFilePen} onClick={ ()=>{
                                                                             setupUpdate(p);
                                                                        }

                                                                    } className='text-success action-icon'/>
                                                            <FontAwesomeIcon icon={faTrashCan} onClick={()=>{
                                                                   deleteProduct(p._id,i);
                                                            }} className='text-danger action-icon'/>
          {/*to appear this icon when vendor added product and it is not approved by the admin*/}
                                                           {
                                                               p.approved===false?(
                                                                  <FontAwesomeIcon icon={faTriangleExclamation} onClick={()=>{
                                                                        deleteProduct(p._id,i);
                                                                 }} className='text-danger action-icon'/>
                                                               ):null
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