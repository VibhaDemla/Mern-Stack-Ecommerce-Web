import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import CheckoutSteps from "../Cart/CheckoutSteps.js";
import { useNavigate } from 'react-router-dom';
import SideBar from "./Sidebar";
import { getOrderDetails,clearErrors, updateOrder } from '../../actions/orderAction.js';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader/Loader.js';
import { useParams } from 'react-router-dom';
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import { Button } from "@material-ui/core";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants.js";
import "./processOrder.css";

const ProcessOrder = () => {

    const { order, error, loading } = useSelector((state) => state.orderDetails);    
    const { error: updateError, isUpdated } = useSelector((state) => state.order);
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const alert = useAlert();
    const { id } = useParams();  

    const [status, setStatus] = useState("");
    
    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
          }
          if (updateError) {
            alert.error(updateError);
            dispatch(clearErrors());
          }
          if (isUpdated) {
            alert.success("Order Updated Successfully");
            dispatch({ type: UPDATE_ORDER_RESET });
          }
  
       if (id) {
          dispatch(getOrderDetails(id));
  }
    }, [dispatch, alert,isUpdated, updateError, error, id]);
    
    const updateOrderSubmitHandler = (e) => {
        e.preventDefault();
    
        const myForm = new FormData();
    
        myForm.set("status", status);
    
        dispatch(updateOrder(id, myForm));
      };
    return (
      <Fragment>
         <MetaData title="Process Order" />
            <div className="dashboard">
                <SideBar />
                <div className="newProductContainer">
             {loading? <Loader/> :  <div className="confirmOrderPage"
             style={{
                display: order.orderStatus === "Delivered" ? "block" : "grid",
              }}
             >
                <div>
                    <div className='confirmshippingArea'>
                        <Typography>Shipping Info</Typography>
                        <div className="orderDetailsContainerBox">
                          <div>
                            <p>Name:</p>
                            <span>{order.user && order.user.name}</span>
                          </div>
                          <div>
                            <p>Phone:</p>
                            <span>
                              {order.shippingInfo && order.shippingInfo.phoneNo}
                            </span>
                          </div>
                          <div>
                            <p>Address:</p>
                            <span>
                              {order && order.shippingInfo &&
                                `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state}, ${order.shippingInfo.pinCode}, ${order.shippingInfo.country}`}
                            </span>
                          </div>
                        </div>

                <Typography>Payment</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p
                      className={
                        order.paymentInfo &&
                        order.paymentInfo.status === "succeeded"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order.paymentInfo &&
                      order.paymentInfo.status === "succeeded"
                        ? "PAID"
                        : "NOT PAID"}
                    </p>
                  </div>
  
                  <div>
                    <p>Amount:</p>
                    <span>{order.totalPrice && order.totalPrice}</span>
                  </div>
                </div>
  
                <Typography>Order Status</Typography>
                <div className="orderDetailsContainerBox">
                  <div>
                    <p
                      className={
                        order.orderStatus && order.orderStatus === "Delivered"
                          ? "greenColor"
                          : "redColor"
                      }
                    >
                      {order.orderStatus && order.orderStatus}
                    </p>
                  </div>
                </div>
              </div>
                  
                    <div className='confirmCartItems'>
                        <Typography>Your cart Items:</Typography>
                        <div className='confirmCartItemsContainer'>
                            {order.orderItems && order.orderItems.map((item) => (
                                <div key={item.product}>
                                    <img src={item.image} alt="Product" />
                                    <Link to={`/product/${item.product}`}>
                                    {item.name}
                                    </Link>
                                    <span>
                                        {item.quantity} X ₹{item.price} = <b>
                                            ₹{item.price * item.quantity}
                                        </b>
                                    </span>
                                </div>
                            ))}
                            
                        </div>
                    </div>
                </div>
                <div
                style={{
                  display: order.orderStatus === "Delivered" ? "none" : "block",
                }}
              >
            
                <form
                    className="createProductForm"
                    encType="multipart/form-data"
                    onSubmit={updateOrderSubmitHandler}
                >
                 <h1>Process Order</h1>


                 <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value="">Choose Category</option>
                      {order.orderStatus === "Processing" && (
                        <option value="Shipped">Shipped</option>
                      )}

                      {order.orderStatus === "Shipped" && (
                        <option value="Delivered">Delivered</option>
                      )}
                    </select>
                  </div>

            <Button
            id="createProductBtn"
            type="submit"
            disabled={loading ? true : false || status === "" ? true: false}
            >
            Update
            </Button>

              </form>
                </div>
            </div>}
           
                    </div>
                    </div>

                </Fragment>
       
           
       
  )
}


export default ProcessOrder