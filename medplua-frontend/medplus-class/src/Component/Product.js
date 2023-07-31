import { Link} from "react-router-dom";

export default function Product(props)
{
     
    

     return(

         <>
           <Link to={`/product/${props.product._id}`}>
              <div className="card-img">
                  <img src="https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?cs=srgb&dl=pexels-pixabay-208512.jpg&fm=jpg" className='card-img' alt="img"/>
              </div>
              <div className="card-info">
                  <p className="card-title">{props.product.name}</p>
                  <p className="card-detail">One bottle</p>
                  <div className="card-rating">
                       <div className="star-rating">
                           <p>4.2</p>
                           <i className="fa-solid fa-star"></i>
                       </div>
                       <p>90 rating</p>
                  </div>
                  <p className="price-info">MRP <strike>&#8377; 500</strike> <span>38% off</span></p>
                  <h3 className="price">&#8377; {props.product.price}</h3>
                 
              </div>
           </Link>
         </>
     )
}