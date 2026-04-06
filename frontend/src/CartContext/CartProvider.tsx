// CartProvider.tsx
import { useReducer, useEffect, type ReactNode } from "react";
import axios from "axios";
import { CartContext, cartReducer, type CartItem, type CartState } from "./CartContext";


const STORAGE_KEY = "cartItems";

const getInitialCart = (): CartState => {
    if (typeof window === "undefined") return { items: [] };
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { items: JSON.parse(saved) } : { items: [] };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    // Explicitly casting the initial state to CartState fixes the 'unknown' error
    const [state, dispatch] = useReducer(cartReducer, { items: [] } as CartState, getInitialCart);

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;
            try {
                const { data } = await axios.get("http://localhost:4000/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const normalized: CartItem[] = data.cart.items.map((item: any) => ({
                    id: item.book._id,
                    title: item.book.title,
                    price: item.book.price,
                    author: item.book.author,
                    source: item.book.source,
                    quantity: item.quantity,
                }));
                dispatch({ type: "LOAD_CART", payload: normalized });
            } catch (err) { console.error("Failed to load cart:", err); }
        };
        fetchCart();
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    }, [state.items]);

    const addToCart = async (product: CartItem) => {
        const token = localStorage.getItem("authToken");
        // If it's 0, null, or undefined, use 1.
        const qty = (product.quantity && product.quantity > 0) ? product.quantity : 1;
        // 2. Log exactly what we are sending to compare with your Controller
        console.log("CartProvider: Sending to API", {
            bookId: product.id,
            quantity: qty
        });
        if (token) {
            try {
                await axios.post("http://localhost:4000/api/cart/add",
                    { bookId: product.id, quantity: qty },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err:any) { console.error("Server add failed:", err.response?.data?.message || err.message); }
        }
        dispatch({ type: "ADD_ITEM", payload: { ...product, quantity: qty } });
    };

    const updateCartItem = async ({ id, source, quantity }: { id: string | number; source?: string | number; quantity: number }) => {
        if (quantity <= 0) return removeFromCart({ id, source });
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                await axios.put("http://localhost:4000/api/cart/update",
                    { bookId: id, quantity },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) { console.error("Server update failed:", err); }
        }
        dispatch({ type: "UPDATE_ITEM", payload: { id, source, quantity } });
    };

    const removeFromCart = async ({ id, source }: { id: string | number; source?: string | number }) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                await axios.delete(`http://localhost:4000/api/cart/remove/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (err) { console.error("Server remove failed:", err); }
        }
        dispatch({ type: "REMOVE_ITEM", payload: { id, source } });
    };

    const clearCart = async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                await axios.delete("http://localhost:4000/api/cart/clear", {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } catch (err) { console.error("Server clear failed:", err); }
        }
        dispatch({ type: "CLEAR_CART" });
    };

    return (
        <CartContext.Provider value={{ state: state, addToCart, updateCartItem, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};