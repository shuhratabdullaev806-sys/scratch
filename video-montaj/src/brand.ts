import { loadFont } from "@remotion/google-fonts/Outfit";

export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const brand = {
  name: "FAXR MADAD KONSALT",
  navy: "#0f172a",
  navyDeep: "#080d1a",
  primary: "#4361ee",
  primaryDark: "#3a0ca3",
  secondary: "#7209b7",
  accent: "#f72585",
  textMain: "#e2e8f0",
  textDim: "#94a3b8",
  gradient: "linear-gradient(120deg, #4361ee 0%, #7209b7 55%, #f72585 100%)",
  glassBg: "rgba(15, 23, 42, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.18)",
};
