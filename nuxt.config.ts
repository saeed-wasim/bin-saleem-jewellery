// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css",
        "~/assets/css/scrollbar.css",
  ],
  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL || process.env.API_BASE_URL || "http://localhost:3001",
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
