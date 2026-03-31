import Order from "../models/orderModel.ts";
import Book from "../models/bookModel.ts";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import type { Request, Response, NextFunction } from "express"

interface UserReq extends Request {
    user?: any;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// create a order:
export const createOrder = async (req: UserReq, res: Response, next: NextFunction) => {
    try {
        const { customer, items, paymentMethod, notes, deliveryDate } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Invalid or empty items array."
            })
        }

        const normalizedPM = ["Cash on Delivery", "Online Payment"].includes(paymentMethod)
            ? paymentMethod
            : "Online Payment";

        const orderId = `ORD-${uuidv4()}`; //unique orderID

        // Calculate amounts
        const totalAmount = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
        const taxAmount = +((totalAmount * 0.05).toFixed(2));
        const shippingCharge = 0;

        // 4. Map customer → shippingAddress
        const shippingAddress = {
            fullName: customer.name,
            email: customer.email,
            phoneNumber: customer.phone,
            street: customer.address.street,
            city: customer.address.city,
            state: customer.address.state,
            zipCode: customer.address.zip,
        };

        const orderItems = await Promise.all(items.map(async (i) => {
            const bookDoc = await Book.findById(i.id).lean();

            if (!bookDoc) {
                const err: any = new Error(`Book not found: ${i.id}`);
                err.status = 400;
                throw err;
            }

            return {
                book: bookDoc._id,
                title: bookDoc.title,
                author: bookDoc.author,
                image: bookDoc.image,
                price: Number(i.price),
                quantity: Number(i.quantity),
            };

            //fine data of books:

        }))


        // Base payload
        const baseOrderData = {
            orderId,
            user: req.user._id,
            shippingAddress,
            books: orderItems,
            shippingCharge,
            totalAmount,
            taxAmount,
            paymentMethod: normalizedPM,
            notes,
            deliveryDate,
        };

        //online payment:
        if (normalizedPM === "Online Payment") {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: items.map(o => ({
                    price_data: {
                        currency: "inr",
                        product_data: { name: o.name },
                        unit_amount: Math.round(o.price * 100),
                    },
                    quantity: o.quantity,
                })),
                customer_email: customer.email,
                success_url: `${process.env.FRONTEND_URL}/orders/verify?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
                metadata: { orderId },
            });

            const newOrder = new Order({
                ...baseOrderData,
                paymentStatus: "Unpaid",
                sessionId: session.id,
                paymentIntentId: session.payment_intent,
            })

            await newOrder.save();
            return res.status(201).json({
                order: newOrder,
                checkoutUrl: session.url
            })
        }

        // COD:
        const newOrder = new Order({
            ...baseOrderData,

        });

        await newOrder.save();
        return res.status(201).json({
            order: newOrder,
            checkoutUrl: null
        })

    } catch (error) {
        next(error)
    }
}

// confirm Stripe payment:
export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const session_id = req.query.session_id as string;
        if (!session_id) {
            return res.status(400).json({
                message: "session_id required!"
            })
        }
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status !== "paid") {
            return res.status(400).json({
                message: "Payment not completed."
            })
        }
        const order = await Order.findOneAndUpdate({
            sessionId: session_id
        },
            { paymentStatus: "Paid" },
            { new: true })
        if (!order) {
            return res.status(404).json({
                message: "Order not found."
            })
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
}

//get all orders:
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search = "", status }: any = req.query;
        const filter: any = {};

        if (status) filter.orderStatus = status;

        if (search) {
            const regex = new RegExp(search, 'i');
            filter.$or = [
                { orderId: regex },
                { 'shippingAddress.fullName': regex },
                { 'shippingAddress.email': regex },
                { 'books.title': regex }
            ];
        }

        // Fetch matching orders, newest first
        const orders = await Order.find(filter)
            .sort({ placedAt: -1 })
            .lean();

        //compute aggregate count:
        const counts = orders.reduce((acc, o) => {
            acc.totalOrders = (acc.totalOrders || 0) + 1;
            acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
            if (o.paymentStatus === 'Unpaid') {
                acc.pendingPayment = (acc.pendingPayment || 0) + 1;
            }
            return acc;
        }, { totalOrders: 0, pendingPayment: 0 });

        res.json({

            counts: {
                totalOrders: counts.totalOrders,
                pending: counts.Pending || 0,
                processing: counts.Processing || 0,
                shipped: counts.Shipped || 0,
                delivered: counts.Delivered || 0,
                cancelled: counts.Cancelled || 0,
                pendingPayment: counts.pendingPayment
            },
            orders
        });

    } catch (error) {
        next(error);
    }
}

//get orders by id:
export const getOrderByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const order = await Order.findById(req.params.id).lean();
        if (!order) {
            return res.status(404).json({
                message: "Order not found!"
            })
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
}


//get user order:
export const getUserOrder = async (req: UserReq, res: Response) => {
    try {
        const orders = await Order
            .find({ user: req.user._id })
            .populate("books.book")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error(`Get user orders error:`, error);
        res.status(500).json({ error: "Failed to fetch user orders" });
    }
}

//update order:
export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allowed = ["orderStatus", "paymentStatus", "deliveryDate", "notes"];
        const updateData: any = {};
        allowed.forEach(field => {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        })
        const updated = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).lean();
        if (!updated) {
            return res.status(404).json({
                message: "Order not found"
            })
        }
        res.json(updated);
    } catch (error) {
        next(error);
    }
}

//delete method:
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Order.findByIdAndDelete(req.params.id).lean();
        if (!deleted) {
            return res.status(404).json({
                message: "Order not found."
            })
        }
        res.json({ message: "Order deleted successfully!" })
    } catch (error) {
        next(error);
    }
}



