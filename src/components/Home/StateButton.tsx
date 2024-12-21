"use client";

import { logoutUser } from "@/services/AuthService";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

export default function StateButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    useEffect(() => {
        // Simulate checking the cookie (for a real app, this is instant)
        const timer = setTimeout(() => {
            const userCookie = Cookies.get("user");
            setIsLoggedIn(!!userCookie); // Convert to boolean
            setIsLoading(false); // Loading complete
        }, 500); // Optional delay to show loading effect

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    const handleLogout = async () => {
        setIsLoading(true); // Show loading during logout
        await logoutUser();
        Cookies.remove("user");
        setIsLoggedIn(false);
        setIsLoading(false);
    };

    if (isLoading) {
        return <button
            disabled={true}
            className="bg-gray-700 text-white text-lg px-4 py-2 rounded-md font-medium hover:bg-red-700">
            Loading
        </button>
    }

    return (
        <div>
            {isLoggedIn ? (
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white text-lg px-4 py-2 rounded-md font-medium hover:bg-red-700">
                    Logout
                </button>
            ) : (
                <button

                    className="bg-green-600 text-white text-lg px-4 py-2 rounded-md font-medium hover:bg-green-700">
                Login
                </button>
            )}
        </div>
    );
}
