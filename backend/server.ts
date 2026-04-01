import express from "express";
import cors from "cors";
import "dotenv/config";
import type { Request, Response } from "express";
import { connectDB } from "./config/db.ts";
import userRouter from "./routes/userRoute.ts";
import path from "path";
import { fileURLToPath } from "url";
import bookRouter from "./routes/bookRoute.ts";
import cartRouter from "./routes/cartRoute.ts";
import orderRouter from "./routes/orderRoute.ts";

const app = express();
const port = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Middleware:
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"] //first is for user second is for us admin
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    }, credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//DB:
connectDB();

//Routes:
app.get("/", (req: Request, res: Response) => {
    res.send("<h1>Bookstore Backend is running!</h1>")
})

app.use("/api/user", userRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use("/api/book", bookRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);



app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`)
})