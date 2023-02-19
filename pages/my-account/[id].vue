<template>
  <div class="box content mt-5">
    <form @submit.prevent="callFireBaseUser(name, mail, oldPassword, newPassword, microId)">
      <div class="field">
        <label for="name" class="label">User Name</label>
        <div class="control">
          <input id="name" v-model="name" class="input is-medium" type="text">
        </div>
      </div>
      <div class="field">
        <label for="mail" class="label">Mail</label>
        <div class="control">
          <input type="email" id="mail" v-model="mail" class="input is-medium">
        </div>
      </div>
      <div class="field">
        <label for="oldPassword" class="label">oldPassword</label>
        <div class="control">
          <input type="password" id="oldPassword" v-model="oldPassword" class="input is-medium">
        </div>
      </div>
      <div class="field">
        <label for="newPassword" class="label">newPassword</label>
        <div class="control">
          <input type="password" id="newPassword" v-model="newPassword" class="input is-medium">
        </div>
      </div>
      <div class="control">
        <button class="button is-link is-fullwidth has-text-weight-medium is-medium">UpDate</button>
      </div>
    </form>
    <div class="control">
      <button class="button is-danger is-fullwidth has-text-weight-medium is-medium mt-2">Delete</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
definePageMeta({
  middleware: ['auth']
})
const config = useRuntimeConfig()
const route = useRoute()
const { id } = route.params
const { callFireBaseUser } = useAuth()

useHead({
  title: 'My Account | MEMO',
  meta: [
    { name: 'description', content: 'This page allows you to edit your account.'}
  ]
})

const apiUrl = config.MEMBERS_URL

const name = ref<string>('')
const mail = ref<string>('')
const oldPassword = ref<string>('')
const newPassword = ref<string>('')
const microId = ref<string>('')

const headers = {
  'Content-Type': 'application/json',
  'X-MICROCMS-API-KEY': config.MICROCMS_KEY
}

let now = new Date()

const { data: user, error } = await useAsyncData(
  String(now.getTime()),
  () => $fetch(`${apiUrl}/${id}`, {
    method: 'GET',
    headers: headers
  })
)

if (error.value != null) {
  alert('エラーにより読み込みできませんでした。')
}

onMounted(() => {
  name.value = user.value['user-name']
  mail.value = user.value['user-mail']
  microId.value = id
})
</script>