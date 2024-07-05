import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { newProductReducer, newReviewReducer, productDetailsReducer, productReducer, productsReducer,productReviewsReducer, reviewReducer} from "./reducers/productReducer";
import { userReducer, profileReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from "./reducers/userReducer.js";
import { cartReducer } from "./reducers/cartReducer.js";
import { allOrdersReducer, myOrdersReducer, newOrderReducer,orderDetailsReducer, orderReducer } from "./reducers/orderReducer.js";
import { loadState, saveState } from './localStorageUtils';

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    newProduct: newProductReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,
});

const persistedState = loadState();

const userId = localStorage.getItem('userId');
const cartItemsKey = userId ? `cartItems_${userId}` : 'cartItems_guest';
const shippingInfoKey = userId ? `shippingInfo_${userId}` : 'shippingInfo_guest';

let initialState = {
    cart: {
        cartItems: localStorage.getItem(cartItemsKey)
            ? JSON.parse(localStorage.getItem(cartItemsKey))
            : [],
        shippingInfo: localStorage.getItem(shippingInfoKey)
            ? JSON.parse(localStorage.getItem(shippingInfoKey))
            : {},
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;
