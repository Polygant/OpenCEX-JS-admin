import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-ignore
import path from "path";
const baseUrl = process.env.VITE_BASE_URL
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  publicDir: path.resolve(__dirname, "./src/static"),
  // base: `/${baseUrl}/`,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
  // optimizeDeps: {
  //   include: ['~/../public/TradingView/charting_library/charting_library.min.js']
  // }
});
