// components/Auth/AuthForm.tsx
import { useState } from "react";

interface AuthFormProps {
  mode: "signup" | "login";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: mode === "signup" ? "" : undefined,
    phoneNumber: mode === "signup" ? "" : undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // Handle form submission here
    // Implement logic for submitting form data to the backend or API
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "signup" && (
        <>
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg font-medium text-green-700">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
              placeholder="Nama Lengkap"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-lg font-medium text-green-700">Nomor Telepon</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
              placeholder="Nomor Telepon"
              required
            />
          </div>
        </>
      )}

      <div className="mb-4">
        <label htmlFor="email" className="block text-lg font-medium text-green-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
          placeholder="Email"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-lg font-medium text-green-700">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mt-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
          placeholder="Password"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-300 transform hover:scale-105"
      >
        {mode === "signup" ? "Daftar" : "Masuk"}
      </button>

      {/* Google Login Button */}
      <button
        type="button"
        className="w-full py-2 mt-4 border-2 border-green-500 text-green-500 font-semibold rounded-lg hover:bg-green-100 transition-colors duration-300 transform hover:scale-105"
      >
        Masuk dengan Google
      </button>
    </form>
  );
};

export default AuthForm;
