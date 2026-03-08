// vite.config.js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: ".", // index.html があるディレクトリ
  base: "./", // 相対パス（ローカル動作用）
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets", // ← assets フォルダを固定名にしておくとパスが安定する！
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, "index.html"),
        detail: path.resolve(__dirname, "detail.html"),
      },
      output: {
        assetFileNames: "assets/[name]-[hash][extname]", // CSSや画像のパスを一定に
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 画像パスの動作安定のため
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
