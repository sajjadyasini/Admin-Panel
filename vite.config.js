import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        products: resolve(import.meta.dirname, "pages/products.html"),
        orders: resolve(import.meta.dirname, "pages/orders.html"),
        customers: resolve(import.meta.dirname, "pages/customers.html"),
        reports: resolve(import.meta.dirname, "pages/reports.html"),
        settings: resolve(import.meta.dirname, 'pages/settings.html'),
      },
    },
  },
});
