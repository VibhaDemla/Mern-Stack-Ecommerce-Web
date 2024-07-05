import { ADD_TO_CART, REMOVE_CART_ITEM , SAVE_SHIPPING_INFO} from "../constants/cartConstants";



export const cartReducer = (state={cartItems: [], shippingInfo: {}},action)=>{
    switch(action.type){
        case ADD_TO_CART:
            const item = action.payload;
            const isItemexist = state.cartItems.find(
                (i) => i.product === item.product
            );

            if(isItemexist){
                return{
                    ...state,
                    cartItems: state.cartItems.map((i)=>
                        i.product === isItemexist.product ? item : i
                    ),
                };
            }else{
                return{
                    ...state,
                    cartItems: [...state.cartItems, item],

                }
            }

        case REMOVE_CART_ITEM:
            return{
                ...state,
                cartItems: state.cartItems.filter((i)=> i.product !== action.payload),
            }

        case SAVE_SHIPPING_INFO:
            return{
                ...state,
                shippingInfo:action.payload
            }
            default:
                return state;
    }
}