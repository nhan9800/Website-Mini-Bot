import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070711",
        card: "#121224",
        "card-hover": "#17172e",
        border: "rgba(255, 255, 255, 0.08)",
        "border-glow": "rgba(46, 204, 113, 0.4)",
        mimi: {
          green: "#2ECC71",
          "green-hover": "#27AE60",
          purple: "#8B5CF6",
          cyan: "#00F2FE",
          pink: "#FF0844",
          yellow: "#F1C40F",
        },
      },
      fontFamily: {
        sans: ["var(--font-mimi)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        soundwave: {
          "0%, 100%": { height: "15%" },
          "50%": { height: "100%" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
        soundwave: "soundwave 1.2s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(46, 204, 113, 0.35)",
        "glow-purple": "0 0 25px -5px rgba(139, 92, 246, 0.35)",
        "glow-lg": "0 0 40px -10px rgba(46, 204, 113, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
