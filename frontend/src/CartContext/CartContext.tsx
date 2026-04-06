// CartContext.ts
import { createContext } from "react";

export interface CartItem {
    id: string | number;
    source?: string | number;
    quantity: number;
    title: string;
    author: string;
    price: number;
    image?: string | { default: string };
}

export interface CartState {
    items: CartItem[];
}

export type CartAction =
    | { type: "LOAD_CART"; payload: CartItem[] }
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "UPDATE_ITEM"; payload: { id: string | number; source?: string | number; quantity: number } }
    | { type: "REMOVE_ITEM"; payload: { id: string | number; source?: string | number } }
    | { type: "CLEAR_CART" };

export interface CartContextType {
    state: CartState;
    addToCart: (product: CartItem) => Promise<void>;
    updateCartItem: (params: { id: string | number; source?: string | number; quantity: number }) => Promise<void>;
    removeFromCart: (params: { id: string | number; source?: string | number }) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | null>(null);

export const cartReducer = (state: CartState, action: CartAction): CartState => {
    const isSameItem = (i: CartItem, payload: { id: string | number; source?: string | number }) =>
        i.id === payload.id && (i.source === payload.source || (!i.source && !payload.source));

    switch (action.type) {
        case "LOAD_CART": return { ...state, items: action.payload };

        case "ADD_ITEM": {
            const itemToAdd = { ...action.payload, quantity: action.payload.quantity || 1 };
            const exists = state.items.find(i => isSameItem(i, itemToAdd));
            if (exists) {
                return {
                    ...state,
                    items: state.items.map(i => isSameItem(i, itemToAdd) ? { ...i, quantity: i.quantity + itemToAdd.quantity } : i),
                };
            }
            return { ...state, items: [...state.items, itemToAdd] };
        }

        case "UPDATE_ITEM":
            return {
                ...state,
                items: state.items
                    .map(i => isSameItem(i, action.payload) ? { ...i, quantity: action.payload.quantity } : i)
                    .filter(i => i.quantity > 0),
            };

        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(i => !isSameItem(i, action.payload)),
            };

        case "CLEAR_CART": return { ...state, items: [] };

        default: return state;
    }
};