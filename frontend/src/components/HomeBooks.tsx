import { ArrowRight, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { useCart } from "../CartContext/useCart"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import type { Book } from "./Books"

const API_BASE = "http://localhost:4000"

const HomeBooks = () => {


    const { state, addToCart, updateCartItem, removeFromCart } = useCart();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inCart = (id: string | number) => state?.items?.some(item => item.id === id);
    const getQty = (id: string | number) => state?.items?.find(item => item.id === id)?.quantity || 0;

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/api/book`);
                const list = Array.isArray(res.data) ? res.data : res.data.books || [];
                setBooks(list);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Error fetching best books", error);
                    setError(error.message || "Failed to load books");
                }
            }
            finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, [])

    const handleAdd = (book: Book) => {
        addToCart({ id: book._id, source: "book-list", title: book.title, author: book.author, image: book.image, price: book.price, quantity: 1 });
    }
    const handleInc = (book: Book) => {
        const newQty = getQty(book._id) + 1;
        updateCartItem({
            id: book._id,
            source: "book-list",
            quantity: newQty
        });
    }
    const handleDec = (book: Book) => {
        const currentQty = getQty(book._id);
        if (currentQty <= 1) {
            removeFromCart({ id: book._id, source: "book-list" });
        } else {
            updateCartItem({
                id: book._id,
                source: "book-list",
                quantity: currentQty - 1
            });
        }
    }

    if (loading) return <div className="">Loading Books...</div>
    if (error) return <div className="">{error}</div>

    return (
        <div className="py-20 bg-linear-to-br from-[#43C6AC] to-[#F8FFAE] relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-[#43C6AC] to-[#2B5876] bg-clip-text text-transparent mb-4">
                            Bookseller Favorites
                        </h2>
                        <div className="h-1 w-20 bg-linear-to-r from-[#43C6AC] to-[#F8FFAE] rounded-full mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:lg:grid-cols-4 gap-8">
                        {books.map((book) => {
                            const itemInCart = inCart(book._id)
                            return (
                                <div key={book._id} className="group grid grid-rows-[18rem_auto_1fr_auto_auto] gap-2 relative p-4 border rounded-2xl">
                                    <div className="relative h-72 overflow-hidden rounded-xl border-4 border-[#43C6AC]/20 mb-4">
                                        <img src={book?.image?.startsWith("http") ? book.image : `${API_BASE}/${book.image}`} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star className={`h-4 w-4 ${i < Math.floor(book.rating || 0) ? 'text-[#43C6AC] fill-[#43C6AC]' : 'text-gray-300'}`} key={i} />
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                                    <p className="text-gray-600 mb-3">{book.author} </p>
                                    <span className="text-lg font-bold text-[#43C6AC]">
                                        ₹{book.price.toFixed(2)}
                                    </span>
                                    {itemInCart ? (
                                        <div className="flex items-center justify-between bg-[#43C6AC]/10 px-4 py-2 rounded-lg">
                                            <button onClick={() => handleDec(book)} className="text-[#1A237E] hover:text-[#43C6AC] p-1 md:p-1.5">
                                                <Minus className="h-5 w-5" />
                                            </button>
                                            <span className="tex-gray-700">{getQty(book._id)}</span>
                                            <button onClick={() => handleInc(book)} className="text-[#1A237E] hover:text-[#43C6AC] p-1 md:p-1.5">
                                                <Plus className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleAdd(book)} className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-2 bg-linear-to-r from-[#43C6AC] to-[#F8FFAE] text-black rounded-lg hover:shadow-lg transition-all">
                                            <ShoppingCart className="h-5 w-5" />
                                            <span>Add to Cart</span>
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-center mt-12">
                        <Link to='/books' className="group inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-[#43C6AC] text-[#43C6AC] hover:bg-[#43C6AC]/10 transition-all">
                            <span>View All Books</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeBooks