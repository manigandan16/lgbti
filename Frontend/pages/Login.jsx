import doctor from "../assets/Doctor.jpg";
import logo from "../assets/logo.png";
import { FaUserCircle, FaLock } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { Geolocation } from "@capacitor/geolocation";
import { StatusBar, Style } from '@capacitor/status-bar';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [permissionEnabled, setPermissionEnabled] = useState(null); // ✅ track permission
    // Display content under transparent status bar
    StatusBar.setOverlaysWebView({ overlay: true });

    const setStatusBarStyleDark = async () => {
        await StatusBar.setStyle({ style: Style.Dark });
    };

    const setStatusBarStyleLight = async () => {
        await StatusBar.setStyle({ style: Style.Light });
    };

    const hideStatusBar = async () => {
        await StatusBar.hide();
    };

    const showStatusBar = async () => {
        await StatusBar.show();
    };

    useEffect(() => {
        const setupStatusBar = async () => {
            try {
                await StatusBar.setOverlaysWebView({ overlay: true });
                await StatusBar.setBackgroundColor({ color: "transparent" });
                await StatusBar.setStyle({ style: Style.Light }); // ✅ White icons
            } catch (err) {
                console.warn("⚠️ StatusBar setup failed:", err);
            }
        };
        const getLocation = async () => {
            try {
                const perm = await Geolocation.requestPermissions();

                // If permission denied
                if (!perm || perm.location === "denied") {
                    console.warn("❌ Location permission denied");
                    setPermissionEnabled(true);
                    setError("⚠️ Please enable location permission to continue.");
                    return;
                }

                // Try fetching location
                const pos = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 10000,
                });

                const coords = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                };

                setLocation(coords);
                setPermissionEnabled(true);
                console.log("📍 Login location captured:", coords);
            } catch (err) {
                console.warn("⚠️ Error capturing location:", err);
                setPermissionEnabled(false);
                setError("⚠️ Location access failed. Please enable GPS.");
            }
        };
        // setupStatusBar();
        getLocation();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");

            const res = await axios.post("https://api-lgbti.nnet-dataviz.com/api/cred", {
                username,
                password,
                location: `${location.lat},${location.lon}`, // optional, send location to backend
            });

            if (res.status === 200) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("username", username);
                window.location.href = "/home";
            } else {
                setError("❌ Invalid username or password");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid Login!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-screen h-screen top-0 right-0 bg-gradient-to-tr from-gray-950 to-blue-800 flex justify-center items-center sm:p-4 p-3">
            <div className="h-[95%] w-full bg-slate-200 rounded-md flex p-4 mt-6 sm:mt-10">

                <div
                    className="w-[40%] sm:block hidden h-full bg-gray-950 rounded-md bg-center bg-cover"
                    style={{
                        backgroundImage: `url(${doctor})`,
                        boxShadow: "inset 0 0 40px 30px rgba(0,0,0,0.8)",
                    }}
                ></div>

                <div className="sm:w-[60%] w-full h-full flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center sm:gap-[8%] gap-[5%] sm:w-1/2 w-full h-full">
                        <div className="w-full flex justify-center">
                            <img src={logo} alt="Logo" className="w-[20%]" />
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="w-full flex flex-col justify-center items-center gap-4"
                        >
                            <div className="w-full flex flex-col justify-center items-center">
                                <h1 className="text-sky-800 font-bold sm:text-3xl text-4xl">
                                    WELCOME
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Please Login to your account
                                </p>
                            </div>

                            {/* Username */}
                            <div className="w-[80%] bg-white rounded-md p-2 flex items-center gap-2 border border-sky-800 focus-within:ring-2 focus-within:ring-sky-600 transition-all">
                                <FaUserCircle className="text-xl text-sky-800" />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="outline-none w-full text-gray-700"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="w-[80%] bg-white rounded-md p-2 flex items-center gap-2 border border-sky-800 focus-within:ring-2 focus-within:ring-sky-600 transition-all">
                                <FaLock className="text-xl text-sky-800" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="outline-none w-full text-gray-700"
                                    required
                                />
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                // disabled={
                                //     loading || permissionEnabled === false
                                // }
                                className={`w-[80%] bg-gradient-to-tr from-gray-950 to-blue-800 text-white rounded-md p-2 flex justify-center items-center gap-2 border-2 border-sky-800
                    transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95 ${loading || permissionEnabled === false
                                        ? "opacity-60 cursor-not-allowed"
                                        : ""
                                    }`}
                            >
                                {loading
                                    ? "Logging in..."
                                    : permissionEnabled === false
                                        ? "Enable Location"
                                        : "LOGIN"}
                            </button>

                            {/* Error Message */}
                            {error && (
                                <div
                                    className="w-[80%] rounded-md flex justify-center text-sm italic text-red-600
                      transition-all duration-300 ease-in-out animate-slideDown"
                                >
                                    {error}
                                </div>
                            )}


                            <div className="text-gray-400 text-xs">
                                Version 1.5.5
                            </div>

                            <div className="text-gray-400 text-xs mt-1">
                                © NeuralNet Data Science
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
