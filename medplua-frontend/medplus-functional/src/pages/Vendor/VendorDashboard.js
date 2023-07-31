import '../../css/panel.css';
import {Outlet} from 'react-router-dom';
import {Link} from 'react-router-dom';
//import { createContext } from 'react';
//import { useLocation} from 'react-router-dom';
import { useRef } from 'react';

//export const vendorContext=createContext();

export default function VendorDashboard()
{
    //if user without logout if he closes the tab of loginpage,next time if he opens dashboard page data vendorinfo is
    //not available bcz we dont have location.state data , bcz we are opening dashboard directly and stored only token in loginpage so .
    //so we create endpoint to send token and get data using useEffect .
   // let token=JSON.parse(localStorage.getItem('vendor_token'));
  /*  const location=useLocation();
    let vendorinfo=useRef({...location.state});//we make a deep copy first even if we change the path/location and we use useRef to store the data if renders happen also.
    console.log(vendorinfo);*/

    return(
        
        <div className="dashboard-container">
        {/*dashboard header*/}
           <div className="dashboard-header">
                    <div className="dashboard-logo">
                          <p>Vendor Dashboard</p>
                    </div>  
           </div>

        {/*dashboard panel*/}
            <div className="dashboard-panel">
                  <div className="sidebar">
                        <Link to="/vendordashboard/createproduct">
                           <div className="sidebar-option">Add Product</div>
                         </Link>
                         <Link to="/vendordashboard/selectproduct">
                            <div className="sidebar-option">Select Products</div>
                         </Link>
                         <Link to='/vendordashboard/orders'>
                             <div className="sidebar-option">Orders</div>
                         </Link>
                         
                   </div>

                {/*<vendorContext.Provider value={vendorinfo}>*/}
                   <div className="main-panel">
                          <Outlet/>
                   </div>
               {/*</vendorContext.Provider>*/}
                    

            </div>


    </div>
    )
}