"use client"

import { useState } from "react";
import Cookies from "js-cookie"
import { loginUser, signUpUser } from "@/services/AuthService";

type AuthFormProps = {
  mode: "login" | "signup";
  onSuccess?: () => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        await loginUser(email, password);
        alert("Login successful!");
      } else if (mode === "signup") {
        await signUpUser(email, password);
        alert("Sign-up successful!");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(`${mode} failed:`, error);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {mode === "login" ? "Login" : "Sign Up"}
      </button>
    </div>
  );
};

export default AuthForm;
