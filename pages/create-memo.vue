<template>
  <div class="box content mt-5">
    <form @submit.prevent="submitMemo(title, memo)">
      <div class="field">
        <label for="title" class="label">Title</label>
        <div class="control">
          <input id="title" v-model="title" class="input is-medium" type="text">
        </div>
      </div>
      <div class="field">
        <label for="memo" class="label">Memo</label>
        <div class="control">
          <textarea id="memo" v-model="memo" class="textarea is-medium" rows="10"></textarea>
        </div>
      </div>
      <div class="control">
        <button class="button is-link is-fullwidth has-text-weight-medium is-medium">Send Memo</button>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
definePageMeta({
  middleware: ['auth']
})
const config = useRuntimeConfig()
const title = ref<string>('')
const memo = ref<string>('')
const loginName = ref<string>('')

const apiUrl = config.TO_DO_URL

const submitMemo = async (title: string, memo: string) => {
  let check = confirm('登録します。\nよろしいでしょうか。')
  if (check) {
    if (!title) {
      alert('Titleは必須です。')
      return false
    }
    const {data, error} = await useAsyncData(
      'mountains',
      () => $fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MICROCMS-API-KEY': config.MICROCMS_KEY
        },
        body: {
          'author': loginName.value,
          'title': title,
          'contents': memo
        }
      })
    )
    if (data.value != null) {
      alert('登録が完了いたしました。')
    }
    if (error.value != null) {
      alert('エラーにより登録できませんでした。')
    }
  }
}

onMounted(() => {
  if (localStorage.getItem('userName') === null || localStorage.getItem('userName') === 'undefined') {
    router.push({ path: '/login' })
  } else {
    loginName.value = localStorage.getItem('userName')
  }
})
</script>