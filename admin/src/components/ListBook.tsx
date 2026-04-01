import axios from "axios";
import { Filter, RatIcon, Star } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

const API_BASE = `http://localhost:4000`

const ListBook = () => {

    const [books, setBooks] = useState([]);
    const [filterCategory, setFilterCategory] = useState("All");
    const [sortConfig, setSortConfig] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //fetch book from server:
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data } = await axios.get(`${API_BASE}/api/book`)
                setBooks(data);
            } catch (error) {
                setError(error?.response?.message || "Failed to fetch Books.")
            }
            finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, []);

    //fetch category from the books:
    const category = useMemo(
        () => ["All", ...new Set(books.map((book) => book.category))],
        [books]
    )

    // Compute filtered and sorted list
    const displayedBooks = useMemo(() => {
        let filtered = books;
        if (filterCategory !== "All") {
            filtered = filtered.filter((book) => book.category === filterCategory);
        }

        if (sortConfig === "priceLowToHigh") {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
        } else if (sortConfig === "topRated") {
            filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        }

        return filtered;
    }, [books, filterCategory, sortConfig]);

    const tableHeaders = [
        { key: null, label: "Book" },
        { key: "author", label: "Author" },
        { key: null, label: "Category" },
        { key: "price", label: "Price" },
        { key: "rating", label: "Rating" },
        { key: null, label: "Actions" },
    ];

    //star rating:
    const RatingStar = ({ rating }) => (
        <div className="flex items-center">
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`h-4 w-4 ${i < Math.floor(rating)
                        ?
                        "text-amber-400 fill-amber-400"
                        :
                        "text-gray-300"}`}>
                        ★
                    </span>
                ))}
            </div>
            <span className="ml-1 text-sm text-gray-600">{rating.toFixed(2)}</span>
        </div>
    )

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-linear-to-r from-[#1A237E] to-[#43C6AC] bg-clip-text text-transparent">
                    Manage Book Inventory
                </h1>
                <p className="text-gray-600 mt-2">View, edit and manage your book collection</p>
            </div>
            {/* controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex gap-1">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-[#43C6AC] to-[#F8FFAE] rounded-lg blur opacity-0 group-hover:opacity-20" />
                            <div className="relative flex items-center">
                                <Filter className="absolute left-3 h-5 w-5 text-gray-400" />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="pl-10 pr-8 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-[#43C6AC]"
                                >
                                    {category.map((category) => (
                                        <option value={category} key={category}>
                                            {(category = "All" ? "All Category" : category)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* feedback */}
            {loading && <p>Loading books</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-linear-to-r from-[#1A237E] to-[#43C6AC] text-white">
                            <tr>
                                {tableHeaders.map((header) => (
                                    <th
                                        key={header.label}
                                        className="px-6 py-4 text-left cursor-pointer"
                                        onClick={() => header.key && setSortConfig(sortConfig === header.key ? " " : header.key)}
                                    >
                                        <div className="flex items-center">
                                            {header.label}
                                            {header.key && sortConfig === header.key && (
                                                <span className="ml-1">↑</span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {displayedBooks.map((book) => (
                                <tr key={book._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {book.image && (
                                                <img
                                                    src={`http://localhost:4000${book.image}`}
                                                    alt={book.title}
                                                    className="h-10 w-8 object-cover rounded"
                                                />
                                            )}
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {book.title}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {book.author}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                            {book.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {book.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        <RatingStar rating={book.rating} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ListBook