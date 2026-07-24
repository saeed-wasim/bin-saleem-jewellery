// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css",
        "~/assets/css/scrollbar.css",
  ],
  runtimeConfig: {
    public: {
<<<<<<< Updated upstream
      backendUrl: process.env.BACKEND_URL || process.env.API_BASE_URL || "http://localhost:3001",
=======
      apiBaseUrl: process.env.API_BASE_URL || "http://localhost:3001",
      requireAuth: process.env.REQUIRE_AUTH === "true",
>>>>>>> Stashed changes
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
