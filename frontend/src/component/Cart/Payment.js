import React ,{Fragment ,useEffect, useState, useRef}from 'react'
import {Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import CheckoutSteps from "../Cart/CheckoutSteps.js";
import { Typography } from '@material-ui/core'
import { useAlert } from 'react-alert'
import MetaData from '../layout/MetaData.js';
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
    } from '@stripe/react-stripe-js';
import axios from 'axios';
import "./payment.css";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import EventIcon from "@material-ui/icons/Event";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useNavigate } from 'react-router-dom';
import {createOrder,clearErrors} from "../../actions/orderAction.js";

const Payment = () => {

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))

    const dispatch = useDispatch()
    const alert = useAlert()
    const stripe = useStripe()
    const elements = useElements()
    const payBtn = useRef(null);
    const navigate = useNavigate();

    const {cartItems, shippingInfo} = useSelector((state) => state.cart)
    const { user } = useSelector((state) => state.user);
    const {error} = useSelector((state)=> state.newOrder);

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    }

    const order={
        shippingInfo,
        orderItems: cartItems,
        taxPrice: orderInfo.tax,
        itemsPrice: orderInfo.subtotal,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,

    }


    const submitHandler = async(e) => {
        e.preventDefault();
        if (payBtn.current) {
            payBtn.current.disabled = true;
        }

        try{
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    },
                };
                const {data} = await axios.post(
                    "/api/v1/payment/process",
                    paymentData,
                    config
                );
            const clientSecret = data.client_secret;

            if(!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,
                        }
                    }
                }
            });

            if (result.error) {
                if (payBtn.current) {
                    payBtn.current.disabled = false;
                }
                alert.error(result.error.message);
            }else{
                if(result.paymentIntent.status === "succeeded"){

                    order.paymentInfo={
                        id:result.paymentIntent.id,
                        status:result.paymentIntent.status
                    }
                    
                    dispatch(createOrder(order))
                    navigate("/success");

                }else{
                    alert.error("There.s some issue while processing payment");
                }
            }
        }catch(error){
            if (payBtn.current) {
                payBtn.current.disabled = false;
            }
            alert.error(error.response.data.message);
        }
    };

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

    },[dispatch,error,alert])

  return (
    <Fragment>
        <MetaData title="Payment" />
        <CheckoutSteps activeStep={2} />
        <div className="paymentContainer">
            <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
            <Typography>Card Info</Typography>
            <div>
                <CreditCardIcon />
                <CardNumberElement className="paymentInput" />
            </div>
            <div>
                <EventIcon />
                <CardExpiryElement className="paymentInput" />
            </div>
            <div>
                <VpnKeyIcon />
                <CardCvcElement className="paymentInput" />
            </div>

            <input
                type="submit"
                value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                className="paymentFormBtn"
                ref={payBtn}

            />

            </form>
        </div>
    </Fragment>
  )
}

export default Payment
