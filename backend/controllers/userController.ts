import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import userModel from "../models/userModel.ts";


// TOKEN Helper: Make sure to RETURN the sign function:
const JWT_SECRET = process.env.JWT_SECRET || "you_jwt_secret_hear";
const TOKEN_EXPIRES = "24h";

const createToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
}

// register function:
export async function registerUser(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required." })
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email"
        })
    }

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Password must be atleast 8 characters.F"
        })
    }
    try {
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exisits"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            name: username,
            email: email,
            password: hashedPassword
        })
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            message: "Account created Successfully",
            token,
            user: {
                id: user._id,
                username: user.name,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error occured."
        })
    }
}

// Login function:
export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email or password."
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            })
        }

        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            message: "User Logged in successfully",
            token,
            user: {
                id: user._id,
                username: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error occured."
        })
    }
}
