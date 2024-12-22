"use client";

import { useState } from "react";
import AuthForm from "@/components/Auth/AuthForm"; // Pastikan komponen AuthForm ada di folder components

export default function SignUpPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 via-green-500 to-yellow-200 py-16 px-6">
      <div className="max-w-xl mx-auto bg-green-200 p-8 rounded-xl shadow-lg transform transition-all hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center text-green-800 mb-8">
          {isSignUp ? "Daftar Akun" : "Masuk"}
        </h2>

        {/* Form */}
        <AuthForm mode={isSignUp ? "signup" : "login"} />

        {/* Toggle between Sign Up and Sign In */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignUp
              ? "Sudah punya akun? "
              : "Belum punya akun? "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-green-500 font-semibold hover:text-green-600 transition-colors duration-300"
            >
              {isSignUp ? "Masuk" : "Daftar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
