<template>
  <section class="hero is-success is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h3 class="title has-text-black">Create Account</h3>
          <hr class="login-hr">
          <div class="box">
            <form @submit.prevent="signUp(emailValue, passwordValue, nameValue)">
              <div class="field">
                <div class="control">
                  <input v-model="emailValue" class="input is-large" type="email" placeholder="Your Email" autofocus="">
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input v-model="nameValue" class="input is-large" type="text" placeholder="Your Name" autofocus="">
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <input v-model="passwordValue" class="input is-large" type="password" placeholder="Your Password">
                </div>
              </div>
              <button class="button is-block has-text-white has-background-primary is-large is-fullwidth mt-2">Create Account <i class="fa fa-sign-in" aria-hidden="true"></i></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from "vue"
const { signUp } = useAuth()
const emailValue = ref<string>('')
const nameValue = ref<string>('')
const passwordValue = ref<string>('')
definePageMeta({
  layout: false
})
useHead({
  title: 'Create Account | MEMO',
  meta: [
    { name: 'description', content: 'This page displays a list of memos.'}
  ]
})
</script>
<style lang="scss">
.hero.is-success {
  background: #F2F6FA;
}
.box {
  margin-top: 5rem;
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