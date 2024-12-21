// app/login/page.tsx
import AuthForm from "@/components/Auth/AuthForm";

export default function RegisterPage() {
  return (
    <div>
      <h1>Register</h1>
      <AuthForm mode="signup" />
    </div>
  );
}
