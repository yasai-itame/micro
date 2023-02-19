<template>
  <div class="level mt-5">
    <div class="level-left">
      <div class="level-item">
        <h2 class="subtitle">Memo List</h2>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <div class="navbar-item">
          <form @submit.prevent="searchAction(searchKeyword, 'title')">
            <div class="field has-addons">
              <div class="control">
                <input v-model="searchKeyword" class="input" type="search" placeholder="Search Title" aria-label="Search">
              </div>
              <div class="control">
                <button class="button" type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 24px;height: 24px">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
          <button @click="allAction" class="button is-primary ml-1" href="#">ALL</button>
        </div>
      </div>
    </div>
  </div>
  <div class="box content mt-5">
    <article v-for="(list, index) in lists" :key="list.id" class="post">
      <h4>
        <NuxtLink :to="`/detail/${list.id}`">{{list.title}}</NuxtLink>
      </h4>
      <div class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <span>author:</span> <a @click="searchAction(list.author, 'author')">{{list.author}}</a> <span>create date:</span> {{dateAction(list.createdAt)}} &nbsp; <button @click="deleteAction(list.id, index)" class="button is-small is-danger" :disabled="disabledCheck(list.author)">Delete</button>
            </p>
          </div>
        </div>
      </div>
    </article>

    <article v-if="searchResult">
      <h4>No Result</h4>
    </article>

    <div :class="{'is-hidden': loadCheck}">
      <div :style="loadingStyle">
        <InfiniteLoading :identifier="infiniteId" @infinite="loadData" />
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import InfiniteLoading from "v3-infinite-loading"
import "v3-infinite-loading/lib/style.css"
import { ref, onMounted } from "vue"
const config = useRuntimeConfig()
const { $dayjs } = useNuxtApp()
definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'MEMO',
  meta: [
    { name: 'description', content: 'This page displays a list of memos.'}
  ]
})

const dateAction = (date: string):string => {
  return $dayjs(date).format('YYYY.MM.DD')
}

const apiUrl = config.TO_DO_URL

const pager = ref<number>(0)
const limitCount = ref<number>(5)
const searchResult = ref<Boolean>(false)
const infiniteId = ref<number>(0)

const headers = {
  'Content-Type': 'application/json',
  'X-MICROCMS-API-KEY': config.MICROCMS_KEY
}
const params = {
  limit: limitCount.value,
  offset: pager.value
}

let now = new Date()

const { data: list, error } = await useAsyncData(
  String(now.getTime()),
  () => $fetch(apiUrl, {
    method: 'GET',
    headers: headers,
    params: params
  })
)
if (error.value != null) {
  alert('エラーにより読み込みできませんでした。')
}

interface List {
  id: string,
  author: string,
  title: string,
  contents: string
}
const lists = ref<List[]>([])

let loadCheck = ref<Boolean>(false)
let loadEnd = ref<Boolean>(false)
let loadingStyle = {
  'display': 'flex',
  'justify-content': 'center',
  'padding': '40px 0 0'
}

const searchKeyword = ref<string>('')

const resetAction = () => {
  lists.value = []
  pager.value = 0
  params.offset = 0
  searchResult.value = false
  infiniteId.value = 0
  if (params.filters) {
    delete params.filters
  }
}

const loadData = async ($state) => {
  if (!loadEnd.value) {
    pager.value++
    params.offset = limitCount.value * pager.value
    const { data: list, error } = await useAsyncData(String(now.getTime()),
      () => $fetch(apiUrl, {
        method: 'GET',
        headers: headers,
        params: params
      })
    )
    $state.loaded()
    if (list.value.contents.length === 0) {
      $state.complete()
      loadCheck.value = true
      loadEnd.value = true
      infiniteId.value += 1
    } else {
      list.value.contents.forEach((v) => {
        lists.value.push(v)
      })
    }
    if (error.value != null) {
      alert('エラーにより読み込みできませんでした。')
    }
  }
}

const searchAction = async (keyword: string, type: string) => {
  resetAction()
  if (type === 'title') {
    params.filters = `title[equals]${keyword}`
  } else if (type === 'author') {
    params.filters = `author[equals]${keyword}`
  }

  loadCheck.value = true
  loadEnd.value = true

  const { data: list, error } = await useAsyncData(String(now.getTime()),
    () => $fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      params: params
    })
  )
  if (list.value.contents.length === 0) {
    searchResult.value = true
  } else {
    lists.value = list.value.contents
    loadCheck.value = false
    loadEnd.value = false
  }
  if (error.value != null) {
    alert('エラーにより読み込みできませんでした。')
  }
}

const allAction = async () => {
  resetAction()

  loadCheck.value = true
  loadEnd.value = true

  const { data: list, error } = await useAsyncData(
    String(now.getTime()),
    () => $fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      params: params
    })
  )

  if (list.value.contents.length === 0) {
    searchResult.value = true
  } else {
    lists.value = list.value.contents
    loadCheck.value = false
    loadEnd.value = false
  }
  if (error.value != null) {
    alert('エラーにより読み込みできませんでした。')
  }
}

const deleteAction = async (id: string, index: number) => {
  let check = confirm('削除します。\nよろしいでしょうか。')
  if (check) {
    const {data, error} = await useAsyncData(
      String(now.getTime()),
      () => $fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
        headers: headers
      })
    )
    if (data.value != null) {
      alert('削除が完了いたしました。')
      lists.value.splice(index, 1)
    }
    if (error.value != null) {
      alert('エラーにより削除できませんでした。')
    }
  }
}

const disabledCheck = (author: string):Boolean => {
  let checkData = localStorage.getItem('userName')
  return author === checkData ? false : true
}

onMounted(() => {
  lists.value = list.value.contents
  if (list.value.contents.length === 0) {
    loadEnd.value = true
  }
})
</script>
