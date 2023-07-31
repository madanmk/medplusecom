import React, { Component } from 'react'
import Header from '../Component/Header'
import Products from '../Component/Products';

export default class Cart extends Component {

     constructor(props) {
        super(props)

        this.medplus_user=React.createRef();
        this.medplus_user.current=JSON.parse(localStorage.getItem("medplus_user"));

        this.state={
            products:{}
        }
      } 
    
    componentDidMount(){

        fetch(`http://localhost:8000/product/datafromcart/${this.medplus_user.current.user_id}`)
        .then((res)=>res.json())
        .then((response)=>{
            
            if(response.success===true)
            {
               
               let products=response.products.map((p,i)=>{
                    //we are creating cartid as property to product to delete product from cart 
                    //based on cartid .
                    p.product.cartid=p._id;
                    p.product.quantity=p.quantity;

                    return p.product;
                })
               //in products.js file we displayed title so here we need to pass title along with products
             //  console.log("cart products is:",products); 
               this.setState({products:{title:"cart",products:products}});
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
            {/*if products object is not having data,dont load Products component*/} 
            {
                Object.keys(this.state.products).length!==0?(
                    <Products products={this.state.products} cart={true}/>
                ):null
            }
        </>
        )
    }
}
