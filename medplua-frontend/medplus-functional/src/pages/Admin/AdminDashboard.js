import {Outlet} from 'react-router-dom';
import {Link} from 'react-router-dom';

function AdminDashboard()
{
      return(
         <div className="dashboard-container">
             {/*dashboard header*/}
                <div className="dashboard-header">
                         <div className="dashboard-logo">
                               <p>Admin Panel</p>
                         </div>  
                </div>

             {/*dashboard panel*/}
                 <div className="dashboard-panel">
                       <div className="sidebar">
                             <Link to="/admindashboard/createproduct">
                                <div className="sidebar-option">Products</div>
                              </Link>
                              <Link to="/admindashboard/viewvendors">
                                 <div className="sidebar-option">Vendors</div>
                              </Link>
                              <div className="sidebar-option">Orders</div>
                              <div className="sidebar-option">Customers</div>
                              <Link to="/admindashboard/cs">
                                 <div className="sidebar-option">Support</div>
                              </Link>
                              <Link to="/admindashboard/viewpresc">
                                 <div className="sidebar-option">Prescriptions</div>
                              </Link>
                        </div>

                        <div className="main-panel">
                               <Outlet/>
                        </div>
                         

                 </div>


         </div>
      )
}

export default AdminDashboard;