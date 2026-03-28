import { AlertCircle, CheckCircle, Mail, MapPin, MessageSquare, Phone, Send, User } from "lucide-react";
import React, { useState } from "react"

interface newErrors {
    name?: string,
    email?: string,
    message?: string,
    [key: string]: string | undefined;
}

interface ContactFormData {
    name: string,
    email: string,
    phone: string,
    subject: string,
    message: string
}

const Contact = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })


    const [errors, setErrors] = useState<newErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: "", type: "info" })
    const optional = "(Optional)"; // Define it here

    const validateForm = () => {
        const newErrors: newErrors = {}
        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (!formData.message.trim()) newErrors.message = "Message is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // function submit data and redirect to what'sup web with the data,
    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) return;
        const whatsappNumber = "9080100325";
        const textLines = [
            `Name: ${formData.name}`,
            `Email: ${formData.email}`,
            formData.phone && `Phone: ${formData.phone}`,
            formData.subject && `Subject: ${formData.subject}`,
            `Message: ${formData.message}`,
        ].filter(Boolean)
        const text = textLines.join("\n")

        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`

        window.open(url, "_blank");
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        })
        setErrors({});

    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
    }

    return (
        <>
            <div className="py-16 pt-24 bg-gray-50 min-h-screen relative">
                {toast.visible && (
                    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-md text-white flex items-center shadow-lg ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}>
                        {toast.type === "success" ? (
                            <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                            <AlertCircle className="h-5 w-5 mr-2" />
                        )}
                        <span>{toast.message}</span>
                    </div>
                )}
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Have questions or feedback ? We'd love to hear from you
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-700 mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <MapPin className="h-6 w-6 text-[#43C6AC]" />
                                    <div>
                                        <h3 className="font-medium text-gray-800 mb-1">Our Location</h3>
                                        <p className="text-gray-600">123 Book Street, Library City, CH 600014</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <Mail className="h-6 w-6 text-[#43C6AC]" />
                                    <div>
                                        <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                                        <p className="text-gray-600">example@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <Phone className="h-6 w-6 text-[#43C6AC]" />
                                    <div>
                                        <h3 className="font-medium text-gray-800 mb-1">Call Us</h3>
                                        <p className="text-gray-600">+91 9080100325</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* form */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-700 mb-6">Send us an message via whatsApp</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {["name", "email"].map((field) => (
                                        <div className="space-y-2" key={field}>
                                            <label className="block text-sm font-medium text-gray-700">
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                                <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                {field === "name" ?
                                                    (
                                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                    )}
                                                <input
                                                    type={field === "email" ? "email" : "text"}
                                                    name={field}
                                                    value={formData[field as keyof ContactFormData]}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#43C6AC] focus:border-[#43C6AC] text-gray-700"

                                                />
                                                {errors[field] && <p className="text-sm text-red-500 mt-1">{errors[field]}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone <span className="text-gray-500">{optional}</span>
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#43C6AC] focus:border-[#43C6AC] text-gray-700" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Subject <span className="text-gray-500">{optional}</span>
                                        </label>
                                        <input
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#43C6AC] focus:border-[#43C6AC] text-gray-700" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#43C6AC] focus:border-[#43C6AC] text-gray-700 resize-none"
                                        />
                                        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>
                                        }

                                    </div>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center bg-[#43C6AC] hover:bg-[#36b39f] text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <div className="flex items-center">
                                        <Send className="w-5 h-5 mr-2" />
                                        Send via Whatsapp
                                    </div>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact