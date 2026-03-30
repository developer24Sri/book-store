import path from "path";
import fs from "fs";
import Book from "../models/bookModel.ts";
import type { Request, Response, NextFunction } from "express";

interface MulterReq extends Request {
    file?: any;
}

//create Book function:
export const createBook = async (req: MulterReq, res: Response, next: NextFunction) => {
    try {
        const filename = req.file?.filename ?? null;
        const imagePath = filename ? `uploads/${filename}` : null;
        const { title, author, price, rating, category, description } = req.body;

        const book = new Book({
            title,
            author,
            price,
            rating,
            category,
            description,
            image: imagePath
        });

        const saved = await book.save();
        res.status(201).json(saved);
    } catch (error) {
        next(error);
    }
}

// get Book function:
export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books)
    } catch (error) {
        next(error);
    }
}

// delete book function:
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found!" })
        }

        //image handler:
        if (book.image) {
            const filePath = path.join(process.cwd(), book.image);
            fs.unlink(filePath, (err) => {
                if (err) console.warn("Failed to delete the image file: ", err);
            })
        }
        res.json({ message: "Book Deleted successfully." })
    } catch (error) {
        next(error);
    }
}