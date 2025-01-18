"use client";

import { logoutUser } from "@/services/AuthService";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

export default function StateButton() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logoutUser();
            setIsLoggedIn(false);
            // Force reload the current page after logout
            window.location.reload();
        } catch (error) {
            console.error("Logout error:", error);
        }
        setIsLoading(false);
    };

    const handleLogin = () => {
        router.push("/auth");
    }

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
                    onClick={handleLogin}
                    className="bg-green-600 text-white text-lg px-4 py-2 rounded-md font-medium hover:bg-green-700">
                    Login
                </button>
            )}
        </div>
    );
}
