/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        workspace: { bg: "#F5F7FA", surface: "#FFFFFF", secondary: "#F8FAFC", border: "#E2E8F0" },
        intel: { primary: "#2563EB", success: "#16A34A", warning: "#D97706", critical: "#DC2626" },
        slateText: { primary: "#0F172A", secondary: "#64748B", muted: "#94A3B8" }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}