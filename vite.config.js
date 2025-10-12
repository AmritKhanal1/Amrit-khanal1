import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/AmritKhanal1/", // ✅ Add the trailing slash
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
