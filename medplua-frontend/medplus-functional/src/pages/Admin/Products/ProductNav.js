import '../../../css/panel.css';
import {Link} from 'react-router-dom';

 export default function ProductNav()
 {
        return(
              
            <div className="options-header">
                 <ul className='nav'>
                      <Link to='/admindashboard/createproduct'>
                          <li className='nav-link'>Create Product</li>
                      </Link>
                      
                      <Link to='/admindashboard/viewproducts'>
                          <li className='nav-link'>View Products</li>
                      </Link>
                 
                 </ul>

            </div>
        )
 }