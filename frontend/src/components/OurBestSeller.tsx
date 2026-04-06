import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import type { Book } from "./Books";
import { useCart } from "../CartContext/useCart";

const API_BASE = "http://localhost:4000"


const OurBestSeller = () => {

    const scrollRef = useRef<HTMLDivElement>(null);
    const { state, addToCart, updateCartItem, removeFromCart } = useCart();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inCart = (id: string | number) => state?.items?.some(item => item.id === id);
    const getQty = (id: string | number) => state?.items?.find(item => item.id === id)?.quantity || 0;

    //fetch books from server:
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/api/book`);
                setBooks(Array.isArray(res.data) ? res.data : res.data.books || []);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Error fetching best books", error);
                    setError(error.message || "Failed to fetch books");
                }
            } finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, []);



    const handleAdd = (book: Book) => {
        addToCart({ id: book._id, source: "book-list", title: book.title, author: book.author, image: book.image, price: book.price, quantity: 1 });
    }
    const handleInc = (book: Book) => {
        const currentQty = getQty(book._id);
        const newQty = currentQty + 1;

        updateCartItem({
            id: book._id,
            source: "book-list",
            quantity: newQty
        })
    }
    const handleDec = (book: Book) => {
        const currentQty = getQty(book._id);
        if (currentQty <= 1) {
            // If it's 1 and we click minus, we should probably remove it
            removeFromCart({ id: book._id, source: "book-list" });
        } else {

            updateCartItem({
                id: book._id,
                source: "book-list",
                quantity: currentQty - 1
            })
        }
    }

    const scrollLeft = () => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })
    const scrollRight = () => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })

    if (loading) return <div className="">Loading Best sellers...</div>
    if (error) return <div className="">{error}</div>

    return (
        <section className="py-12 md:py-16 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                {/* header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4 md:gap-6">
                    <div className="space-y-1 md:space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            <span className="bg-linear-to-r from-[#1A237E] to-[#43C6AC] bg-clip-text text-transparent">
                                Curated Excellence
                            </span>
                        </h1>
                        <p className="text-gray-600 text-base md:text-lg">Top Rated by Our Readers</p>
                    </div>
                    {/* Carousel buttons */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="hidden md:block flex-1 border-t border-gray-200" />
                        <div className="flex items-center gap-2 md:gap-3">
                            <button onClick={scrollLeft} className="p-2 md:p-3 rounded-full bg-white shadow-md md:shadow-lg hover:shadow-lg transition-shadow">
                                <ChevronLeft size={20} className="text-[#1A237E]" />
                            </button>
                            <button onClick={scrollRight} className="p-2 md:p-3 rounded-full bg-white shadow-md md:shadow-lg hover:shadow-lg transition-shadow">
                                <ChevronRight size={20} className="text-[#1A237E]" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Books section */}
                <div className="flex overflow-x-auto gap-4 md:gap-8 pb-6 md:pb-8 scrollbar-hide scroll-smooth snap-x" ref={scrollRef}>
                    {books?.map((book: Book) => (
                        <div key={book._id} className={`shrink-0 w-[calc(100vw-2rem)] sm:w-96 md:w-100 rounded-2xl md:rounded-3xl overflow-hidden bg-linear-to-br ${book.cardBg} shadow-lg md:shadow-xl relative group transition-all duration-300 hover:shadow-xl md:hover:shadow-2xl snap-center`}>
                            <div className="p-6 md:p-8 pb-48 md:pb-60 flex flex-col justify-between h-full relative z-10">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center gap-1 md:gap-1.5">
                                        {[...Array(Math.floor(book.rating || 0))].map((_, i) => (
                                            <Star className="h-4 w-4 md:h-5 md:w-5 text-amber-400 fill-amber-400" key={i} />
                                        ))}
                                    </div>
                                    <div className="space-y-1.5 md:space-y-2">
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">{book.title}</h2>
                                        <p className="text-xs md:text-sm font-medium text-gray-600">{book.author}</p>
                                    </div>
                                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-3">{book.description}</p>
                                </div>
                                {/* Controls */}
                                <div className="flex flex-col gap-3 md:gap-4 mt-6 md:mt-8">
                                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                                        <span className="text-xl md:text-2xl font-bold text-gray-900">
                                            ₹{book.price.toFixed(2)}
                                        </span>
                                        {inCart(book._id) ? (
                                            <div className="flex items-center gap-3 md:gap-4 bg-white/90 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl shadow-sm">
                                                <button onClick={() => handleDec(book)} className="text-[#1A237E] hover:text-[#43C6AC] p-1 md:p-1.5">
                                                    <Minus size={18} />
                                                </button>
                                                <span className="text-gray-900 font-medium w-6 text-center">
                                                    {getQty(book._id)}
                                                </span>
                                                <button onClick={() => handleInc(book)} className="text-[#1A237E] hover:text-[#43C6AC] p-1 md:p-1.5">
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleAdd(book)} className="flex items-center gap-1.5 md:gap-2 px-4 md:px-6 py-2 md:py-3 bg-linear-to-r from-[#1A237E] to-[#43C6AC] text-white rounded-lg md:rounded-xl font-medium hover:scale-[1.02] transition-transform text-sm md:text-base">
                                                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                                                <span>Add to Collections</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <img src={book?.image?.startsWith('http') ? book.image : `${API_BASE}/${book.image}`} alt={book.title} className="absolute right-4 md:right-6 bottom-4 md:bottom-6 w-20 h-28 md:w-30 md:h-45 object-cover rounded-lg md:rounded-xl border-2 md:border-4 border-white shadow-xl md:shadow-2xl transform group-hover:-translate-y-1 md:group-hover:-translate-y-2 transition-transform" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default OurBestSeller