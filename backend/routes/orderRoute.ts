import express from "express"
import authMiddleWare from "../middleware/auth.ts"
import { confirmPayment, createOrder, deleteOrder, getOrderByID, getOrders, getUserOrder, updateOrder } from "../controllers/orderController.ts";

const orderRouter = express.Router();

//protected routes:
orderRouter.post("/", authMiddleWare, createOrder);
orderRouter.get("/confirm", authMiddleWare, confirmPayment);

//public routes:
orderRouter.get("/", getOrders);
orderRouter.get("/user", authMiddleWare, getUserOrder);
orderRouter.get("/:id", getOrderByID);
orderRouter.put("/:id", updateOrder);
orderRouter.delete("/:id", deleteOrder);

export default orderRouter;