import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ==================== COLORS ==================== */
      colors: {
        // Primitives
        "off-white": "#f6f4eb",
        ink: {
          900: "#0e0e0e",
          800: "#1a1a1a",
        },
        pink: {
          300: "#f5a5c5",
          400: "#f07aaa",
          500: "#f07aaa",
        },
        // Semantic - Surface
        surface: {
          "background-default": "#0e0e0e",
          "background-highlight": "#f07aaa",
          "button-default": "#f6f4eb",
          "button-hover": "#f07aaa",
          "stroke-light": "#f6f4eb",
          "logo-light": "#f6f4eb",
          "logo-dark": "#0e0e0e",
        },
        // Semantic - Typography
        typography: {
          headings: "#f6f4eb",
          body: "#f6f4eb",
          "body-invert": "#0e0e0e",
        },
        // Special
        map: {
          background: "#1a1a2e",
        },
      },

      /* ==================== SPACING ==================== */
      spacing: {
        "4xxs": "0px",
        "2xxs": "8px",
        "xxs": "10px",
        "3xs": "12px",
        "2xs": "14px",
        xs: "16px",
        s: "18px",
        "2s": "20px",
        "3s": "26px",
        m: "36px",
        "3m": "60px",
        l: "70px",
        "2l": "80px",
        "3l": "100px",
        xl: "120px",
        "2xxl": "210px",
      },
      maxWidth: {
        "page": "1920px",
      },

      /* ==================== TYPOGRAPHY ==================== */
      fontFamily: {
        sabon: ["var(--font-sabon)", "serif"],
        gotham: ["var(--font-gotham)", "sans-serif"],
      },
      fontSize: {
        h1: ["56px", { lineHeight: "1.3", letterSpacing: "-1.12px" }],
        "h1-tablet": ["48px", { lineHeight: "1.3", letterSpacing: "-0.96px" }],
        "h1-mobile": ["36px", { lineHeight: "1.3", letterSpacing: "-0.72px" }],
        h2: ["36px", { lineHeight: "1.3", letterSpacing: "-0.72px" }],
        "h2-tablet": ["32px", { lineHeight: "1.3", letterSpacing: "-0.64px" }],
        "h2-mobile": ["28px", { lineHeight: "1.3", letterSpacing: "-0.56px" }],
        h3: ["24px", { lineHeight: "1.3", letterSpacing: "-0.48px" }],
        "h3-tablet": ["20px", { lineHeight: "1.3", letterSpacing: "-0.40px" }],
        "h3-mobile": ["18px", { lineHeight: "1.3", letterSpacing: "-0.36px" }],
        h4: ["16px", { lineHeight: "1.6", letterSpacing: "0.48px" }],
        h5: ["14px", { lineHeight: "1.6", letterSpacing: "0.42px" }],
        "body-s": ["16px", { lineHeight: "1.6", letterSpacing: "-0.32px" }],
        cta: ["12px", { lineHeight: "1.3", letterSpacing: "0.36px" }],
        "cta-small": ["10px", { lineHeight: "1.3", letterSpacing: "0.3px" }],
      },
      letterSpacing: {
        "tight-h1": "-1.12px",
        "tight-h2": "-0.72px",
        "tight-h3": "-0.48px",
        "tight-body": "-0.32px",
        "wide-h4": "0.48px",
        "wide-cta": "0.36px",
        "wide-h5": "0.42px",
      },
      lineHeight: {
        tight: "1.3",
        relaxed: "1.6",
      },

      /* ==================== TRANSITIONS ==================== */
      transitionTimingFunction: {
        "ease-out-custom": "cubic-bezier(0, 0, 0.2, 1)",
      },
      transitionDuration: {
        "300": "300ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
