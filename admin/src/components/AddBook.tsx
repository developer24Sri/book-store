import { useState } from "react";
import axios from "axios";
import { BookPlus, Star } from "lucide-react";

const AddBook = () => {

    const API_BASE = `http://localhost:4000`

    interface initialFormDataType {
        title?: string,
        author?: string,
        price?: string,
        image?: null | File,
        rating: number,
        category?: string,
        description?: string,
        preview?: string
    }

    interface MessageState {
        type: "success" | "error" | null,
        text: string | null
    }

    const initialFormData = {
        title: "",
        author: "",
        price: "",
        image: null,
        rating: 4,
        category: "Fiction",
        description: "",
        preview: "",
    };

    const categories = [
        "Fiction", "Non-Fiction", "Mystery", "Sci-Fi",
        "Biography", "Self-Help", "Thriller"
    ];

    const [formData, setFormData] = useState<initialFormDataType>(initialFormData);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState<MessageState>({ type: null, text: null })

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(false);
        setMessage({ type: null, text: null })

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key != "preview" && value !== null) payload.append(key, value);
        })

        try {
            await axios.post(`${API_BASE}/api/book`, payload);
            setMessage({ type: "success", text: "Book Added successfully." })
            setFormData(initialFormData);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("AddBooks error response:", error.response?.data, error);
                setMessage({
                    type: "error",
                    text: error.response?.data?.message || "Failed to add book."
                })
            } else {
                console.error("Unexpected error: ", error);
                setMessage({ type: "error", text: "An unexpected error occured!" })
            }
        }

        finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

    }

    //image handling:
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData(prev => ({
            ...prev,
            image: file,
            preview: URL.createObjectURL(file)
        }))

    }

    //star rating:
    const handleStarClick = (rating:number) => {
        setFormData(prev => ({
            ...prev, rating
        }))
    }

    return (
        <div className="min-h-screen pb-28 bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Add New Book
                        </h1>
                        <p className="text-gray-600 mt-1">Fill in the details to add an new book to the store.</p>
                    </div>
                </div>
                {/* form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Book Title
                            </label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter book Title"
                                required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Author
                            </label>
                            <input
                                name="author"
                                value={formData.author}
                                onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter author Title"
                                required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price (₹)
                            </label>
                            <input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter price"
                                required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(starValue => (
                                        <button
                                            key={starValue}
                                            type="button"
                                            onClick={() => handleStarClick(starValue)}
                                            onMouseEnter={() => setHoverRating(starValue)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            aria-label={`Rate ${starValue} star${starValue !== 1 ? "s" : ""} `}>
                                            <Star
                                                className={`w-5 h-5 ${(hoverRating || formData?.rating) >= starValue
                                                    ?
                                                    "text-amber-400 fill-amber-400"
                                                    :
                                                    "text-gray-300"
                                                    }`} />
                                        </button>
                                    ))}
                                </div>
                                <p className="ml-1 text-sm text-gray-600">
                                    {formData.rating} Star{formData.rating !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cover Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                        </div>
                        <div className="mb-6 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter Book description"
                            ></textarea>
                        </div>
                    </div>
                    {formData.preview && (
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Cover Preview
                            </h3>
                            <img src={formData.preview} alt="Image" className="w-full h-full object-cover" />
                        </div>
                    )}
                    {message.text && (
                        <p className={`text-${message.type === "success" ? "green" : "red"}-500`}>
                            {message.text}
                        </p>
                    )}
                    <div className="mt-8 flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 flex justify-center" >
                            <BookPlus className="w-5 h-5" />
                            <span>Add Book to Collections</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBook