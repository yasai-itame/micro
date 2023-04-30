<template>
  <div class="columns" id="mail-app">
    <aside class="column is-2 aside">
      <div class="column">
        <p class="menu-label">{{dateAction(today)}}</p>
        <ul class="menu-list">
          <li>
            <div>Menu</div>
            <ul>
              <li>
                <NuxtLink to="/">Memo List</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/create-memo/">Create Memo</NuxtLink>
              </li>
              <!-- <li>
                <NuxtLink :to="`/my-account/${loginId}`">My Account</NuxtLink>
              </li> -->
              <li>
                <NuxtLink to="/members/">Members</NuxtLink>
              </li>
              <li><a @click="signOut">Log Out</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </aside>
    <div class="column is-10 messages hero is-fullheight" id="message-feed">
      <div class="column is-12">
        <section class="hero is-info welcome is-small">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">Hello {{loginName}}</h1>
              <h2 class="subtitle">
                  Let's write a note!
              </h2>
            </div>
          </div>
        </section>
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { userMailStore } from "@/store/mail"
const config = useRuntimeConfig()
const router = useRouter()
const { $dayjs } = useNuxtApp()
const { userMail, signOut } = useAuth()

const dateAction = (date: string):string => {
  return $dayjs(date).format('YYYY.MM.DD')
}

const apiUrl = config.MEMBERS_URL

const headers = {
  'Content-Type': 'application/json',
  'X-MICROCMS-API-KEY': config.MICROCMS_KEY
}

let now = new Date()

if (localStorage.getItem('userMail') === null || localStorage.getItem('userMail') === 'undefined') {
  router.push({ path: '/login' })
}

let mail = ref<string>('')
mail.value = localStorage.getItem('userMail')
const { data: user } = await useAsyncData(
  String(now.getTime()),
  () => $fetch(apiUrl, {
    method: 'GET',
    headers: headers,
    params: {
      limit: 1,
      filters: `user-mail[equals]${mail.value}`
    }
  })
)

const today = new Date()
const loginName = ref<string>('')
const loginId = ref<string>('')

onMounted(() => {
  loginName.value = user.value.contents[0]['user-name']
  loginId.value = user.value.contents[0]['id']
  localStorage.setItem('userName', loginName.value)
})
</script>
<style lang="scss">
aside {
  display: block;
  background-color: #F9F9F9;
  .compose {
    height: 95px;
    margin: 0 -10px;
    padding: 25px 30px;
  }
}
.menu-label {
  color: #8F99A3;
  letter-spacing: 1.3;
  font-weight: 700;
}
.menu-list {
  div {
    color: #0F1D38;
    font-size: 14px;
    font-weight: 700;
  }
  a {
    color: #0F1D38;
    font-size: 14px;
    font-weight: 700;
    &:hover {
      background-color: transparent;
      color: #276cda;
    }
    &.is-active {
      background-color: transparent;
      color: #276cda;
      font-weight: 700;
    }
  }
}
.level {
  padding-bottom: 1rem;
  border-bottom: 1px solid lightgrey;
  h2 {
    color: #6c5ce7;
    font-weight: 600;
  }
}
.media-content {
  p {
    font-size: 14px;
    line-height: 2.3;
    font-weight: 700;
    color: #8F99A3;
  }
  .content {
    span {
      color: #333;
    }
  }
}
.post {
  margin: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E6EAEE;
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}
.navbar-item {
  padding: 0;
  align-items: start;
}
</style>