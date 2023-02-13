<template>
  <div class="level mt-5">
    <div class="level-left">
      <div class="level-item">
        <h2 class="subtitle">Members</h2>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <div class="navbar-item">
          <form @submit.prevent="searchAction(searchKeyword)">
            <div class="field has-addons">
              <div class="control">
                <input v-model="searchKeyword" class="input" type="search" placeholder="Search Members Name" aria-label="Search">
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
    <article v-for="user in users" :key="user.id" class="post">
      <h4>
        {{user['user-name']}}
      </h4>
      <div class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <span>mail:</span> <a :href="`mailto:${user['user-mail']}`">{{user['user-mail']}}</a> <span>create date:</span> {{dateAction(user.createdAt)}} &nbsp; <span class="tag">Question</span>
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

const dateAction = (date: string):string => {
  return $dayjs(date).format('YYYY.MM.DD')
}

const apiUrl = config.MEMBERS_URL

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

const { data: user, error } = await useAsyncData(
  'mountains',
  () => $fetch(apiUrl, {
    method: 'GET',
    headers: headers,
    params: params
  })
)
if (error.value != null) {
  alert('エラーにより読み込みできませんでした。')
}

interface User {
  id: string,
  createdAt: string,
  'user-mail': string,
  'user-name': string
}
const users = ref<User[]>([])

let loadCheck = ref<Boolean>(false)
let loadEnd = ref<Boolean>(false)
let loadingStyle = {
  'display': 'flex',
  'justify-content': 'center',
  'padding': '40px 0 0'
}
let now = new Date()

const searchKeyword = ref<string>('')

const resetAction = () => {
  users.value = []
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
    const { data: user, error } = await useAsyncData(String(now.getTime()),
      () => $fetch(apiUrl, {
        method: 'GET',
        headers: headers,
        params: params
      })
    )
    $state.loaded()
    if (user.value.contents.length === 0) {
      $state.complete()
      loadCheck.value = true
      loadEnd.value = true
      infiniteId.value += 1
    } else {
      user.value.contents.forEach((v) => {
        users.value.push(v)
      })
    }
    if (error.value != null) {
      alert('エラーにより読み込みできませんでした。')
    }
  }
}

const searchAction = async (keyword: string) => {
  resetAction()
  params.filters = `user-name[equals]${keyword}`

  loadCheck.value = true
  loadEnd.value = true

  const { data: user, error } = await useAsyncData(String(now.getTime()),
    () => $fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      params: params
    })
  )
  if (user.value.contents.length === 0) {
    searchResult.value = true
  } else {
    users.value = user.value.contents
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

  const { data: user, error } = await useAsyncData(
    String(now.getTime()),
    () => $fetch(apiUrl, {
      method: 'GET',
      headers: headers,
      params: params
    })
  )

  if (user.value.contents.length === 0) {
    searchResult.value = true
  } else {
    users.value = user.value.contents
    loadCheck.value = false
    loadEnd.value = false
  }
  if (error.value != null) {
    alert('エラーにより読み込みできませんでした。')
  }
}

onMounted(() => {
  if (user.value.contents.length === 0) {
    searchResult.value = true
    loadEnd.value = true
  } else {
    users.value = user.value.contents
  }
})
</script>