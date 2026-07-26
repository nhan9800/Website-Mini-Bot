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
        background: "#05060f",
        surface: "#0b0d1c",
        border: "rgba(255, 255, 255, 0.08)",
        mimi: {
          green: "#2ECC71",
          "green-bright": "#3EE586",
          "green-hover": "#27AE60",
          purple: "#8B5CF6",
          violet: "#A78BFA",
          cyan: "#22D3EE",
          pink: "#F472B6",
          amber: "#FBBF24",
        },
      },
      fontFamily: {
        sans: ["var(--font-mimi)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        soundwave: {
          "0%, 100%": { transform: "scaleY(0.25)" },
          "50%": { transform: "scaleY(1)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        equalize: {
          "0%, 100%": { height: "20%" },
          "50%": { height: "100%" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        soundwave: "soundwave 1.1s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.9s ease both",
        shimmer: "shimmer 2.8s linear infinite",
        marquee: "marquee 28s linear infinite",
        "spin-slow": "spinSlow 14s linear infinite",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
        equalize: "equalize 1.2s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 28px -6px rgba(46, 204, 113, 0.4)",
        "glow-lg": "0 0 55px -12px rgba(46, 204, 113, 0.55)",
        "glow-purple": "0 0 30px -6px rgba(139, 92, 246, 0.4)",
        "glow-cyan": "0 0 30px -6px rgba(34, 211, 238, 0.35)",
        "inner-card": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #2ECC71 0%, #22D3EE 100%)",
        "gradient-violet": "linear-gradient(135deg, #8B5CF6 0%, #F472B6 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
