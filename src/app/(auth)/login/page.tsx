import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/features/auth/components/LoginForm";
export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue your fleet safety training."
    >
      <LoginForm />
    </AuthLayout>
  );
}
