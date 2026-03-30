import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://vatsan24sri_db_user_bookStore:bookStore24pass@cluster0.6h1enc0.mongodb.net/?appName=Cluster0")
    .then(() => console.log("DB connected"))
    .catch((err) => console.error("MongoDB connection error:",err))
}

