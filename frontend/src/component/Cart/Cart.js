import React ,{Fragment}from 'react'
import "./Cart.css";
import CartItemCard from "./CartItemcard.js";
import { useSelector,useDispatch } from 'react-redux';
import { addItemsToCart , removeItemsFromCart} from '../../actions/cartAction.js';
import { Typography } from '@material-ui/core';
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const dispatch =  useDispatch();
    const navigate = useNavigate();
    const {cartItems} = useSelector((state) => state.cart)
    const { isAuthenticated } = useSelector((state) => state.user);

    const increaseQuantity = (id,quantity,stock) => {
        const newQty = quantity+1;
        if(stock <= quantity){
            return
        }
        dispatch(addItemsToCart(id,newQty));
    }

    const decreaseQuantity = (id,quantity) => {
        const newQty = quantity-1;
        if(1 >= quantity){
            return
        }
        dispatch(addItemsToCart(id,newQty));
    }
    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id));
    }
    
    const checkOutHandler = () => {
        if (isAuthenticated) {
            navigate("/shipping");
        } else {
            navigate("/login?redirect=shipping");
        }
    }
  return (
    <Fragment>
        {cartItems.length === 0 ? (
            <div className='emptyCart'>
                <RemoveShoppingCartIcon />

                <Typography>No product in your cart!!</Typography>
                <Link to="/products">View Products</Link>
        </div>
    ) : (
    
    <Fragment>
        <div className='cartPage'>
            <div className='cartHeader'>
                <p>Product</p>
                <p>Quantity</p>
                <p>Subtotal</p>
            </div>

            {cartItems && cartItems.map((item)=>(
                // key mein item ki id di hai bcz that is unique and we know this product means id
                <div className='cartContainer' key={item.product}> 
                {/* props */}
                <CartItemCard item={item} deleteCartItems={deleteCartItems}/>
                <div className='cartInput'>
                    <button onClick={()=>
                        decreaseQuantity(item.product,item.quantity)
                    }>-</button>
                    <input type="number" value={item.quantity} readOnly/>
                    <button onClick={()=>
                        increaseQuantity(item.product,item.quantity,item.stock)
                    }>+</button>
                </div>   
                <p className='cartSubtotal'>{`₹${item.price * item.quantity}`}</p>
            </div>
))}
            

            <div className='cartGrossProfit'>
                <div></div>
                <div className='cartGrossProfitBox'>
                    <p>Gross Total</p>
                    <p>{`₹${cartItems.reduce(
                                    // (for each object + this function)
                        (acc,item)=>acc + item.quantity*item.price,
                        0
                    )}`}</p>
                </div>
                <div></div>
                <div className='checkOutBtn'>
                    <button onClick={checkOutHandler}>Check Out</button>
                </div>
            </div>
        </div>
    </Fragment>
    )}
    </Fragment>
  )
}

export default Cart
