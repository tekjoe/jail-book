import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        foreground: "#f0f0f0",
        primary: "#3b82f6",
        "primary-dark": "#2563eb",
        secondary: "#1e293b",
        "secondary-light": "#334155",
        accent: "#6366f1",
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        "card-bg": "#1e1e1e",
        "card-border": "#2e2e2e",
        "input-bg": "#2a2a2a",
        "input-border": "#3a3a3a",
        "sidebar-bg": "#1a1a1a",
        "sidebar-border": "#2a2a2a",
        "table-header-bg": "#1e293b",
        "table-row-hover": "#2a2a2a",
      },
      backgroundImage: {
        "background-gradient": "linear-gradient(to bottom right, #121212, #1a1a1a)",
        "primary-gradient": "linear-gradient(to right, #3b82f6, #2563eb)",
        "secondary-gradient": "linear-gradient(to bottom, #1e293b, #334155)",
        "accent-gradient": "linear-gradient(to right, #6366f1, #4f46e5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
