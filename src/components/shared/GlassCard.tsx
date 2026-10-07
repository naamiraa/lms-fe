import type { HTMLAttributes } from "react";
export default function GlassCard({
  className = "",
  as: Tag = "div",
  ...props
}: HTMLAttributes<HTMLElement> & { as?: "div" | "section" }) {
  return <Tag {...props} className={`glass-card ${className}`} />;
}
