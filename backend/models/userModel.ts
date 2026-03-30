import mongoose from "mongoose";

export interface IUser extends Document {
    _id: string,
    name: string,
    email: string,
    password: string,
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});


const userModel = mongoose.models.user || mongoose.model<IUser>("User", userSchema);
export default userModel;