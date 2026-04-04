import { ArrowLeft, Mail, User, Lock, EyeOff, Eye } from "lucide-react";
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {

  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" })
  const navigate = useNavigate();

  // toast tumer and redirect to login:
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: "", type: "" })
        if (toast.type === "success") navigate("/login")
      }, 3000)
      return () => clearInterval(timer);
    }
  }, [toast, navigate])

  const handleSubmit = async(e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const {username, email, password} = formData;
    if(!username.trim() || !email.trim() || !password.trim()) {
      setToast({
        visible: true,
        message: "All fields are required!",
        type: "error"
      });
      return;
    }

    setToast({
      visible: true,
      message: "Creating Account...",
      type: "info"
    })

    try {
      const res = await fetch("http://localhost:4000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body: JSON.stringify({username, email, password}),
      })
      const data = await res.json();

      if(!res.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      setToast({
        visible: true,
        message: "Account Created...",
        type: "success",
      })
    } catch(error) {
      const errorMessage = error instanceof Error ? error.message: "An unexpected error occurred!"
      setToast({
        visible: true,
        message: errorMessage,
        type: "error",
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {toast.visible && (
        <div className={`fixed top-4 right-4 p-3 rounded-md ${toast.type === "success"
          ?
          "bg-green-100 text-green-700"
          :
          "bg-red-100 text-red-700"}
          `}>{toast.message}</div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <Link to="/" className="flex items-center text-gray-600 mb-8">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        <div className="text-center">
          <div className="mx-auto mb-4 bg-gray-100 w-fit p-3 rounded-full">
            <User className="h-6 w-6 text-[#43C6AC]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-2">Join our community of book lovers</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* username */}
          <div>
            <label className="block text-gray-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input type="text"
                name="username"
                placeholder="Enter your UserName"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#43C6AC] focus:border-[#43C6AC] text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>
          {/* email */}
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#43C6AC] focus:border-[#43C6AC] text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>
          {/* password */}
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-[#43C6AC] focus:border-[#43C6AC] text-gray-800 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#43C6AC] text-white py-3 rounded-lg hover:bg-[#368f7a] transition-colors">
            Create Account
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          Already have an account? {" "}
          <Link to="/login" className="text-[#43C6AC] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp