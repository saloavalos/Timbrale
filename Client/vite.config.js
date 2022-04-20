import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: "1414",
  }, // to visualize project from another device on same network I use host: "0.0.0.0", I also changed default 3000 port
});
