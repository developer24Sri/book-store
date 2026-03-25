import { Minus, Plus, ShoppingCart, Star } from "lucide-react"
import { useCart } from "../CartContext/useCart"
import HB1 from "../assets/images/HB1.png"
import HB2 from "../assets/images/HB2.png"
import HB3 from "../assets/images/HB3.png"
import HB4 from "../assets/images/HB4.png"

const HomeBooks = () => {

    const { state, dispatch } = useCart();
    const inCart = (id: string | number) => state?.items?.find(item => item.id === id);

    const handleAdd = (book: any) => dispatch({ type: "ADD_ITEM", payload: { ...book, quantity: 1 } })
    const handleInc = (id: string | number) => dispatch({ type: "INCREMENT", payload: { id } })
    const handleDec = (id: string | number) => dispatch({ type: "DECREMENT", payload: { id } })

    const hbbooks = [
        { id: 101, title: 'Harry Potter', author: 'J.K. Rowling', price: 255.2, rating: 3, image: HB1 },
        { id: 102, title: 'Hygge', author: 'Meik Wiking', price: 289.2, rating: 4, image: HB2 },
        { id: 103, title: 'Fifty Shades Darker', author: 'E. L. James', price: 325.2, rating: 5, image: HB3 },
        { id: 104, title: 'The Two Towers', author: 'J.R.R. Tolkien', price: 425.2, rating: 4, image: HB4 },
    ]

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {hbbooks.map((book) => {
                            const item = inCart(book.id)
                            return (
                                <div key={book.id} className="group relative">
                                    <div className="relative h-72 overflow-hidden rounded-xl border-4 border-[#43C6AC]/20 mb-4">
                                        <img src={book.image} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-2 right-2 bg-white/90 px-3 py-1 rounded-full flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star className={`h-4 w-4 ${i < book.rating ? 'text-[#43C6AC] fill-[#43C6AC]' : 'text-gray-300'}`} key={i} />
                                            ))}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h3>
                                    <p className="text-gray-600 mb-3">{book.author} best author in this week</p>
                                    <span className="text-lg font-bold text-[#43C6AC]">
                                        ₹{book.price}
                                    </span>
                                    {item ? (
                                        <div className="flex items-center justify-between bg-[#43C6AC]/10 px-4 py-2 rounded-lg">
                                            <button onClick={() => handleDec(book.id)} className="text-[#1A237E] hover:text-[#43C6AC] p-1 md:p-1.5">
                                                    <Minus className="h-5 w-5" />
                                                </button>
                                                <span className="tex-gray-700">{item.quantity}</span>
                                                <button onClick={() => handleInc(book.id)} className="text-[#1A237E] hover:text-[#43C6AC] p-1 md:p-1.5">
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
                </div>
            </div>
        </div>
    )
}

export default HomeBooks