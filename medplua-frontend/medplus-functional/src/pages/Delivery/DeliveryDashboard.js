import '../../css/panel.css';
import {Outlet} from 'react-router-dom';
import {Link} from 'react-router-dom';
import { useRef } from 'react';

//export const vendorContext=createContext();

export default function DeliveryDashboard()
{
    

    return(
        
        <div className="dashboard-container">
        {/*dashboard header*/}
           <div className="dashboard-header">
                    <div className="dashboard-logo">
                          <p>Delivery Panel</p>
                    </div>  
           </div>

        {/*dashboard panel*/}
            <div className="dashboard-panel">
                  <div className="sidebar">
                        <Link to="/deliverydashboard/deliverytasks">
                           <div className="sidebar-option">Tasks</div>
                         </Link>
                         <Link to="/vendordashboard/selectproduct">
                            <div className="sidebar-option">Completed Tasks</div>
                         </Link>
                        
                         
                   </div>

              
                   <div className="main-panel">
                          <Outlet/>
                   </div>
              
                    

            </div>


    </div>
    )
}