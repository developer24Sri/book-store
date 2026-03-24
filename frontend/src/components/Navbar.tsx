import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import logo from "../assets/images/logoicon.png"


const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.screenY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-500 ${scrolled ? "shadow-md py-2" : "py-4"}`}>
            <div className="container mx-auto px-4 md:px-4 md:text-xs">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <div className="relative group">
                            <div className="absolute -inset-3 rounded-full opacity-0 blur-xl group-hover:opacity-30 transition-opacity bg-linear-to-r from-[#43C6AC] to-[#F8FFAE]" />
                            <div className="relative flex items-center">
                                <img src={logo} alt="logo" className="h-8 w-8 rounded-full z-10" />
                                <div className="ml-2">
                                    <h1 className="text-xl font-bold bg-linear-to-r from-[#43C6AC] to-[#2B5876] bg-clip-text text-transparent">BOOK-STORE</h1>
                                    <div className="h-0.5 w-0 bg-linear-to-r from-[#43C6AC] to-[#F8FFAE] group-hover:w-full transition-all duration-500"></div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar