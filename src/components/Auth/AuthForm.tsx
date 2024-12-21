"use client"

import { useState } from "react";
import Cookies from "js-cookie"
import { loginUser, signUpUser } from "@/services/authServices";

type AuthFormProps = {
  mode: "login" | "signup";
  onSuccess?: () => void;
};

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {

      Cookies.set("iniTestCookie", "Tes");

    try {
      if (mode === "login") {
        const user = await loginUser(email, password);
          Cookies.set("user", JSON.stringify(user), {
              expires: 1,
              sameSite: "Strict", // Prevent cross-site issues
          });
          // const savedUser = JSON.parse(Cookies.get("user") as string);
          // console.log(savedUser.email);
        alert("Login successful!");
      } else if (mode === "signup") {
        const user = await signUpUser(email, password);
          Cookies.set("test", JSON.stringify(user), {
              expires: 1,
              sameSite: "Strict",
          });
          // const savedUser = JSON.parse(Cookies.get("user") as string);
          // console.log(savedUser.email);
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
