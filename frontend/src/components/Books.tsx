import { useCart } from "../CartContext/useCart";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Minus, Plus, Search, ShoppingBag, Star } from "lucide-react";
import BP1 from "../assets/images/BP1.png";
import BP2 from "../assets/images/BP2.png";
import BP3 from "../assets/images/BP3.png";
import BP4 from "../assets/images/BP4.png";
import BP5 from "../assets/images/BP5.png";
import BP6 from "../assets/images/BP6.png";
import BP7 from "../assets/images/BP7.png";
import BP8 from "../assets/images/BP8.png";
import BP9 from "../assets/images/BP9.png";
import BP10 from "../assets/images/BP10.png";
import BP11 from "../assets/images/BP11.png";
import BP12 from "../assets/images/BP12.png";
import BP13 from "../assets/images/BP13.png";
import BP14 from "../assets/images/BP14.png";
import BP15 from "../assets/images/BP15.png";
import BP16 from "../assets/images/BP16.png";

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
  description: string;
}

const Books = () => {

  const { state, dispatch } = useCart();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const searchFromURL = queryParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchFromURL);
  const [sortBy, setSortBy] = useState("title");
  const [filterCategory, setFilterCategory] = useState("all");

  const books = [
    { id: 1, image: BP1, title: "The Silent Echo", author: "Sarah Mitchell", price: 205, rating: 4.5, category: "Mystery", description: "A haunting tale of secrets and revelations that echo through time." },
    { id: 2, image: BP2, title: "Digital Fortress", author: "James Cooper", price: 190, rating: 4.2, category: "Thriller", description: "In the age of digital warfare, no secret is safe from discovery." },
    { id: 3, image: BP3, title: "The Last Orbit", author: "Emily Zhang", price: 202, rating: 4.7, category: "Sci-Fi", description: "Humanity's final journey among the stars holds unexpected truths." },
    { id: 4, image: BP4, title: "Beyond the Stars", author: "Michael Chen", price: 209, rating: 4.3, category: "Sci-Fi", description: "An epic space odyssey that challenges our understanding of existence." },
    { id: 5, image: BP5, title: "Mystic River", author: "Dennis Lehane", price: 180, rating: 4.8, category: "Drama", description: "A powerful story of friendship, trauma, and the price of secrets." },
    { id: 6, image: BP6, title: "The Alchemist", author: "Paulo Coelho", price: 160, rating: 4.9, category: "Philosophy", description: "A mystical journey of self-discovery and the pursuit of dreams." },
    { id: 7, image: BP7, title: "Atomic Habits", author: "James Clear", price: 203, rating: 4.6, category: "Self-Help", description: "Transform your life through the power of tiny, consistent changes." },
    { id: 8, image: BP8, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", price: 219, rating: 4.4, category: "Psychology", description: "Explore the two systems that drive the way we think and make decisions." },
    { id: 9, title: "The Design Of Books", author: "Debbie Bern", price: 379, description: "A Gothic tale of science gone wrong and its consequences...", image: BP9 },
    { id: 10, title: "The Crossing", author: "Jason Mott", price: 425, description: "A psychological exploration of guilt and redemption...", image: BP10 },
    { id: 11, title: "The Phoenix Of Destiny", author: "Geronimo Stilton", price: 499, description: "A fantasy adventure through Middle-earth...", image: BP11 },
    { id: 12, title: "The Author", author: "Raj Siddhi", price: 399, description: "A dystopian vision of a scientifically engineered society...", image: BP12 },
    { id: 13, title: "The Doctor", author: "Oscar Patton", price: 549, description: "An epic journey through Hell, Purgatory, and Paradise...", image: BP13 },
    { id: 14, title: "Darkness Gathers", author: "Emma Elliot", price: 325, description: "A turbulent story of passion and revenge on the Yorkshire moors...", image: BP14 },
    { id: 15, title: "Gitanjali", author: "RabindraNath Tagore", price: 449, description: "The epic poem about the Trojan War and Achilles' rage...", image: BP15 },
    { id: 16, title: "The Unwilling", author: "John Hart", price: 399, description: "The adventures of a nobleman who imagines himself a knight...", image: BP16 }
  ]

  const isInCart = (id: string | number) => state?.items?.some(item => item.id === id && item.source === "booksPage");
  const getCartQty = (id: string | number) => state?.items?.find(item => item.id === id && item.source === "booksPage")?.quantity || 0;

  const handleAddToCart = (book: Book) => dispatch({ type: "ADD_ITEM", payload: { ...book, quantity: 1, source: "booksPage" } })
  const handleIncrement = (id: string | number) => dispatch({ type: "INCREMENT", payload: { id, source: "booksPage" } })
  const handleDecrement = (id: string | number) => dispatch({ type: "DECREMENT", payload: { id, source: "booksPage" } })

  const filteredBook = books.filter(book => {
    const matchCategory = filterCategory === "all" || book.category === filterCategory;
    const lowerSearch = searchTerm.toLowerCase();
    const matchSearch = searchTerm === "" || book.title.toLowerCase().includes(lowerSearch) || book.author.toLowerCase().includes(lowerSearch);
    return matchCategory && matchSearch;
  })

  const sortedBooks = [...filteredBook].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      case "rating": return (b.rating ?? 0) - (a.rating ?? 0)
      default: return a.title.localeCompare(b.title, undefined, { sensitivity: "base", numeric: true })
    }
  })

  const categories = ["all", ...new Set(books.map(book => book.category).filter(Boolean))]


  return (
    <div className="min-h-screen pt-24 pb-16 bg-linear-to-br from-[#f8fafc] to-[#f0fdfa]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 md:mb-16 space-y-2 md:space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent pb-2 md:pb-4 bg-clip-text bg-linear-to-r from-[#1A237E] to-[#43C6AC]">
            Literary Universe
          </h2>
          <p className="text-gray-600 text-base md:text-xl max-w-3xl mx-auto px-2">
            Explore our curated collection spannng geners and perspectives
          </p>
        </div>
        <div className="mb-8 md:mb-12 space-y-4 md:space-y-6">
          <div className="relative group">
            <div className="absolute top-0 bottom-0 left-0 flex items-center pl-4 md:pl-5">
              <Search className="h-5 w-5 md:w-6 text-gray-400 group-focus-within:text-[#43C6Ac]" />
            </div>
            <input
              type="text"
              placeholder="Search Titles, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-4 bg-white/90 backdrop-blur-sm border-0 rounded-xl md:rounded-2xl shadow-md md:shadow-lg focus:ring-2 focus:ring-[#43C6AC]/30 text-base md:text-lg placeholder-gray-400 text-gray-700 transition-all"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
              <select value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-auto px-4 md:px-5 py-2 md:py-3 bg-white/90 backdrop-blur-sm border-0 rounded-lg md:rounded-xl shadow-md md:shadow-lg text-gray-700 focus:ring-2 focus:ring-[#43C6AC]/30 text-sm md:text-base">
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category === "all" ? "All Genres" : category}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full md:w-auto px-4 md:px-5 py-2 md:py-3 bg-white/90 backdrop-blur-sm border-0 rounded-lg md:rounded-xl shadow-md md:shadow-lg text-gray-700 focus:ring-2 focus:ring-[#43C6AC]/30 text-sm md:text-base"
              >
                <option value="title">Sort by title</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
            <div className="text-gray-600 text-sm md:text-base text-center md:text-left mt-2 md:mt-0">
              Showing {sortedBooks.length} results
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedBooks.map(book => {
            const inCart = isInCart(book.id);
            const qty = getCartQty(book.id)

            return (
              <div className="group bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-square mb-4 md:mb-6 overflow-hidden rounded-lg md:rounded-xl">
                  <img src={book.image} alt={book.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 md:mb-3">{book.author}</p>
                <div className="flex items-center gap-1 text-yellow-400 text-sm mb-2 md:mb-3">
                  {[...Array(Math.floor(book.rating ?? 0))].map((_, i) => (
                    <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" key={`${book.id}-star${i}`} />
                  ))}
                  <span>({Number.isFinite(book.rating) ? book.rating?.toFixed(1) : "N/A"})</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {book.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-base md:text-lg font-bold text-[#1A237E]">
                    ₹{book.price.toFixed(2)}
                  </span>
                  <div className="flex cursor-pointer items-center gap-1 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-linear-to-r from-[#1A237E] to-[#43C6AC] text-white rounded-lg md:rounded-xl text-sm md:text-base font-medium hover:shadow-md hover:scale-[1.02] transition-all">
                    {!inCart ? (
                      <button onClick={() => handleAddToCart(book)}>
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDecrement(book.id)}>
                          <Minus className="w-4 h-4 text-white" />
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => handleIncrement(book.id)}>
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Books