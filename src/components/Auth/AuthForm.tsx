import { useState } from "react";
import { signUpUser, loginUser, signInWithGoogle } from "@/services/AuthService";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode: "signup" | "login";
}

const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: mode === "signup" ? "" : undefined,
    phoneNumber: mode === "signup" ? "" : undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle phoneNumber to only allow numbers
    if (name === "phoneNumber" && !/^\d*$/.test(value)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Check password strength
    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? `Error: ${error.message}` : "An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Email validation
    if (!formData.email.includes("@")) {
      setError("Email harus mengandung '@'.");
      return;
    }

    try {
      if (mode === "signup" && formData.name && formData.phoneNumber) {
        await signUpUser(
          formData.email,
          formData.password,
          formData.name,
          parseInt(formData.phoneNumber)
        );
      } else {
        await loginUser(formData.email, formData.password);
      }
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? `Error: ${error.message}` : "An error occurred");
    }
  };

  const getPasswordStrength = (password: string) => {
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

    if (password.length >= 8 && hasNumbers && hasSpecialChars && hasMixedCase) {
      return "kuat";
    }
    return "lemah";
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-xl sm:max-w-md mx-auto px-4 sm:px-0 transition-all duration-300">
      {error && (
        <div className="p-4 text-red-700 bg-red-100 border border-red-500 rounded" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

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
              className="w-full px-4 py-2 mt-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-transform duration-300 transform hover:scale-105"
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
              className="w-full px-4 py-2 mt-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-transform duration-300 transform hover:scale-105"
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
          className="w-full px-4 py-2 mt-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-transform duration-300 transform hover:scale-105"
          placeholder="Email"
          required
        />
      </div>

      <div className="mb-4 relative">
        <label htmlFor="password" className="block text-lg font-medium text-green-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-transform duration-300 transform hover:scale-105"
            placeholder="Password"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-2/4 right-3 transform -translate-y-2/4 text-green-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🔓" : "🔒"}
          </button>
        </div>
        {formData.password && (
          <>
            <p className={`mt-2 text-sm ${passwordStrength === "kuat" ? "text-green-600" : "text-red-600"}`} aria-live="polite">
              {passwordStrength === "kuat" ? "Password kuat" : "Password lemah"}
            </p>
            {formData.password.length > 5 && passwordStrength === "lemah" && (
              <p className="mt-2 text-sm text-yellow-600">
                Password masih lemah, yakin ingin melanjutkannya?
              </p>
            )}
          </>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 mt-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition-colors duration-300 transform hover:scale-105"
      >
        {mode === "signup" ? "Daftar" : "Masuk"}
      </button>

      <button
        type="button"
        className="w-full py-2 mt-4 border-2 border-green-500 text-green-500 font-semibold rounded-lg hover:bg-green-100 focus:ring-2 focus:ring-green-400 transition-colors duration-300 transform hover:scale-105"
        onClick={handleGoogle}
      >
        Masuk dengan Google
      </button>
    </form>
  );
};

export default AuthForm;
