import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/features/auth/components/RegisterForm";
export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start your learning journey with Fleet Safety Simulator."
      register
    >
      <RegisterForm />
    </AuthLayout>
  );
}
