import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        display: ["var(--font-dm-serif)", "Georgia", "serif"],
      },
      colors: {
        brand: {
          ink: "#0f172a",
          muted: "#475569",
          light: "#94a3b8",
          surface: "#ffffff",
          canvas: "#f0fdfa",
          canvasAlt: "#f8fafc",
          teal: "#0d9488",
          tealDark: "#0f766e",
          tealLight: "#ccfbf1",
          tealSoft: "#e6fffa",
          border: "#e2e8f0",
        },
      },
      boxShadow: {
        card: "0 4px 24px rgba(15, 118, 110, 0.08)",
        soft: "0 2px 12px rgba(15, 23, 42, 0.06)",
        lift: "0 8px 32px rgba(13, 148, 136, 0.12)",
      },
      animation: {
        ticker: "ticker 45s linear infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
