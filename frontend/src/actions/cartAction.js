import { ADD_TO_CART, REMOVE_CART_ITEM, SAVE_SHIPPING_INFO } from "../constants/cartConstants";
import axios from "axios";

// Add items to cart
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity,
        },
    });

    const userId = getState().user.user ? getState().user.user._id : 'guest';
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(getState().cart.cartItems));
};

// Remove items from cart
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: REMOVE_CART_ITEM,
        payload: id,
    });

    const userId = getState().user.user ? getState().user.user._id : 'guest';
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(getState().cart.cartItems));
}

// Save shipping info
export const saveShippingInfo = (data) => async (dispatch, getState) => {
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    const userId = getState().user.user ? getState().user.user._id : 'guest';
    localStorage.setItem(`shippingInfo_${userId}`, JSON.stringify(data));
}
