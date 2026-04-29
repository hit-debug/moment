import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / 0.05)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        "bg-deep": "hsl(var(--bg-deep))",
        "bg-primary-app": "hsl(var(--bg-primary))",
        "bg-surface": "hsl(var(--bg-surface))",

        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary) / 0.8)",

        "action-cta": {
          DEFAULT: "hsl(var(--action-cta))",
          foreground: "hsl(var(--action-cta-foreground))",
        },
        "emotion-like": "hsl(var(--emotion-like))",
        "status-success": "hsl(var(--status-success))",
        "status-error": "hsl(var(--status-error))",
        "status-warning": "hsl(var(--status-warning))",
        "status-info": "hsl(var(--status-info))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      spacing: {
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-6": "24px",
        "space-8": "32px",
        "space-12": "48px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "pill": "999px",
        "sheet": "40px",
        "dock": "24px",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in":        { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        "fade-out":       { "0%": { opacity: "1" }, "100%": { opacity: "0" } },
        "slide-up":       { "0%": { transform: "translateY(100%)" }, "100%": { transform: "translateY(0)" } },
        "slide-down":     { "0%": { transform: "translateY(0)" },     "100%": { transform: "translateY(100%)" } },
        "swipe-in-right": { "0%": { transform: "translateX(100%)", opacity: "0" }, "100%": { transform: "translateX(0)", opacity: "1" } },
        "swipe-in-left":  { "0%": { transform: "translateX(-100%)", opacity: "0" }, "100%": { transform: "translateX(0)", opacity: "1" } },
        "tap-pop":        { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.18)" }, "100%": { transform: "scale(1)" } },
        "toast-in":       { "0%": { opacity: "0", transform: "translate(-50%, 8px)" }, "100%": { opacity: "1", transform: "translate(-50%, 0)" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-in":        "fade-in 200ms ease-out",
        "fade-out":       "fade-out 200ms ease-out",
        "slide-up":       "slide-up 300ms ease-in-out",
        "slide-down":     "slide-down 300ms ease-in-out",
        "swipe-in-right": "swipe-in-right 450ms cubic-bezier(0.22, 1, 0.36, 1)",
        "swipe-in-left":  "swipe-in-left 450ms cubic-bezier(0.22, 1, 0.36, 1)",
        "tap-pop":        "tap-pop 180ms ease-out",
        "toast-in":       "toast-in 150ms ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
