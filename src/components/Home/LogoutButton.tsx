"use client";

import { logoutUser } from "@/services/AuthService";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function LogoutButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Run this only on the client
        const userCookie = Cookies.get("user");
        setIsLoggedIn(!!userCookie); // Convert to boolean
    }, []);

    const handleLogout = () => {
        logoutUser();
        setIsLoggedIn(false);
    };

    return (
        <div>
            {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </div>
    );
}
