import {BrowserRouter,Routes,Route} from 'react-router-dom';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';
import ViewProducts from './pages/Admin/Products/ViewProducts';
import CreateProduct from './pages/Admin/Products/CreateProduct';
import ViewVendors from './pages/Admin/Vendors/ViewVendors';
import Prescription from './pages/Admin/Prescription';
import VendorRegistration from './pages/Vendor/VendorReg';
import VendorLog from './pages/Vendor/VendorLog';
import VendorDashboard from './pages/Vendor/VendorDashboard';
import SelectPro from './pages/Vendor/SelectPro';
import VendorProducts from './pages/Vendor/VendorOrders';
import DeliveryLog from './pages/Delivery/DeliveryLog';
import DeliveryDashboard from './pages/Delivery/DeliveryDashboard';
import DeliveryRegistration from './pages/Delivery/DeliveryReg';
import DeliveryTasks from './pages/Delivery/DeliveryTasks';
import CreateSupport from './pages/Admin/Support/CreateSupport';
import SupportLog from './pages/Support/SupportLog';
import SupportDashboard from './pages/Support/SupportDashboard';
import './App.css';


function App() {
  return (
    <div className="App">
        
            <BrowserRouter>
                   <Routes>
                         
                          {/* admin routes*/}
                         <Route path='/' element={<AdminLogin/>}/>
                         <Route path='/adminlogin' element={<AdminLogin/>}/>
                         <Route path='/admindashboard' element={<AdminDashboard/>}>
                                    <Route path='/admindashboard/createproduct' element={<CreateProduct/>}/>
                                    <Route path='/admindashboard/viewproducts' element={<ViewProducts/>}/>
                                    <Route path='/admindashboard/viewvendors' element={<ViewVendors/>}/>
                                    <Route path='/admindashboard/viewpresc' element={<Prescription/>}/>
                                    <Route path='/admindashboard/cs' element={<CreateSupport/>}/>
                          </Route>

                          {/*vendor routes*/}
                          <Route path='/vendor' element={<VendorRegistration/>}/>
                          <Route path='/vendorlog' element={<VendorLog/>}/>
                          <Route path='/vendordashboard' element={<VendorDashboard/>}>
                                <Route path='/vendordashboard/createproduct' element={<CreateProduct/>}/>
                                <Route path='/vendordashboard/selectproduct' element={<SelectPro/>}/>
                                <Route path='/vendordashboard/orders' element={<VendorProducts/>}/>
                          </Route>

                          {/*delivery routes*/}
                          <Route path='/delivery' element={<DeliveryRegistration/>}/>
                          <Route path='/deliverylog' element={<DeliveryLog/>}/>
                          <Route path='/deliverydashboard' element={<DeliveryDashboard/>}>
                                 <Route path='/deliverydashboard/deliverytasks' element={<DeliveryTasks/>}/>
                          </Route>

                          {/*Support routes*/}
                          <Route path='/supportdashboard' element={<SupportDashboard/>}/>
                          <Route path='/supportlog' element={<SupportLog/>}/>
                          

                     </Routes>
            </BrowserRouter>

    </div>
  );
}

export default App;
