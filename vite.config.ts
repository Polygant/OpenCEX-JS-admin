import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-ignore
import path from "path";
import localConfig from './src/local_config';
export default defineConfig({
  plugins: [vue()],
  publicDir: path.resolve(__dirname, "./src/static"),
  base: `/${localConfig.base}`,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
