import React, { useState,useEffect } from "react";
import './App.css';
import axios from "axios";
import {BrowserRouter as Router, Route , Routes } from "react-router-dom";
import WebFont from "webfontloader";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp.js";
import store from "./store.js";
import { loadUser } from "./actions/userAction.js";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import Payment from "./component/Cart/Payment.js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";


function App() {

  axios.defaults.withCredentials = true;

  const {isAuthenticated,user,loading} = useSelector((state)=>state.user)

  const [stripeApiKey,setStripeApikey] = useState("");

  async function getStripeApikey(){
    const {data} = await axios.get("/api/v1/stripeapikey");
    setStripeApikey(data.stripeApiKey);
  }
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getStripeApikey();
    }
  }, [isAuthenticated]);
  
  //window.addEventListener("contextmenu",(e)=>e.preventDefault());

  return(
    <Router>
      <Header/>
      {isAuthenticated && <UserOptions user={user} />}
      {loading===false && (
      <Routes>
        <Route exact path="/" element={<Home/> } />
        <Route exact path="/product/:id" element={<ProductDetails/> } />
        <Route exact path="/products" element={<Products/> } />
        <Route exact path="/products/:keyword" element={<Products/> } />
        <Route exact path="/search" element={<Search/> } />
        <Route exact path="/contact" element={<Contact/>} />   

        <Route exact path="/about" element={<About/>} />

        <Route exact path="/login" element={<LoginSignUp/>} />
        <Route path="/account" element={<ProtectedRoute element={Profile} />} />
        <Route path="/me/update" element={<ProtectedRoute element={UpdateProfile} />} />
        <Route path="/password/update" element={<ProtectedRoute element={UpdatePassword} />} />
        <Route path="/password/forgot" element={<ForgotPassword/> } /> 
        <Route path="/password/reset/:token" element={<ResetPassword/> } /> 
        <Route path="/cart" element={<Cart/> } /> 
        <Route path="/shipping" element={<ProtectedRoute element={Shipping } />} />


        <Route path="/process/payment" element={
          stripeApiKey && (
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute element={Payment} />
            </Elements>
          )
        } />

        <Route path="/success" element={<ProtectedRoute element={OrderSuccess } />} />

        <Route path="/orders" element={<ProtectedRoute element={MyOrders } />} />

     

        <Route path="/order/confirm" element={<ProtectedRoute element={ConfirmOrder } />} />
        <Route path="/order/:id" element={<ProtectedRoute element={OrderDetails } />} />

        <Route  path="/admin/dashboard" element={<ProtectedRoute   isAdmin={true} element={Dashboard } />} />
    
        <Route  path="/admin/products" element={<ProtectedRoute   isAdmin={true} element={ProductList } />} />

        <Route  path="/admin/product" element={<ProtectedRoute   isAdmin={true} element={NewProduct } />} />

        <Route  path="/admin/product/:id" element={<ProtectedRoute   isAdmin={true} element={UpdateProduct } />} />

        <Route  path="/admin/orders" element={<ProtectedRoute   isAdmin={true} element={OrderList } />} />

        <Route  path="/admin/order/:id" element={<ProtectedRoute   isAdmin={true} element={ProcessOrder } />} />

        <Route  path="/admin/users" element={<ProtectedRoute   isAdmin={true} element={UsersList } />} />

        <Route  path="/admin/user/:id" element={<ProtectedRoute   isAdmin={true} element={UpdateUser } />} />

        <Route  path="/admin/reviews" element={<ProtectedRoute   isAdmin={true} element={ProductReviews } />} />

        {/* <Route
          component={
            window.location.pathname === "/process/payment" ? null : NotFound
          }
        /> */}
      </Routes>
      )}

      <Footer/>
    </Router>
  );
}

export default App;
