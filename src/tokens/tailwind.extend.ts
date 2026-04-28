/**
 * Tailwind CSS theme.extend configuration.
 *
 * For Tailwind v4: these mappings are declared via @theme inline in global.css.
 * This file serves as a typed reference and can be used directly in a
 * tailwind.config.ts for Tailwind v3 or hybrid setups.
 */

export const themeExtend = {
  colors: {
    /* --- Semantic (shadcn/ui) --- */
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: {
      DEFAULT: "var(--card)",
      foreground: "var(--card-foreground)",
    },
    popover: {
      DEFAULT: "var(--popover)",
      foreground: "var(--popover-foreground)",
    },
    primary: {
      DEFAULT: "var(--primary)",
      foreground: "var(--primary-foreground)",
    },
    secondary: {
      DEFAULT: "var(--secondary)",
      foreground: "var(--secondary-foreground)",
    },
    muted: {
      DEFAULT: "var(--muted)",
      foreground: "var(--muted-foreground)",
    },
    accent: {
      DEFAULT: "var(--accent)",
      foreground: "var(--accent-foreground)",
    },
    destructive: {
      DEFAULT: "var(--destructive)",
      foreground: "var(--destructive-foreground)",
    },
    success: {
      DEFAULT: "var(--success)",
      foreground: "var(--success-foreground)",
    },
    warning: {
      DEFAULT: "var(--warning)",
      foreground: "var(--warning-foreground)",
    },
    info: {
      DEFAULT: "var(--info)",
      foreground: "var(--info-foreground)",
    },
    border: "var(--border)",
    input: "var(--input)",
    ring: "var(--ring)",

    /* --- Chart --- */
    chart: {
      "1": "var(--chart-1)",
      "2": "var(--chart-2)",
      "3": "var(--chart-3)",
      "4": "var(--chart-4)",
      "5": "var(--chart-5)",
    },

    /* --- Sidebar --- */
    sidebar: {
      DEFAULT: "var(--sidebar)",
      foreground: "var(--sidebar-foreground)",
      primary: {
        DEFAULT: "var(--sidebar-primary)",
        foreground: "var(--sidebar-primary-foreground)",
      },
      accent: {
        DEFAULT: "var(--sidebar-accent)",
        foreground: "var(--sidebar-accent-foreground)",
      },
      border: "var(--sidebar-border)",
      ring: "var(--sidebar-ring)",
    },
  },

  spacing: {
    px: "1px",
    "0": "0",
    "0.5": "0.125rem",
    "1": "0.25rem",
    "1.5": "0.375rem",
    "2": "0.5rem",
    "2.5": "0.625rem",
    "3": "0.75rem",
    "3.5": "0.875rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "7": "1.75rem",
    "8": "2rem",
    "9": "2.25rem",
    "10": "2.5rem",
    "11": "2.75rem",
    "12": "3rem",
    "14": "3.5rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem",
    "28": "7rem",
    "32": "8rem",
    "36": "9rem",
    "40": "10rem",
    "44": "11rem",
    "48": "12rem",
    "52": "13rem",
    "56": "14rem",
    "60": "15rem",
    "64": "16rem",
    "72": "18rem",
    "80": "20rem",
    "96": "24rem",
  },

  borderRadius: {
    base: "var(--radius)",
    none: "0px",
    xs: "0.125rem",
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    "3xl": "1.5rem",
    full: "9999px",
  },

  boxShadow: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
    none: "0 0 #0000",
  },

  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
  },

  fontFamily: {
    sans: ["Geist", "system-ui"],
    mono: ["Geist Mono"],
    serif: ["Georgia", "serif"],
  },
} as const;

export type ThemeExtend = typeof themeExtend;
