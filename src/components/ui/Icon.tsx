import type { SVGProps } from "react";
export type IconName =
  | "grid"
  | "book"
  | "users"
  | "clipboard"
  | "truck"
  | "chart"
  | "award"
  | "history"
  | "message"
  | "menu"
  | "close"
  | "logout"
  | "arrow"
  | "eye"
  | "eyeOff"
  | "shield";
const paths: Record<IconName, string> = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  book: "M12 5v16 M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2z",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  clipboard: "M9 3h6v4H9z M9 5H5v16h14V5h-4 M8 12h8 M8 16h5",
  truck:
    "M1 4h13v13H1z M14 8h4l4 5v4h-8 M5 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4 M18 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4",
  chart: "M3 3v18h18 M7 16v-4 M12 16V8 M17 16V5",
  award: "M8 14l-2 8 6-3 6 3-2-8 M19 8a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  history: "M3 12a9 9 0 1 0 3-7 M3 3v5h5 M12 7v5l3 2",
  message: "M21 3H3v14h4v4l5-4h9z M7 8h10 M7 12h6",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  close: "M6 6l12 12 M6 18 18 6",
  logout: "M9 3H3v18h6 M10 12h11 M17 8l4 4-4 4",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  eyeOff:
    "M3 3l18 18 M10 5h2c7 0 10 7 10 7a19 19 0 0 1-3 4 M6 6a20 20 0 0 0-4 6s3 7 10 7c2 0 4-.6 5-1.5",
  shield: "M12 2l9 4v6c0 6-9 10-9 10S3 18 3 12V6z M8 12l3 3 5-6",
};
export default function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
export function navigationIcon(href: string): IconName {
  if (href.includes("dashboard")) return "grid";
  if (href.includes("learning")) return "book";
  if (href.includes("users") || href.includes("participants")) return "users";
  if (href.includes("assessment") || href.includes("sessions"))
    return "clipboard";
  if (href.includes("simulation")) return "truck";
  if (href.includes("certificate")) return "award";
  if (href.includes("history")) return "history";
  if (href.includes("feedback")) return "message";
  return "chart";
}
