<template>
  <section class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-black">Login</h3>
          <hr class="login-hr">
          <p class="subtitle has-text-black">Please login to proceed.</p>
          <div class="box">
            <form @submit.prevent="signIn(emailValue, passwordValue)">
              <div class="field">
                <div class="control">
                  <input v-model="emailValue" class="input is-large" type="email" placeholder="Your Email" autofocus="">
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input v-model="passwordValue" class="input is-large" type="password" placeholder="Your Password">
                </div>
              </div>
              <button class="button is-block is-info is-large is-fullwidth">Login <i class="fa fa-sign-in" aria-hidden="true"></i></button>
              <NuxtLink to="/create-account" class="button is-block has-text-white has-background-primary is-large is-fullwidth mt-2">Create Account <i class="fa fa-sign-in" aria-hidden="true"></i></NuxtLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()
import { ref } from "vue"

const emailValue = ref<string>('')
const passwordValue = ref<string>('')

const { signIn } = useAuth()

definePageMeta({
  layout: false
})
</script>
<style lang="scss">
.hero.is-success {
  background: #F2F6FA;
}
.box {
  margin-top: 5rem;
}
.avatar {
  margin-top: -70px;
  padding-bottom: 20px;
  img {
    padding: 5px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 3px rgba(10,10,10,.1), 0 0 0 1px rgba(10,10,10,.1);
  }
}
input {
  font-weight: 300;
}
p {
  font-weight: 700;
  .subtitle {
    padding-top: 1rem;
  }
}
.login-hr{
  border-bottom: 1px solid black;
}
.has-text-black{
  color: black;
}
.field{
  padding-bottom: 10px;
}
.fa{
  margin-left: 5px; 
}
</style>