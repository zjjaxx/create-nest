import gradient from "gradient-string";
export const gradientBanner = gradient([
  { color: "#42d392", pos: 0 },
  { color: "#42d392", pos: 0.1 },
  { color: "#647eff", pos: 1 },
])(
  "A universal nestjs template"
);
export const defaultBanner = "A universal nestjs template"