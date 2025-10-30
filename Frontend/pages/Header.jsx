import { FaPowerOff } from "react-icons/fa6";
import logo from "../assets/logo.png";

export default function Header() {
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        window.location.href = "/";
    };

    return (
        <header
            className="
                w-full 
                shadow-md 
                bg-gradient-to-r from-[#2c3e50] to-[#364979]
                 pt-6 sm:pt-8   /* ✅ Added top padding for spacing */
                /* ✅ Safe area for Android/iOS status bar */
            "
        >
            <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3 sm:py-5">
                {/* Logo & Title Section */}
                <div className="flex items-center justify-between w-full sm:w-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-10 sm:h-12 object-contain"
                        />
                        <h1 className="text-white font-extrabold text-lg sm:text-2xl tracking-wide text-center">
                            LGBTI Survey
                        </h1>
                    </div>

                    {/* Mobile Logout (Right Side) */}
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="
                            sm:hidden 
                            bg-white 
                            text-[#364979] 
                            rounded-full 
                            p-2 ml-3 
                            hover:bg-gray-200 
                            transition duration-200 
                            active:scale-95
                        "
                    >
                        <FaPowerOff className="text-lg" />
                    </button>
                </div>

                {/* Desktop Logout */}
                <div className="hidden sm:flex items-center">
                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="
                            flex items-center gap-2 
                            bg-white 
                            text-[#364979] 
                            font-semibold 
                            px-4 py-2 
                            rounded-full 
                            shadow 
                            hover:bg-gray-100 
                            transition duration-200 
                            active:scale-95
                        "
                    >
                        <FaPowerOff className="text-base" />
                        <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
