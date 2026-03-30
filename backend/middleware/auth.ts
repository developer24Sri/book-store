import jwt from "jsonwebtoken"
import type { NextFunction, Request, Response } from "express";
import User from "../models/userModel.ts";

interface TokenPayload {
    id: string
}

const JWT_SECRET = process.env.JWT_SECRET || "you_jwt_secret_hear";
// const TOKEN_EXPIRES = "24h";

interface UserReq extends Request {
    user?: any;
}

export default async function authMiddleWare(req: UserReq, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({
                success: false,
                message: "Not authorized, token missing"
            })
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
        const user = await User.findById(payload.id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error: ", error);
        return res.status(401).json({
            success: false,
            message: "Token invalid or expired."
        })
    }
}