import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        tech: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      colors: {
        cyber: {
          dark: "#050B14",
          panel: "#0A1120",
          border: "#1E2D4A",
          cyan: "#00E5FF",
          blue: "#2962FF",
        },
        nexus: {
          primary: "#0b2b44",
          secondary: "#123e63",
          accent: "#2563eb",
        },
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(to bottom, rgba(5, 11, 20, 0.88), rgba(5, 11, 20, 0.98))",
        "tech-grid":
          "linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "tech-grid": "30px 30px",
      },
      animation: {
        scan: "scan 4s linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { top: "-20%" },
          "100%": { top: "120%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
