/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- Brand ---------------------------------------------------------
        primary: "#0088CC",
        "ocean-blue": "#0088CC",
        secondary: "#fc8803",
        tertiary: "#ed032a",
        // Previously hard-coded in Header.astro / index.astro / gallery.astro.
        // Same hex values, now reachable as tokens.
        telegram: "#229ED9",
        "telegram-dark": "#1b8dc1",
        "ink-navy": "#003376",
        "chip-active": "#fe7935",

        // --- Surfaces ------------------------------------------------------
        background: "#f9f9fc",
        surface: "#f9f9fc",
        "surface-alt": "#F8FAFC",
        "surface-bright": "#f9f9fc",
        "surface-dim": "#dadadc",
        "surface-tint": "#0088CC",
        "surface-variant": "#e2e2e5",
        "surface-container": "#eeeef0",
        "surface-container-low": "#f3f3f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#e8e8ea",
        "surface-container-highest": "#e2e2e5",
        "inverse-surface": "#2f3133",

        // --- Content -------------------------------------------------------
        "on-background": "#1a1c1e",
        "on-surface": "#1a1c1e",
        "on-surface-variant": "#434751",
        "inverse-on-surface": "#f0f0f3",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",

        // --- Containers ----------------------------------------------------
        "primary-container": "#0088CC",
        "on-primary-container": "#ffffff",
        "secondary-container": "#ffffff",
        "on-secondary-container": "#6d2b00",
        "tertiary-container": "#9e001f",
        "on-tertiary-container": "#ffa6a4",

        // --- Fixed / accent variants --------------------------------------
        "primary-fixed": "#0088CC",
        "primary-fixed-dim": "#0088CC",
        "on-primary-fixed": "#0088CC",
        "on-primary-fixed-variant": "#0088CC",
        "inverse-primary": "#0088CC",
        "secondary-fixed": "#ffdbcb",
        "secondary-fixed-dim": "#ffb692",
        "on-secondary-fixed": "#341100",
        "on-secondary-fixed-variant": "#e8641f",
        "tertiary-fixed": "#ffdad8",
        "tertiary-fixed-dim": "#ffb3b1",
        "on-tertiary-fixed": "#410007",
        "on-tertiary-fixed-variant": "#92001c",

        // --- Lines & status ------------------------------------------------
        outline: "#737782",
        "outline-variant": "#c3c6d3",
        "border-muted": "#E2E8F0",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        success: "#0f7b3e",
      },

      // One radius scale for the whole site. Cards/panels = xl, controls = lg,
      // pills/dots = full. `full` is now an actual pill, not 12px.
      borderRadius: {
        none: "0px",
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },

      spacing: {
        "margin-mobile": "20px",
        gutter: "24px",
        "section-padding": "96px",
        "margin-desktop": "64px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        "container-max": "1280px",
      },

      maxWidth: {
        "container-max": "1280px",
      },

      fontFamily: {
        // Real fallback stacks so nothing reflows into Times if Google Fonts
        // is slow or blocked.
        sans: ["Manrope", "ui-sans-serif", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        display: ['"Source Serif 4"', "ui-serif", "Georgia", "Cambria", "serif"],
        "body-md": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        "body-lg": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        "label-md": ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        caption: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        "display-lg": ['"Source Serif 4"', "ui-serif", "Georgia", "serif"],
        "display-lg-mobile": ['"Source Serif 4"', "ui-serif", "Georgia", "serif"],
        "headline-sm": ['"Source Serif 4"', "ui-serif", "Georgia", "serif"],
        "headline-md": ['"Source Serif 4"', "ui-serif", "Georgia", "serif"],
      },

      fontSize: {
        caption: ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "30px", fontWeight: "400" }],
        "headline-sm": ["22px", { lineHeight: "30px", fontWeight: "600" }],
        "headline-md": ["30px", { lineHeight: "38px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-lg": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["34px", { lineHeight: "42px", letterSpacing: "-0.01em", fontWeight: "700" }],
      },

      boxShadow: {
        card: "0 1px 2px rgba(26,28,30,0.04), 0 8px 24px -12px rgba(26,28,30,0.18)",
        "card-hover": "0 2px 4px rgba(26,28,30,0.06), 0 18px 40px -16px rgba(26,28,30,0.28)",
      },
    },
  },
};
