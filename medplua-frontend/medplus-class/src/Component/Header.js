import React,{ Component } from 'react';
import {Link} from 'react-router-dom';

export default class Header extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            searchResults:[]
        }

        this.searchField=React.createRef();
    }

    searchProduct=(value)=>{

        if(value!=="" && value.length!==0)
        {
            fetch(`http://localhost:8000/product/products/searchproduct/${value}`)
            .then((res)=>res.json())
            .then((response)=>{
                if(response.success===true){
                    this.setState({searchResults:response.products});
                }
               
            })
        }
        else
        {
            this.setState({searchResults:[]});
        }
        
    }

    render()
    {

            return(

                <>
                
                <div className='container-fluid header'>
                        <div className='container header-container'>
                            <div className='logo'>
                                <Link to="/homepage">
                                    <h1>
                                        MED<span>PLUS</span>
                                    </h1>
                                </Link>
                            </div>
                            <div className='right-header'>

                               <div className='search-area'>
                                    <div className='search-bar'>
                                            <input ref={this.searchField} type="text" placeholder='Search for products' onChange={(e)=>{
                                                this.searchProduct(e.target.value);
                                            }}/>
                                            <i className='fa-solid fa-magnifying-glass'/>
                                    </div>

                                    {
                                        this.state.searchResults.length!==0?(
                                            
                                            <div className='search-results'>

                                                {
                                                this.state.searchResults.map((product,index)=>{
                                                    return(
                                                        <Link key={index} onClick={()=>{
                                                            this.searchField.current.value="";
                                                            this.setState({searchResults:[]});
                                                        }}  to={`/product/${product._id}`}>
                                                            <p className='search-result' key={index}>{product.name}</p>
                                                        </Link>
                                                    )
                                                })
                                                }
                                                
                                         </div>

                                        ):null
                                    }

                                     
                                </div>

                                <Link to="/login">
                                    <button className='btni'>Login</button>
                                </Link>
                               
                                <Link to='/cart'>
                                    <div className='cart-container'>
                                        <i className='fa-solid fa-cart-shopping'></i>
                                        <h2>Cart</h2>
                                    </div>
                                </Link>
                                
                                <Link to='/order'>
                                   <p className='link-text'>Orders</p>
                                 </Link>

                                 <Link to='/prescription'>
                                   <p className='link-text'>Prescriptions</p>
                                 </Link>
                            </div>
                        </div>
                </div>

                
                </>
           )
   }
}