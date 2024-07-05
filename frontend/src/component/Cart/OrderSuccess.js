import React from 'react'
import { Link } from 'react-router-dom'
import { Typography } from '@material-ui/core'
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import "./OrderSuccess.css";

const OrderSuccess = () => {
    return (
      <div className="orderSuccess">
        <CheckCircleIcon />
  
        <Typography>Your Order has been Placed successfully </Typography>
        <Link to="/orders">View Orders</Link>
      </div>
    );
  };
  
  export default OrderSuccess;