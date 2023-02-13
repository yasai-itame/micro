import { defineNuxtPlugin } from "#app"

export default defineNuxtPlugin(() => {
  const router = useRouter()
  router.afterEach((to, from) => {
    console.log(to)
    console.log(from)
  })
})