import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom';

import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Homepage from './Pages/Homepage';
import Cart from './Pages/Cart';
/*import Product from './Pages/SingleProduct';*/
import SingleProduct from './Pages/SingleProduct';
import Orders from './Pages/Orders';
import Prescription from './Pages/Prescription';
import Resetpassword from './Pages/Resetpassword';

function App() {
  return (
    <>
      
       <BrowserRouter>
           <Routes>
                <Route path='/signup' element={<Signup/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/homepage' element={<Homepage/>}/>
                <Route path='/cart' element={<Cart/>}/>
                <Route path='/order' element={<Orders/>}/>
                <Route path='/prescription' element={<Prescription/>}/>
                <Route path='/product/:productid' element={<SingleProduct/>}/>
                <Route path='/resetpassword/:token' element={<Resetpassword/>}/>
           </Routes>
       </BrowserRouter>
      
    </>
  );
}

export default App;
