<template>
  <div class="box content mt-5">
    <div class="top">
      <div class="address">
        <h1 class="is-size-4">{{title}}</h1>
        <div class="name"><span>author: </span>{{author}}</div>
        <div class="date">creation date: {{createdAt}}</div>
        <div class="date">update date: {{updatedAt}}</div>
      </div>
      <hr>
      <div class="content" v-html="contents">
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()
const { $dayjs } = useNuxtApp()
const { id } = route.params
const { data: results, pending, error, refresh } = await useAsyncData(
  'mountains',
  () => $fetch(`https://8jutswr0k6.microcms.io/api/v1/to-do/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': config.MICROCMS_KEY
    }
  })
)
console.log(results.value)
console.log(results.value.contents)

const author = ref<string>('')
const title = ref<string>('')
const createdAt = ref<string>('')
const updatedAt = ref<string>('')
const contents = ref<string>('')
const dateAction = (date: string):string => {
  return $dayjs(date).format('YYYY.MM.DD')
}
author.value = results.value.author
title.value = results.value.title
createdAt.value = dateAction(results.value.createdAt)
updatedAt.value = dateAction(results.value.updatedAt)
contents.value = results.value.contents
definePageMeta({
  middleware: ['auth']
})
</script>
<style lang="scss">
.address {
  .name {
    font-weight: bold;
  }
  span,
  .date {
    font-weight: bold;
    font-size: 12px;
    color: #B6C7D1;
  }
}
</style>