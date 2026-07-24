import type { Config } from "tailwindcss";

/**
 * CAVAS design tokens.
 * Deliberately narrow palette: near-black canvas, LiDAR cyan accents,
 * UB royal blue used sparingly, hairline strokes for structure.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: "#0A0B0D", // page background
        panel: "#0D0F12", // slightly lifted surfaces
        ink: "#E8EAED", // primary text
        dim: "#8B93A1", // secondary text
        lidar: "#5EEAD4", // primary glow — LiDAR return
        beam: "#38BDF8", // secondary glow
        ub: "#005BBB", // University at Buffalo royal blue — small doses only
      },
      borderColor: {
        hairline: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
    },
  },
  plugins: [],
};
export default config;
