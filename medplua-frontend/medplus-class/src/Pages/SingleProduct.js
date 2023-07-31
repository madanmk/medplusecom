import React, { Component} from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Component/Header';

class SingleProductMain extends Component {

    constructor(props) {
        super(props)

        this.medplus_user=React.createRef();
        this.medplus_user.current=JSON.parse(localStorage.getItem("medplus_user"));

        this.state={
            product:{},
            presentInCart:false
        }
    }

    componentDidMount()
    {
        this.fetchSingleProduct();
    }

    fetchSingleProduct=()=>
    {
        fetch(`http://localhost:8000/product/singleproduct/${this.props.params.productid}/${this.medplus_user.current.user_id}`)
        .then((res)=>res.json())
        .then((response)=>{
            console.log(response);
            if(response.success===true){
                this.setState({product:response.product});
                this.setState({presentInCart:response.presentInCart});
            }
        })
    }

    //componentDidUpdate executed based on params/props changes
    componentDidUpdate(prevProps)
    {
        //if previous props not present dont load/fetch product.
       if(prevProps.params.productid!==undefined  && this.props.params.productid!==prevProps.params.productid)
       {
         this.fetchSingleProduct();
       }
         
    }

    addToCart=()=>
    {
        fetch("http://localhost:8000/product/cart",{
            method:"POST",
            body:JSON.stringify({product:this.state.product?._id,user:this.medplus_user.current.user_id}),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then((res)=>res.json())
        .then((response)=>{
            if(response.success===true)
            {
                this.setState({presentInCart:true});
            }
        })
        .catch((err)=>{
            console.log(err);
        })
    }
        
    render() {
        return (
       
           <>
             
              <Header/>
              <div className='contaier-fluid'>
                   
                   <div className='container'>
                         
                        <div className="card-img single-img">
                            <img src="https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?cs=srgb&dl=pexels-pixabay-208512.jpg&fm=jpg" className='card-img' alt="img"/>
                         </div>
                        <div className="card-info">
                            <p className="card-title">{this.state.product?.name}</p>
                            <p className="card-detail">{this.state.product.category?.name}</p>
                           <div className="card-rating">
                              <div className="star-rating">
                                  <p>4.2</p>
                                  <i className="fa-solid fa-star"></i>
                               </div>
                               <p>90 rating</p>
                           </div>
                           <h2>Product Description</h2>
                           <div className='p-cart-box'>
                                <div className='product-price'>
                                     <h2 className='price'>&#x20B9; {this.state.product?.price-((this.state.product?.discount/100)*this.state.product?.price)} <span className='sm-p'><strike>&#x20B9;{this.state.product?.price}</strike></span><span className='percent'>{this.state.product?.discount}% off</span></h2>
                                </div>
                                <p>Inclusive of All taxes</p>
                                <input type="number" className='quantity-input' placeholder='Quantity' defaultValue={1}/>
                               
                                 {
                                    this.state.presentInCart===false?(
                                        <button onClick={()=>{
                                            this.addToCart();
                                        }} className='btn btni'>ADD TO CART</button>

                                    ):
                                    (
                                        <button className='btn btni' style={{backgroundColor:"Gray"}} disabled>ALREADY IN CART</button>
                                    )
                                 }
                                      
                           </div>

                        </div>

                   </div>

              </div>

           
           </>

        )
    }
}

export default function SingleProduct()
{
    const params=useParams();
    return(
        <SingleProductMain params={params}/>
    )
}
