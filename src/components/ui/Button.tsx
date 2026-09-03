import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  children,
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        w-full rounded-xl bg-[#006CB8] px-4 py-3
        font-semibold text-white transition
        hover:bg-[#005a9c]
        disabled:cursor-not-allowed disabled:opacity-60
        ${className}
      `}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}