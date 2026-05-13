import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orby Jewels Brand Palette
        chocolate: {
          50: "#fdf8f5",
          100: "#f7ebe0",
          200: "#edd4bc",
          300: "#deb08e",
          400: "#cb8761",
          500: "#be6d42",
          600: "#b05937",
          700: "#92452f",
          800: "#763a2c",
          900: "#613228",
          DEFAULT: "#3D2314",
          950: "#3D2314",
        },
        champagne: {
          50: "#fdfaf7",
          100: "#F5E6D3",
          200: "#ead0af",
          300: "#dbb888",
          400: "#cfa068",
          500: "#c48a4e",
          600: "#b67842",
          700: "#986038",
          800: "#7c4e32",
          900: "#65402b",
          DEFAULT: "#F5E6D3",
        },
        gold: {
          50: "#fefce8",
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15",
          500: "#D4AF37",
          600: "#B8860B",
          700: "#a16207",
          800: "#854d0e",
          900: "#713f12",
          DEFAULT: "#D4AF37",
          dark: "#B8860B",
        },
        nude: {
          50: "#faf7f4",
          100: "#f2ece4",
          200: "#E8D5C4",
          300: "#d4b898",
          400: "#C4A882",
          500: "#b3916a",
          600: "#a07c59",
          700: "#85654a",
          800: "#6d5340",
          900: "#5a4436",
          DEFAULT: "#C4A882",
        },
        ivory: {
          DEFAULT: "#FDFAF7",
          warm: "#FAF6F0",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #B8860B 50%, #D4AF37 100%)",
        "luxury-gradient": "linear-gradient(135deg, #3D2314 0%, #6B3A2A 50%, #3D2314 100%)",
        "champagne-gradient": "linear-gradient(135deg, #F5E6D3 0%, #E8D5C4 50%, #F5E6D3 100%)",
      },
      boxShadow: {
        luxury: "0 20px 60px -15px rgba(61, 35, 20, 0.3)",
        "luxury-sm": "0 10px 30px -10px rgba(61, 35, 20, 0.2)",
        gold: "0 10px 40px -10px rgba(212, 175, 55, 0.4)",
        "card-hover": "0 30px 80px -20px rgba(61, 35, 20, 0.25)",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out",
        "fade-in-up": "fadeInUp 0.8s ease-in-out",
        "slide-in-right": "slideInRight 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
