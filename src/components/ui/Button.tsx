import type { ButtonHTMLAttributes, ReactNode } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
}
export default function Button({
  children,
  isLoading = false,
  disabled,
  className = "",
  variant = "primary",
  fullWidth = true,
  type = "button",
  ...props
}: ButtonProps) {
  const styles = {
    primary:
      "bg-[#006CB8] text-white shadow-lg shadow-[#006CB8]/15 hover:bg-[#005a9c]",
    secondary:
      "border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#006CB8] disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? "w-full" : ""} ${styles[variant]} ${className}`}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
