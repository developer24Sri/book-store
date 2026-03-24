import { useEffect, useReducer, type ReactNode } from "react"
import {CartContext, cartReducer, loadInitalState} from "./CartContext";

export const CartProvider = ({ children }: {children: ReactNode}) => {
    const [state, dispatch] = useReducer(cartReducer, {items: []}, loadInitalState)

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state))
    }, [state])

    return <CartContext.Provider value={{ state, dispatch }}>
        {children}
    </CartContext.Provider>
}

