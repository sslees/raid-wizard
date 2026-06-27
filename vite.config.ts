import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/raid-wizard/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
