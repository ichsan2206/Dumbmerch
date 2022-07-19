import './styles/styles.css'

import { useContext, useEffect } from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom'
import { UserContext } from './context/userContext';

import Auth from './pages/auth/Auth';
import Product from './pages/user/Product'
import Profile from './pages/user/Profile'
import DetailProduct from './pages/user/DetailProduct'
import TemplateUser from './components/TemplateUser'
import TemplateAdmin from './components/TemplateAdmin'
import ComplainUser from './pages/user/ComplainUser'
import ListCategory from './pages/admin/ListCategory'
import ListProduct from './pages/admin/ListProduct'
import EditCategory from './pages/admin/EditCategory'
import EditProduct from './pages/admin/EditProduct'
import EditProfile from './pages/user/EditProfile'
import AddCategoryAdmin from './pages/admin/AddCategoryAdmin';
import AddProductAdmin from './pages/admin/AddProductAdmin';
import ComplainAdmin from './pages/admin/ComplainAdmin';

import { API, setAuthToken } from './config/api';

// init token on axios every time the app is refreshed
if (localStorage.token) {
  setAuthToken(localStorage.token);
}


function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  // console.log(state);
  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    // Redirect Auth
    if (state.isLogin === false) {
      navigate('/auth');
    } else {
      if (state.user.status === 'Admin') {
        navigate('/admin');
      } else if (state.user.status === 'Customer') {
        navigate('/user');
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');

      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }

      // Get user data
      let payload = response.data.data.user;
      // Get token from local storage
      payload.token = localStorage.token;

      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, []);

  return (
        <Routes>
          {/* first running */}
          <Route path="/auth" element={<Auth />} />
          {/* mother router user */}
          <Route path="/user" element={<TemplateUser />}>
            <Route index element={<Product />}></Route>
            <Route path="/user/profile" element={<Profile />}></Route>
            <Route path="/user/product/detail/:id" element={<DetailProduct />}></Route>
            <Route path="/user/profile/edit" element={<EditProfile />}></Route>
            <Route path="/user/complain" element={<ComplainUser />}></Route>
          </Route>
          {/* mother router admin */}
          <Route path="/admin" element={<TemplateAdmin />}>
            <Route index element={<ListCategory />}></Route>
            <Route path="/admin/product" element={<ListProduct />}></Route>
            <Route path="/admin/add-category" element={<AddCategoryAdmin />}></Route>
            <Route path="/admin/edit-category/:id" element={<EditCategory />}></Route>
            <Route path="/admin/add-product" element={<AddProductAdmin />}></Route>
            <Route path="/admin/edit-product/:id" element={<EditProduct />}></Route>
            <Route path="/admin/complain" element={<ComplainAdmin />}></Route>
          </Route>
        </Routes>
  );
}

export default App;

