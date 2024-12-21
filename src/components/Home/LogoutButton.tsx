"use client";

import { logoutUser } from "@/services/AuthService";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function LogoutButton() {
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
        return <button disabled={true}>Loading...</button>; // Render a loading indicator
    }

    return (
        <div>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <span>Please log in</span>
            )}
        </div>
    );
}
