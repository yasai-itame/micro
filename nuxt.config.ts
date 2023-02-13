// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ['assets/scss/index.scss'],
  modules: [
    ['@pinia/nuxt',
    { autoImports: ['defineStore', 'acceptHMRUpdate']}],
  ],
  imports: {
    dirs: ['./store'],
  },
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  },
  runtimeConfig: {
    TO_DO_URL: process.env.TO_DO_URL,
    MEMBERS_URL: process.env.MEMBERS_URL,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
    FIREBASE_STORAGE_BUKET: process.env.FIREBASE_STORAGE_BUKET || '',
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
    MICROCMS_KEY: process.env.MICROCMS_KEY || '',
    public: {
      TO_DO_URL: process.env.TO_DO_URL,
      MEMBERS_URL: process.env.MEMBERS_URL,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || '',
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || '',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
      FIREBASE_STORAGE_BUKET: process.env.FIREBASE_STORAGE_BUKET || '',
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || '',
      MICROCMS_KEY: process.env.MICROCMS_KEY || ''
    }
  }
})
