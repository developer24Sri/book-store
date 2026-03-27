import { createContext, type Dispatch } from "react"

// defining the shape of an single item:
export interface CartItem {
    id: number,
    source: string | number,
    quantity: number,
    title: string,
    author: string,
    price: number,
    image: string | { default: string },
}

// defining the state shape:
interface CartState {
    items: CartItem[];
}

// define the action types(Discriminated union):
type CartAction =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "INCREMENT"; payload: { id: string | number; source?: string | number } }
    | { type: "DECREMENT"; payload: { id: string | number; source?: string | number } }
    | { type: "REMOVE_ITEM"; payload: { id: string | number; source?: string | number } }

export interface CartContextType {
    state: CartState,
    dispatch: Dispatch<CartAction>
}

export const CartContext = createContext<CartContextType | null>(null);

export const loadInitalState = (): CartState => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("cart");

        try {
            const parsed = saved ? JSON.parse(saved) : null
            if (parsed && Array.isArray(parsed.items)) return parsed
            return { items: [] }
        } catch {
            return { items: [] }
        }
    }
    return { items: [] }
}

export const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case "ADD_ITEM": {
            const itemToAdd = { ...action.payload, quantity: action.payload.quantity || 1 }
            const exists = state.items.find(
                (i) => i.id === itemToAdd.id && i.source === itemToAdd.source
            );
            if (exists) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.id === itemToAdd.id && i.source === itemToAdd.source
                            ? { ...i, quantity: i.quantity + itemToAdd.quantity }
                            : i
                    ),
                };
            }
            return { ...state, items: [...state.items, itemToAdd] }
        }

        case "INCREMENT":
            return {
                ...state,
                items: state.items.map((i) =>
                    // Check if IDs match AND sources match
                    i.id === action.payload.id && i.source === action.payload.source
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                ),
            };

        case "DECREMENT":
            return {
                ...state,
                items: state.items
                    .map((i) =>
                        i.id === action.payload.id && i.source === action.payload.source
                            ? { ...i, quantity: i.quantity - 1 }
                            : i,
                    )
                    .filter((i) => i.quantity > 0)
            }

        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter(
                    (i) => !(i.id === action.payload.id &&
                        i.source === action.payload.source
                    ),
                )
            }

        default:
            return state
    }

}

