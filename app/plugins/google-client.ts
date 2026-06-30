export default defineNuxtPlugin(() => {
  return {
    provide: {
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  };
});
