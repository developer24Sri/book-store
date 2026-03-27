import { AlertCircle, CheckCircle, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react"


const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = "Name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (!formData.message.trim()) newErrors.message = "Message is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const [toast, setToast] = useState({ visible: false, message: "", type: "info" })

    // function submit data and redirect to what'sup web with the data,
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        const whatsappNumber = "1234567894";
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

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }))

            if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }))
        }

    }

    return (
        <>
            <div className="py-16 pt-24 bg-gray-50 min-h-screen relative">
                {toast.visible && (
                    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-md text-white flex items-center shadow-lg ${toast.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}>
                            {toast.type === "success" ? (
                                <CheckCircle className="h-5 w-5 mr-2" />
                            ):(
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
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <MapPin className="h-6 w-6 text-[#43C6AC]" />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">Our Location</h3>
                                <p className="text-gray-600">123 Book Street, Library City, CH 600014</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <Mail className="h-6 w-6 text-[#43C6AC]" />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">Email</h3>
                                <p className="text-gray-600">contact@example.com</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4">
                                    <Phone className="h-6 w-6 text-[#43C6AC]" />
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">Call Us</h3>
                                <p className="text-gray-600">+91 1234567898</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact