import express from "express";
import authMiddleWare from "../middleware/auth.ts";
import { addToCart, clearUserCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController.ts";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleWare, addToCart);
cartRouter.get("/", authMiddleWare, getCart);
cartRouter.put("/update", authMiddleWare, updateCartItem);
cartRouter.delete("/remove/:bookId", authMiddleWare, removeCartItem);
cartRouter.delete("/clear", authMiddleWare, clearUserCart);

export default cartRouter;



