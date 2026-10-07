"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { register } from "@/services/auth.service";

export default function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        employeeNumber: employeeNumber.trim() || null,
        password,
      });

      setSuccessMessage(response.message);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (successMessage) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
            ✓
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Registration Successful
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {successMessage}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            You can sign in after your account has been approved by an
            administrator.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => router.push("/login")}
        >
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Input
        id="name"
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <Input
        id="employeeNumber"
        type="text"
        label="Employee Number"
        placeholder="Enter employee number (optional)"
        value={employeeNumber}
        onChange={(event) =>
          setEmployeeNumber(event.target.value)
        }
      />

      <Input
        id="email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Create a password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(event) =>
          setConfirmPassword(event.target.value)
        }
        required
      />

      <Button
        type="submit"
        isLoading={isLoading}
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}