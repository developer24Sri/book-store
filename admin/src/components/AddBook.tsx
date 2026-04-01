import { useState } from "react";
import axios from "axios";

const AddBook = () => {

    const API_BASE = `http://localhost:4000`

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

    const [formData, setFormData] = useState(initialFormData);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState({ type: null, text: null })

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(false);
        setMessage({ type: null, text: null })

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key != "preview" && value !== null) payload.append(key, value);
        })

        try {
            await axios.post(`${API_BASE}/api/book`, payload);
            setMessage({ type: "Success", text: "Book Added successfully." })
            setFormData(initialFormData);
        } catch (error) {
            console.error("AddBooks error response:", error.response?.data, error);
            setMessage({
                type: "error",
                text: error.response?.data?.message || "Failed to add book."
            })
        }

        finally {
            setLoading(false);
        }
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
                                <input name="title" value={ } />
                            </label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddBook