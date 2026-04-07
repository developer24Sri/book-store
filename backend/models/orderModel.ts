import mongoose, { Document, Schema } from "mongoose";

// 1. Base interface for the DATA
export interface IOrder {
    _id: any; // We keep it 'any' or 'string' for the React Frontend's sake
    orderId: string;
    user: mongoose.Types.ObjectId;
    shippingAddress: {
        fullName: string;
        email: string;
        phoneNumber: string;
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    book: Array<{
        book: mongoose.Types.ObjectId;
        title: string;
        author: string;
        image?: string;
        price: number;
        quantity: number;
    }>;
    shippingCharge: number;
    totalAmount: number;
    taxAmount: number;
    finalAmount: number;
    paymentMethod: "Online Payment" | "Cash on Delivery";
    paymentStatus: "Unpaid" | "Paid";
    orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
    placedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// 2. The Document interface for MONGOOSE
// We use Omit to remove the conflicting _id from IOrder before merging
export interface IOrderDocument extends Omit<IOrder, "_id">, Document { }

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
}, { _id: false });

const itemSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shippingAddress: {
        type: addressSchema,
        required: true,
    },
    book: [itemSchema],

    shippingCharge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },

    paymentMethod: {
        type: String,
        enum: ["Online Payment", "Cash on Delivery"],
        required: true,
    },

    paymentStatus: {
        type: String,
        enum: ["Unpaid", "Paid"],
        default: "Unpaid",
    },

    sessionId: { type: String }, //online
    paymentIntentId: { type: String },

    notes: { type: String },
    deliveryDate: { type: Date },

    orderStatus: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },

    deliveredAt: { type: Date },
    placedAt: { type: Date, default: Date.now },
}, { timestamps: true });

orderSchema.pre<IOrder>("save", async function () {
    if (this.totalAmount != null && this.taxAmount != null) {
        this.finalAmount = this.totalAmount + this.taxAmount + (this.shippingCharge || 0);
    }
})

// Use IOrderDocument here
orderSchema.pre<IOrderDocument>("save", async function () {
    if (this.totalAmount != null && this.taxAmount != null) {
        this.finalAmount = this.totalAmount + this.taxAmount + (this.shippingCharge || 0);
    }
});

const Order = mongoose.models.Order || mongoose.model<IOrderDocument>("Order", orderSchema);
export default Order;