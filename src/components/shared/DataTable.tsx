import type { TableHTMLAttributes } from "react";
export default function DataTable({
  children,
  className = "",
  ...props
}: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl">
      <table {...props} className={`w-full text-left text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}
