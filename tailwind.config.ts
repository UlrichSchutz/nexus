import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          // Modern gradient palette - moving away from newspaper look
          ink: "#0a0e27",
          muted: "#6b7280",
          light: "#9ca3af",
          surface: "#ffffff",
          canvas: "#f9fafb",
          canvasAlt: "#f3f4f6",
          // Modern vibrant primary (deep blue)
          primary: "#1e3a8a",
          primaryLight: "#3b82f6",
          primaryDark: "#1e40af",
          // Modern accent (electric purple)
          accent: "#a855f7",
          accentLight: "#d8b4fe",
          accentDark: "#9333ea",
          // Complementary teal for CTAs
          cta: "#06b6d4",
          ctaLight: "#67e8f9",
          ctaDark: "#0891b2",
          border: "#e5e7eb",
        },
      },
      boxShadow: {
        card: "0 10px 40px rgba(30, 58, 138, 0.08)",
        soft: "0 4px 20px rgba(10, 14, 39, 0.06)",
        lift: "0 20px 50px rgba(168, 85, 247, 0.12)",
        glow: "0 0 30px rgba(168, 85, 247, 0.15)",
      },
      animation: {
        ticker: "ticker 45s linear infinite",
        fadeIn: "fadeIn 0.5s ease-in",
        slideUp: "slideUp 0.6s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
