import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom";
import { BookPlus, BookOpen, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import logo from "../assets/logoicon.png";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    //screensize:
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        }
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    //navItems:
    const navItems = [
        { path: '/', icon: BookPlus, label: 'Add Books' },
        { path: '/list-books', icon: BookOpen, label: 'List Books' },
        { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    ]

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    }

    //mobile view:
    if (isMobile) {
        return (
            <div className="fixed bottom-0 left-0 right-0 bg-linear-to-r from-[#2B5876] to-[#43C6AC] z-50 shadow-lg">
                <nav className="flex justify-around items-center py-3">
                    {navItems.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;

                        return (
                            <Link key={path} to={path} className="flex flex-col items-center w-full">
                                <div className={`p-2 rounded-lg ${isActive ? 'bg-white text-[#2B5876]' : 'text-gray-300'}`}>
                                    <Icon className="h-5 w-5 mx-auto" />
                                </div>
                                <span className={`text-xs mt-1 ${isActive ? 'text-white font-medium' : 'text-gray-300'}`}>
                                    {label}
                                </span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        )
    }

    //desktop view:
    return (
        <div className={`bg-linear-to-t from-[#2B5876] to-[#43C6AC] text-white min-h-screen p-4 transition-all duration-300 ease-in-out flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>

            {/* Header Section */}
            <div className="flex justify-between items-center mb-8 h-12">
                {!isCollapsed && (
                    <div className="flex items-center gap-3 animate-in fade-in duration-500">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <img src={logo} alt="logo" className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold whitespace-nowrap">BookShell</h1>
                    </div>
                )}

                <button
                    onClick={toggleCollapse}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors ml-auto">
                    {isCollapsed ? (
                        <ChevronLeft />
                    ) : (
                        <ChevronRight />
                    )}
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-2">
                {navItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;
                    return (
                        <Link key={path} to={path}
                            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all ${isActive ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'
                                } ${isCollapsed ? 'justify-center' : ''}`}>

                            <div className={`p-2 rounded-lg ${isActive ? 'bg-white text-[#2B5876]' : 'text-white'}`}>
                                <Icon className="h-5 w-5" />
                            </div>

                            {!isCollapsed && (
                                <span className={`${isActive ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white'}`}>
                                    {label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
            <div className="h-px bg-[#2B5876]/90 my-6" />
            <div className={`mt-auto pt-4 ${isCollapsed ? 'text-center' : ''}`}>
                {!isCollapsed && (
                    <p className="text-xs text-indigo-300">
                        &copy; 2026 BookShell
                    </p>
                )}
            </div>
        </div>
    );

}

export default Sidebar 